<template>
  <div id="top-view" :class="{ minimized: minimized, side: side, flipped: flipped }">
    <div class="linked-line" />
    <section class="front card pa-0">
      <v-icon size="4.25em" class="ma-6" color="white">mdi-calendar</v-icon>
      <div class="description">
        <v-calendar
          ref="calendar"
          v-model="value"
          dark
          color="primary"
          type="4day"
          category-show-all
          first-time="07:00"
          interval-count="15"
          :weekdays="[1, 2, 3, 4, 5]"
          :categories="categories"
          :events="eventsWithTempNew"
          :event-color="getEventColor"
          :event-ripple="false"
          @mousedown:event="startDrag"
          @mousedown:time="startTime"
          @mousemove:time="mouseMove"
          @mouseup:time="endDrag"
          @mouseleave.native="cancelDrag"
        >
          <template #day-body="{ date, week }">
            <div
              class="v-current-time"
              :class="{ first: date === week[0].date }"
              :style="{ top: nowY }"
            ></div>
          </template>
          <template #event="{ event, timed, eventSummary }">
            <div class="v-event-draggable" v-html="eventSummary() + '<p>'+event.category+'</p>'"></div>
            <div v-if="timed" class="v-event-drag-bottom" @mousedown.stop="extendBottom(event)"></div>
          </template>
        </v-calendar>
      </div>
    </section>
    <section class="back card">
      <h2>Plane 리포트</h2>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Event, LoadedEvent, Tms, CustomDate } from "../types/timetable.model";

@Component
export default class CardCalendar extends Vue {
  @Prop() readonly minimized!: boolean;
  @Prop() readonly side!: boolean;
  private loaded = false;
  private value = "";
  private colors: Array<string> = [
    "red",
    // "rgb(106 143 179)",
    // "#999999",
    // "#999999",
    // "#999999",
    // "#999999",
    // "#999999",
    // "#999999",
    // "#999999",
    // "#999999",
  ];
  // private colors: Array<string> = [
  //   "#2196F3",
  //   "#3F51B5",
  //   "#673AB7",
  //   "#00BCD4",
  //   "#4CAF50",
  //   "#FF9800",
  //   "#757575",
  // ];
  private names: Array<string> = [
    "Meeting",
    "Holiday",
    "PTO",
    "Travel",
    "Event",
    "Birthday",
    "Conference",
    "Party",
  ];
  private categories: Array<string> = ["Saturn", "Hay"];
  private dragEvent: Event | LoadedEvent | null = null;
  private dragStart: number | null = null;
  private dragTime: number | null = null;
  private createEvent: Event | null = null;
  private createStart: number | null = null;
  private extendOriginal: number | null = null;

  mounted() {
    this.loaded = true;
    this.updateTime();
    this.$store.commit("loadEvents");
    // this.addBulkEvents();
  }

  get flipped(): boolean {
    return this.$store.getters.getViewMode === "reporting";
  }

  get cal(): any {
    return this.loaded ? this.$refs.calendar : null;
  }

  get nowY(): string {
    return this.cal ? this.cal.timeToY(this.cal.times.now) + "px" : "-10px";
  }

  get events(): Array<LoadedEvent> {
    return this.$store.getters.getEvents;
  }

  set events(newVal) {
    this.$store.commit("addBulkEvents", newVal);
  }

  get eventsWithTempNew(): Array<Event | LoadedEvent> {
    if (this.createEvent === null) return this.events;
    return [...this.events, this.createEvent];
  }

  public updateTime() {
    setInterval(() => this.cal.updateTimes(), 60 * 1000);
  }

  public startDrag({ event, timed }: { event: Event; timed: boolean }) {
    console.debug("start dragging....");
    if (event && timed) {
      this.dragEvent = event;
      this.dragTime = null;
      this.extendOriginal = null;
    }
  }

  public startTime(tms: Tms) {
    const mouse = this.toTime(tms);

    if (this.dragEvent != null && this.dragTime == null) {
      const start: number | null = this.dragEvent!.start;
      this.dragTime = mouse - start;
    } else {
      this.createStart = this.roundTime(mouse);
      this.createEvent = {
        registered: false,
        name: `Event #${this.events.length}`,
        color: this.rndElement(["#345"]),
        start: this.createStart,
        end: this.createStart,
        timed: true,
        collaborator: null,
        category: null,
        memo: "",
      };

      // NOTE: This add function is moved to endDrag();
      // this.events.push(this.createEvent);
      // this.$store.commit("setNewEvent", this.createEvent);
    }
  }

  public extendBottom(event: Event | LoadedEvent) {
    console.debug("extendBottom()", event);
    this.createEvent = event;
    this.createStart = event.start;
    this.extendOriginal = event.end;
  }

  public mouseMove(tms: Tms) {
    const mouse = this.toTime(tms);

    if (this.dragEvent && this.dragTime !== null) {
      const start = this.dragEvent.start;
      const end = this.dragEvent.end;
      const duration = end - start;
      const newStartTime = mouse - this.dragTime;
      const newStart = this.roundTime(newStartTime);
      const newEnd = newStart + duration;

      this.dragEvent.start = newStart;
      this.dragEvent.end = newEnd;
    } else if (this.createEvent && this.createStart !== null) {
      const mouseRounded = this.roundTime(mouse, false);
      const min = Math.min(mouseRounded, this.createStart);
      const max = Math.max(mouseRounded, this.createStart);

      this.createEvent.start = min;
      this.createEvent.end = max;
    }
  }

  public endDrag() {
    console.debug(this.dragEvent, this.createEvent, this.extendOriginal);
    if (this.dragEvent) {
      this.$store.commit("resetNewEvent");
      this.$store.commit("setSelectedEvent", this.dragEvent);
    } else if (this.createEvent) {
      this.$store.commit("setNewEvent", this.createEvent);
    }
    // if (this.dragEvent) this.$store.commit("setSelectedEvent", this.dragEvent);
    // else if (this.createEvent)
    //   this.$store.commit("setNewEvent", this.createEvent);

    this.dragTime = null;
    this.dragEvent = null;
    this.createEvent = null;
    this.createStart = null;
    this.extendOriginal = null;
  }

  public cancelDrag() {
    if (this.createEvent) {
      if (this.extendOriginal) {
        this.createEvent.end = this.extendOriginal;
      } else {
        const i = this.eventsWithTempNew.indexOf(this.createEvent);
        if (i !== -1) {
          this.events.splice(i, 1);
        }
      }
    }

    this.createEvent = null;
    this.createStart = null;
    this.dragTime = null;
    this.dragEvent = null;
  }

  public roundTime(time: number, down = true) {
    const roundTo = 15; // minutes
    const roundDownTime = roundTo * 60 * 1000;

    return down
      ? time - (time % roundDownTime)
      : time + (roundDownTime - (time % roundDownTime));
  }
  public toTime(tms: Tms) {
    return new Date(
      tms.year,
      tms.month - 1,
      tms.day,
      tms.hour,
      tms.minute
    ).getTime();
  }
  public getEventColor(event: Event | LoadedEvent) {
    const rgb = parseInt(event.color.substring(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    return event === this.dragEvent
      ? `rgba(${r}, ${g}, ${b}, 0.7)`
      : event === this.createEvent
      ? `rgba(${r}, ${g}, ${b}, 0.7)`
      : event.color;
  }
  public addBulkEvents({ start, end }: { start: CustomDate; end: CustomDate }) {
    const events: Array<Event> = [];

    const min = new Date(`${start.date}T00:00:00`).getTime();
    const max = new Date(`${end.date}T23:59:59`).getTime();
    const days = (max - min) / 86400000;
    const eventCount = this.rnd(days, days + 20);

    for (let i = 0; i < eventCount; i++) {
      const timed = this.rnd(0, 3) !== 0;
      const firstTimestamp = this.rnd(min, max);
      const secondTimestamp = this.rnd(2, timed ? 8 : 288) * 900000;
      const start = firstTimestamp - (firstTimestamp % 900000);
      const end = start + secondTimestamp;

      events.push({
        category: null,
        collaborator: "",
        color: this.rndElement(this.colors),
        end,
        memo: "",
        name: this.rndElement(this.names),
        registered: false,
        start,
        timed,
      });
    }
    this.$store.commit("addBulkEvents", events);
  }
  public rnd(a: number, b: number) {
    return Math.floor((b - a + 1) * Math.random()) + a;
  }
  public rndElement(arr: Array<any>) {
    return arr[this.rnd(0, arr.length - 1)];
  }
}
</script>

<style lang="scss" scoped>
#top-view {
  position: relative;
  width: 100%;
  height: 70vh;
  margin-top: 0;
  // overflow: hidden;
  z-index: 1;
  .linked-line {
    width: calc(40vw - 3.5em);
    margin-left: calc(12.5em - 40vw);
  }
  .front.card {
    overflow: auto;
    background: linear-gradient(45deg, #636363, #5a5a5a);
    .v-calendar {
      // height: calc(100% - 7em);
      background: none !important;
      user-select: none;
    }
  }

  &.side {
    width: 100%;
    .card {
      &:hover {
        transform: none;
      }
    }
    // height: 7em;
    // margin-top: 4em;
    // border-radius: 50%;
    // .description {
    //   opacity: 0;
    //   pointer-events: none;
    // }
  }
}

.v-event-draggable {
  padding-left: 6px;
}

.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}

.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;

  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: "";
  }

  &:hover::after {
    display: block;
  }
}
</style>

<style lang="scss">
.v-calendar {
  &,
  * {
    border-color: rgba(255, 255, 255, 0.3) !important;
  }
  .v-event-timed {
    border-radius: 1em !important;
  }
}
#top-view .theme--dark.v-calendar-events .v-event-timed {
  border-color: rgba(255, 255, 255, 0.3) !important;
}
</style>
