<template>
  <div id="top-view" :class="{ minimized: minimized || changed, flipped: flipped }">
    <section class="front card px-0">
      <div class="info-box description" :class="{ full: !availableCategories.length }">
        <template v-if="selectedEvent.category == '주피터'">
          <img src="@/assets/pan-mtower-9-100.png" />
        </template>
        <template v-else-if="selectedEvent.category == '새턴'">
          <img src="@/assets/pan-mtower-9-200.png" />
        </template>
        <template v-else-if="selectedEvent.category == '우라누스'">
          <img src="@/assets/pan-mtower-9-300.png" />
        </template>
        <template v-else-if="selectedEvent.category == '플루토'">
          <img src="@/assets/pan-mtower-9-400.png" />
        </template>
        <template v-else>
          <h3>빈 회의실이 없습니다.</h3>
        </template>
      </div>

      <header>
        <img class="logo-img d-inline-block" src="@/assets/logo.png" />
        <h2>수정하기: {{ new Date(selectedEvent.start).toDateString() }}</h2>
      </header>

      <div class="calendar-box description">
        <div class="category-bar">
          <span class="d-inline-block" />
          <v-row class="d-inline-flex" style="width: calc(100% - 60px);" no-gutters>
            <v-col
              cols="3"
              :class="{
                active: availableCategories.includes(category),
                selected: selectedEvent.category == category,
              }"
              v-for="category in categories"
              :key="category"
              @click="selectCategory(category)"
            >
              <div class="category-box">{{ category }}</div>
            </v-col>
          </v-row>
        </div>
        <v-row no-gutters>
          <v-col cols="12">
            <v-calendar
              ref="calendarEvent"
              v-model="focus"
              color="primary"
              first-time="07:00"
              interval-count="15"
              type="category"
              category-show-all
              hide-header
              :start="selectedEvent.start"
              :categories="categories"
              :events="events"
              :event-color="getEventColor"
              @change="fetchEvents"
            />
          </v-col>
          <v-col class="form-box" cols="12">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="form.name"
                label="회의명"
                filled
                dark
                dense
                background-color="transparent"
              />
              <v-text-field
                v-model="form.collaborator"
                label="참여자"
                filled
                dark
                dense
                background-color="transparent"
              />
              <v-text-field
                v-model="form.memo"
                label="메모"
                filled
                dark
                dense
                background-color="transparent"
              />
              <!-- <v-select
                v-model="form.category"
                :items="availableCategories"
                label="회의실"
                dense
                required
              />-->
            </v-form>
            <!-- <v-form ref="form" class="px-5" v-model="valid" lazy-validation>
              <v-text-field v-model="form.name" label="회의명" dense />
              <v-text-field v-model="form.collaborator" label="참여자" dense />
              <v-text-field v-model="form.memo" label="메모" dense />
              <v-select
                v-model="form.category"
                :items="categories"
                label="회의실"
                dense
                required
              />
            </v-form>-->
            <v-btn :elevation="0" color="success" class="mr-3" @click="updateEvent()">
              <v-icon size="1.5em" class="mr-3">mdi-check</v-icon>수정하기
            </v-btn>
            <v-btn :elevation="0" color="error" class="mr-3" @click="removeEvent()">
              <v-icon size="1.5em" class="mr-3">mdi-trash-can-outline</v-icon>삭제하기
            </v-btn>
            <v-btn :elevation="0" outlined color="grey" @click="reset()">
              <v-icon size="1.5em" class="mr-3">mdi-cancel</v-icon>취소
            </v-btn>
            <!-- <v-btn outlined color="primary" class="mr-3" @click="removeEvent()">
              <v-icon size="1.5em" class="mr-3">mdi-check</v-icon>삭제하기
            </v-btn>
            <v-btn outlined color="grey" @click="cancel()">
              <v-icon size="1.5em" class="mr-3">mdi-cancel</v-icon>취소
            </v-btn>-->
          </v-col>
        </v-row>
      </div>
    </section>
    <section class="back card">
      <h1>Hello Event</h1>
    </section>
    <section v-show="mode === 'deleted'" class="deleted card">
      <v-icon size="4em" color="white" class="ma-10 mb-3">mdi-trash-can-outline</v-icon>
      <h3>삭제되었습니다.</h3>
    </section>
    <section v-show="mode === 'updated'" class="done card">
      <v-icon size="4em" color="white" class="ma-10 mb-3">mdi-check</v-icon>
      <h3>수정되었습니다.</h3>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { LoadedEvent, EmptyLoadedEvent } from "@/types/timetable.model";
import axios from "axios";

@Component
export default class CardSelectedEvent extends Vue {
  @Prop() readonly minimized = false;
  // @Prop() readonly blockData: object = {};
  private focus = "";
  private colors: Array<string> = [
    "blue",
    "indigo",
    "deep-purple",
    "cyan",
    "green",
    "orange",
    "grey darken-1",
  ];
  private valid = true;
  private changed = false;
  private mode: "" | "updated" | "deleted" = "";
  private availableCategories: Array<string> = [];
  private form: LoadedEvent = Object.assign({}, EmptyLoadedEvent);

  get selectedBlock(): object {
    return this.$store.getters.getSelectedBlock;
  }

  get flipped(): boolean {
    if (this.mode != "") return true;
    return this.$store.getters.getViewMode === "reporting";
  }

  get categories(): Array<string> {
    return this.$store.getters.getCategories;
  }

  get selectedEvent(): LoadedEvent {
    return this.$store.getters.getSelectedEvent;
  }

  set selectedEvent(newVal: LoadedEvent) {
    this.$store.commit("setSelectedEvent", newVal);
  }

  get events(): Array<LoadedEvent> {
    return this.$store.getters.getEvents;
  }

  @Watch("selectedEvent")
  onChangedSelectedEvent(newVal: LoadedEvent) {
    console.debug("LoadedEvent on CardSelectedEvent: ", newVal);
    this.fetchEvents();
  }

  @Watch("selectedBlock")
  public onChangedSelectedBlock() {
    this.changed = true;
    setTimeout(() => {
      this.changed = false;
    }, 3000);
  }

  mounted() {
    this.changed = true;
    setTimeout(() => {
      this.changed = false;
    }, 3000);
    (this.$refs.calendarEvent as any).checkChange();
  }

  public getEventColor(event: LoadedEvent) {
    return event.color;
  }
  public setToday() {
    this.focus = "";
  }
  public fetchEvents() {
    this.form = this.selectedEvent;
    this.setAvailableCategories();
    this.availableCategories.push(this.form.category);

    const startTime = new Date(this.form.start - 30 * 60000);
    (this.$refs.calendarEvent as any).scrollToTime(
      startTime.toTimeString().slice(0, 5)
    );
  }
  public selectCategory(category: string) {
    this.selectedEvent.category = category;

    const startTime = new Date(this.selectedEvent.start - 30 * 60000);
    (this.$refs.calendarEvent as any).scrollToTime(
      startTime.toTimeString().slice(0, 5)
    );
  }
  public setAvailableCategories() {
    // console.debug("on category: ");
    const start = this.form.start,
      end = this.form.end;

    const duplicated = this.events
      .filter(
        (event) =>
          (event.start < start && start < event.end) ||
          (event.start < end && end < event.end) ||
          (start < event.start && event.start < end)
      )
      .map((event) => event.category);

    this.availableCategories = this.categories.filter(
      (category: string) => !duplicated.includes(category)
    );
  }

  public updateEvent() {
    console.debug("on updating event: ", this.form.id, this.form);
    this.selectedEvent = this.form;
    axios
      .patch(process.env.VUE_APP_SERVER_URL + "events", {
        code: "clientId",
        event: this.form,
      })
      .then((res) => {
        console.debug("res: ", res);
        this.mode = "updated";
        this.$store.commit("updateSelectedEvent");
        setTimeout(() => {
          this.reset(false);
        }, 3000);
      })
      .catch((err) => {
        console.error("error: ", err, err.message);
      });
  }

  public removeEvent() {
    console.debug("on removing event: ", this.form.id, this.form);
    axios
      .delete(process.env.VUE_APP_SERVER_URL + "events", {
        data: {
          code: "clientId",
          eventId: this.form.id,
        },
      })
      .then((res) => {
        console.debug("res: ", res);
        this.mode = "deleted";
        this.$store.commit("deleteSelectedEvent");
        setTimeout(() => {
          this.reset(true);
        }, 3000);
        // this.toRight();
      })
      .catch((err) => {
        console.error("error: ", err, err.message);
      });
  }

  public reset(remove: boolean | null = false) {
    this.$store.commit("resetSelectedEvent");
    setTimeout(() => {
      this.form = Object.assign({}, EmptyLoadedEvent);
      this.mode = "";
    }, 2000);
  }
}
</script>

<style lang="scss" scoped>
#top-view {
  position: relative;
  width: calc(100% - 2em);
  height: 70vh;
  margin-top: 0;
  border-radius: 2em;
  z-index: 1;
  text-align: center;

  .front {
    overflow: auto;
    background: linear-gradient(45deg, #905b45, #462c23);
    padding-bottom: 0;
    header {
      color: white;
      .logo-img {
        display: inline-block;
        width: 2.5em;
        height: 2.5em;
        object-fit: contain;
        transition: width 1s, height 1s;
        vertical-align: middle;
        margin-right: 1em;
      }
      h2 {
        display: inline;
        line-height: 2em;
        font-size: 1.25em;
        vertical-align: middle;
      }
    }
    .description {
      opacity: 1;
      transition: opacity 0.5s;
    }
    .info-box {
      position: absolute;
      color: white;
      width: 100%;
      height: 10em;
      top: 2em;
      left: 0;
      opacity: 0.2;
      &.full {
        top: 7em;
        opacity: 0.5;
      }
      h3 {
        line-height: 2em;
      }
      img {
        width: 100%;
        max-height: 13em;
        object-fit: contain;
      }
    }
    .calendar-box {
      position: relative;
      border-radius: 2em;
      margin-top: 13em; // 10em + 3em;
      .category-bar {
        position: absolute;
        width: 100%;
        height: 18rem;
        margin-top: -3rem;
        display: flex;
        z-index: 4;
        span {
          width: 60px;
          height: 100%;
          // background: rgba(0, 0, 0, 0.2);
        }
        .row {
          height: 100%;
          .col {
            // background: rgba(0, 0, 0, 0.2);
            box-sizing: border-box;
            overflow: hidden;
            .category-box {
              color: #999;
              height: 100%;
              margin: 3rem 0.5em 0 0.5em;
              padding-top: 0.5em;
              border: 0 solid transparent;
              border-radius: 1em 1em 0 0;
              background: #eee;
              transition: border 0.5s, background 1s, margin 1s, padding 1s;
            }
            &:hover:not(.selected) {
              .category-box {
                margin: 0.5em 0.5em 0 0.5em;
              }
            }
            &.active {
              pointer-events: all;
              cursor: pointer;
            }
            &:not(.active) {
              pointer-events: none;
              .category-box {
                background: #999;
                opacity: 0.5;
              }
            }
            &.selected {
              .category-box {
                color: #fff;
                background: #f9c005;
                margin: 0;
                padding-top: 1em;
              }
            }
          }
        }
        z-index: 1;
      }
      .v-calendar {
        background: none;
        user-select: none;
        height: 15em;
        overflow: hidden;
      }
      .form-box {
        padding: 2em;
        box-shadow: 0px -4px 5px rgba(100, 100, 100, 0.75);
        background: linear-gradient(45deg, #35211a, #422920);
        z-index: 5;
        .v-text-field {
          opacity: 0.7;
          &.v-input--is-focused {
            opacity: 1 !important;
          }
        }
      }
    }
  }

  &.minimized {
    header {
      .logo-img {
        margin-left: 1.5em;
        width: 4em;
        height: 4em;
      }
      h2 {
        display: none;
        width: 0;
        height: 0;
      }
    }
    .description {
      opacity: 0;
      pointer-events: none;
    }
  }
}
</style>

<style lang="scss">
#event-container {
  .v-calendar-daily_head-weekday,
  .v-calendar-daily_head-day-label {
    display: none;
  }
  .v-calendar-category .v-calendar-category__category {
    line-height: 300%;
    font-size: small;
  }
  .v-calendar-daily {
    border: none !important;
  }
  .v-calendar-category .v-calendar-category__column {
    border: none !important;
  }
  .v-calendar-daily
    .v-calendar-daily__intervals-body
    .v-calendar-daily__interval-text {
    color: rgba(255, 255, 255, 0.7) !important;
  }
  .v-calendar-events .v-event-timed {
    pointer-events: none;
    margin-left: 10px !important;
    width: calc(100% - 10px) !important;
    z-index: 5;
    border: none !important;
  }
  .v-btn {
    border-radius: 1em;
  }
}
</style>
