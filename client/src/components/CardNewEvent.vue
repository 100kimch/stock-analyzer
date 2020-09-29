<template>
  <div id="top-view" :class="{ minimized: minimized || changed, flipped: flipped }">
    <section class="front card px-0">
      <div class="info-box description" :class="{ full: !availableCategories.length }">
        <template v-if="newEvent.category == '주피터'">
          <img src="@/assets/pan-mtower-9-100.png" />
        </template>
        <template v-else-if="newEvent.category == '새턴'">
          <img src="@/assets/pan-mtower-9-200.png" />
        </template>
        <template v-else-if="newEvent.category == '우라누스'">
          <img src="@/assets/pan-mtower-9-300.png" />
        </template>
        <template v-else-if="newEvent.category == '플루토'">
          <img src="@/assets/pan-mtower-9-400.png" />
        </template>
        <template v-else>
          <h3>빈 회의실이 없습니다.</h3>
        </template>
      </div>

      <header>
        <img class="logo-img d-inline-block" src="@/assets/logo.png" />
        <h2>새 이벤트: {{ new Date(newEvent.start).toDateString() }}</h2>
      </header>

      <div class="calendar-box description">
        <div class="category-bar">
          <span class="d-inline-block" />
          <v-row class="d-inline-flex" style="width: calc(100% - 60px);" no-gutters>
            <v-col
              cols="3"
              :class="{
                active: availableCategories.includes(category),
                selected: newEvent.category == category,
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
              :start="newEvent.start"
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
            <v-btn :elevation="0" color="primary" class="mr-3" @click="registerEvent()">
              <v-icon size="1.5em" class="mr-3">mdi-check</v-icon>등록하기
            </v-btn>
            <v-btn :elevation="0" outlined color="grey" @click="reset()">
              <v-icon size="1.5em" class="mr-3">mdi-cancel</v-icon>취소
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </section>
    <section v-if="!form.registered" class="back card">
      <h1>Hello Event</h1>
    </section>
    <section v-else class="done card">
      <v-icon size="4em" color="white" class="ma-10 mb-3">mdi-check</v-icon>
      <h3>등록되었습니다.</h3>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Event, LoadedEvent, EmptyEvent } from "@/types/timetable.model";
import axios from "axios";

@Component
export default class CardNewEvent extends Vue {
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
  private availableCategories: Array<string> = [];
  private form: Event = Object.assign({}, EmptyEvent);

  get selectedBlock(): object {
    return this.$store.getters.getSelectedBlock;
  }

  get flipped(): boolean {
    if (this.form.registered) return true;
    return this.$store.getters.getViewMode === "reporting";
  }

  get categories(): Array<string> {
    return this.$store.getters.getCategories;
  }

  get newEvent(): Event {
    return this.$store.getters.getNewEvent;
  }

  set newEvent(newVal: Event) {
    this.$store.commit("setNewEvent", newVal);
  }

  get events(): Array<LoadedEvent> {
    return this.$store.getters.getEvents;
  }

  @Watch("newEvent")
  public onChangedNewEvent(newVal: Event) {
    console.debug("LoadedEvent on CardNewEvent: ", newVal);
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

  public getEventColor(event: Event) {
    // console.log("getting colors: ", event);
    if (event.category === this.newEvent.category) return "rgb(228, 175, 0)";
    else return "#333";
    // else return "red";
    // return event.color;
  }
  public setToday() {
    this.focus = "";
  }
  public fetchEvents() {
    this.form = this.newEvent;
    this.setAvailableCategories();
    this.form.category = this.availableCategories[0];

    const startTime = new Date(this.newEvent.start - 30 * 60000);
    (this.$refs.calendarEvent as any).scrollToTime(
      startTime.toTimeString().slice(0, 5)
    );
  }
  public selectCategory(category: string) {
    this.newEvent.category = category;

    const startTime = new Date(this.newEvent.start - 30 * 60000);
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

  public registerEvent() {
    axios
      .post(process.env.VUE_APP_SERVER_URL + "events", {
        code: "clientId",
        event: this.form,
      })
      .then((res) => {
        console.debug("res: ", res);
        console.debug("done.", this.form);
        this.form.registered = true;

        // this.form = Object.assign({}, EmptyEvent);
        setTimeout(() => {
          this.reset();
          this.$store.commit("addBulkEvents", res.data as LoadedEvent);
        }, 3000);
        // this.toRight();
      })
      .catch((err) => {
        console.error("error: ", err);
      });

    // setTimeout(() => {
    //   this.$store.commit("setNewEvent", this.form);
    // }, 3000);
    // setTimeout(() => {
    //   this.form = Object.assign({}, EmptyEvent);
    //   this.events = [];
    // }, 4000);
  }

  public reset() {
    this.$store.commit("resetNewEvent");
    setTimeout(() => {
      this.form = Object.assign({}, EmptyEvent);
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
    background: linear-gradient(45deg, #4a6b8c, #334455);
    padding-bottom: 0;
    header {
      color: #eee;
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
              transition: background 1s, margin 1s, padding 1s;
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
                background: #4b70f5;
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
        background: linear-gradient(45deg, #232e3a, #2f465d);
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

  // .front {
  //   overflow: auto;
  //   background: linear-gradient(45deg, #905b45, #462c23);
  //   padding-bottom: 0;
  //   header {
  //     color: white;
  //     .logo-img {
  //       display: inline-block;
  //       width: 2.5em;
  //       height: 2.5em;
  //       object-fit: contain;
  //       transition: width 1s, height 1s;
  //       vertical-align: middle;
  //       margin-right: 1em;
  //     }
  //     h2 {
  //       display: inline;
  //       line-height: 2em;
  //       font-size: 1.25em;
  //       vertical-align: middle;
  //     }
  //   }
  //   .description {
  //     opacity: 1;
  //     transition: opacity 0.5s;
  //   }
  //   .info-box {
  //     position: absolute;
  //     color: white;
  //     width: 100%;
  //     height: 10em;
  //     top: 2em;
  //     left: 0;
  //     opacity: 0.2;
  //     &.full {
  //       top: 7em;
  //       opacity: 0.5;
  //     }
  //     h3 {
  //       line-height: 2em;
  //     }
  //     img {
  //       width: 100%;
  //       max-height: 13em;
  //       object-fit: contain;
  //     }
  //   }
  //   .calendar-box {
  //     position: relative;
  //     border-radius: 2em;
  //     margin-top: 13em; // 10em + 3em;
  //     .category-bar {
  //       position: absolute;
  //       width: 100%;
  //       height: 18rem;
  //       margin-top: -3rem;
  //       display: flex;
  //       z-index: 4;
  //       span {
  //         width: 60px;
  //         height: 100%;
  //         // background: rgba(0, 0, 0, 0.2);
  //       }
  //       .row {
  //         height: 100%;
  //         .col {
  //           // background: rgba(0, 0, 0, 0.2);
  //           box-sizing: border-box;
  //           overflow: hidden;
  //           .category-box {
  //             color: #999;
  //             height: 100%;
  //             margin: 3rem 0.5em 0 0.5em;
  //             padding-top: 0.5em;
  //             border: 0 solid transparent;
  //             border-radius: 1em 1em 0 0;
  //             background: #eee;
  //             transition: border 0.5s, background 1s, margin 1s, padding 1s;
  //           }
  //           &:hover:not(.selected) {
  //             .category-box {
  //               margin: 0.5em 0.5em 0 0.5em;
  //             }
  //           }
  //           &.active {
  //             pointer-events: all;
  //             cursor: pointer;
  //           }
  //           &:not(.active) {
  //             pointer-events: none;
  //             .category-box {
  //               background: #999;
  //               opacity: 0.5;
  //             }
  //           }
  //           &.selected {
  //             .category-box {
  //               color: #fff;
  //               background: #f9c005;
  //               margin: 0;
  //               padding-top: 1em;
  //             }
  //           }
  //         }
  //       }
  //       z-index: 1;
  //     }
  //     .v-calendar {
  //       background: none;
  //       user-select: none;
  //       height: 15em;
  //       overflow: hidden;
  //     }
  //     .form-box {
  //       padding: 2em;
  //       box-shadow: 0px -4px 5px rgba(100, 100, 100, 0.75);
  //       background: linear-gradient(45deg, #35211a, #422920);
  //       z-index: 5;
  //       .v-text-field {
  //         opacity: 0.7;
  //         &.v-input--is-focused {
  //           opacity: 1 !important;
  //         }
  //       }
  //     }
  //   }
  // }

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
