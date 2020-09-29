<template>
  <div>
    <div class="debugging-bar" :class="{ hide: hideDebugging }">
      <v-row v-if="!hideDebugging">
        <v-col>
          <v-icon @click="hideDebugging = true">mdi-arrow-left</v-icon>
        </v-col>
        <v-col cols="5">
          <h3>Debugging Mode</h3>
          <p>{{ viewMode }}</p>
        </v-col>
        <v-col class="text-right" cols="6">
          <v-btn outlined class="mx-2 mb-2" @click="toLeft">to left</v-btn>
          <v-btn outlined class="mx-2 mb-2" @click="toRight">to right</v-btn>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col class="text-right">
          <v-icon @click="hideDebugging = false">mdi-arrow-right</v-icon>
        </v-col>
      </v-row>
    </div>
    <div
      id="container-ship"
      class="mt-5"
      :class="['layout-' + (pageName || 'default')]"
    >
      <transition-group name="paging" tag="div" class="row">
        <v-container
          :id="pageName + '-container'"
          :class="{
            minimized: currentPage != page,
            left: currentPage > page,
            current: currentPage == page,
            right: currentPage < page,
            hide: Math.abs(currentPage - page) >= 2,
          }"
          v-for="page in pageQueue"
          :key="page"
        >
          <template v-if="page == 2">
            <card-main :loaded="loaded" :minimized="currentPage != 2">
              <v-btn
                class="d-block mx-auto mt-4"
                @click="login"
                color="white"
                text
                >카카오 아이디로 로그인</v-btn
              >
            </card-main>
            <router-view />
          </template>
          <template v-else-if="page == 3">
            <card-account :minimized="currentPage != 3"></card-account>
          </template>
          <template v-else-if="page == 4">
            <card-market
              :minimized="currentPage != 4 && currentPage != 5"
              :side="currentPage == 5"
            />
            <!-- <card-calendar
              :minimized="currentPage != 4 && currentPage != 5"
              :side="currentPage == 5"
            ></card-calendar> -->
          </template>
          <template v-else-if="page == 5">
            <card-corp
              :minimized="currentPage != 5 && currentPage != 6"
              :size="currentPage == 6"
            />
          </template>
          <!-- <template v-else-if="page == 5 && popup == 'new'">
            <card-new-event :minimized="currentPage != 5"></card-new-event>
          </template>
          <template v-else-if="page == 5 && popup == 'old'">
            <card-selected-event
              :minimized="currentPage != 5"
            ></card-selected-event>
          </template> -->
        </v-container>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
// import { Block, Event, LoadedEvent } from "@/types/timetable.model";
import CardMain from "@/components/CardMain.vue";
import CardAccount from "@/components/CardAccount.vue";
import CardCalendar from "@/components/CardCalendar.vue";
import CardMarket from "@/components/CardMarket.vue";
import CardCorp from "@/components/CardCorp.vue";
import CardSelectedEvent from "@/components/CardSelectedEvent.vue";
import CardNewEvent from "@/components/CardNewEvent.vue";
import axios from "axios";

@Component({
  components: {
    CardMain,
    CardAccount,
    CardCalendar,
    CardMarket,
    CardCorp,
    CardSelectedEvent,
    CardNewEvent,
  },
})
export default class MainLayout extends Vue {
  private loaded = false;
  private hideDebugging = false;

  mounted() {
    setTimeout(() => {
      this.loaded = true;
    }, 2000);
    // console.log(this.$route.params.block);
    // console.log("kakao: ", document.Kakao);
  }

  get pageQueue(): Array<number> {
    return this.$store.getters.getPageQueue;
  }

  get pageName(): string {
    return this.$store.getters.getPageName;
  }

  get currentPage(): number {
    return this.$store.getters.getCurrentPage;
  }

  // get selectedBlock(): Block {
  //   return this.$store.getters.getSelectedBlock;
  // }

  get viewMode(): string {
    return this.$store.getters.getViewMode;
  }

  get popup(): string {
    return this.$store.getters.getPopup;
  }

  @Watch("popup")
  public onChangedPopup(newVal: string) {
    if (this.currentPage == 5 && newVal === "") this.toLeft();
    else if (this.currentPage == 4) this.toRight();
  }

  // @Watch("selectedEvent")
  // public onChangedSelectedEvent(newVal: LoadedEvent) {
  //   this.eventType = "old";
  //   if (this.currentPage == 4) this.toRight();
  // }

  // @Watch("newEvent")
  // public onChangedNewEvent(newVal: Event) {
  //   console.debug("onChangedNewEvent: ", newVal);
  //   this.eventType = "new";
  //   if (this.currentPage == 4) this.toRight();
  //   else if (this.currentPage == 5) {
  //     if (newVal == null || newVal.registered) this.toLeft();
  //   }
  // }

  // @Watch("selectedBlock")
  // public onChangedSelectedBlock(newVal: Block) {
  //   // if (newVal == oldVal) return;
  //   console.log("changed to " + newVal, this.pageName);
  //   this.pageName[8] = newVal.name;
  //   console.log(this.pageName);
  //   if (this.currentPage == 7) this.toRight();
  //   else {
  //     // this.toLeft();
  //     // setTimeout(() => {
  //     //   this.toRight();
  //     // }, 1000);
  //   }
  // }

  // public shuffle(): void {
  //   this.$store.commit("shufflePage");
  //   // this.pageQueue = _.shuffle(this.pageQueue);
  // }

  public toLeft(): void {
    this.$store.commit("setPageToLeft");
    // this.pageQueue.unshift(this.currentPage - 3);
    // this.pageQueue.pop();
  }

  public toRight(): void {
    this.$store.commit("setPageToRight");
    // this.pageQueue.push(this.currentPage + 3);
    // this.pageQueue.shift();
    // // this.pageQueue.push(this.pageQueue.shift());
    // if (this.currentPage == 3) {
    //   setTimeout(() => {
    //     if (this.currentPage == 3) {
    //       this.toRight();
    //     }
    //   }, 4000);
    // }
  }

  public handleSendToken(e: any): void {
    if (e.key != "timetable-user-code") return;
    const code = e.newValue;
    console.debug("received:", code);

    console.debug(
      "requesting: ",
      process.env.VUE_APP_CLIENT_ID,
      process.env.VUE_APP_CLIENT_URL
    );

    this.toRight();

    // axios
    //   .post(`${process.env.VUE_APP_SERVER_URL}members`, {
    //     token: code,
    //   })
    //   .then((res) => {
    //     console.debug("res: ", res);

    //     this.toRight();
    //   })
    //   .catch((err) => {
    //     console.error("error: ", err);
    //   });

    window.removeEventListener("storage", this.handleSendToken);
  }

  public login(): void {
    window.open(
      `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.VUE_APP_CLIENT_ID}&redirect_uri=${process.env.VUE_APP_CLIENT_URL}auth&response_type=code`,
      "_blank"
    );

    window.addEventListener("storage", this.handleSendToken);
    this.toRight();
  }
}
</script>

<style lang="scss" scoped>
@keyframes intro-main-container {
  to {
    opacity: 1;
    margin-top: calc(50vh - 15em);
  }
}

.paging-leave {
  transition: width 1s;
  width: 100%;
}
.paging-leave-to {
  width: 0;
}
// .flip-list-move {
//   transition: transform 1s;
// }
// .flip-list-leave-active {
//   transition: width 1s;
// }
// .flip-list-enter,
// .flip-list-leave-to {
//   width: 0;
// }

.debugging-bar {
  position: fixed;
  bottom: 0;
  width: 50em;
  height: 5.5rem;
  padding: 1em;
  background: #aaddaa99;
  margin-left: 0;
  transition: margin 0.5s;
  z-index: 10;
  backdrop-filter: blur(5px);
  * {
    mix-blend-mode: screen;
  }
  &.hide {
    margin-left: -46em;
  }
}

#container-ship {
  width: 120vw;
  height: 100%;
  max-height: calc(100vh - 5em);
  padding: 0;
  padding-top: 3em;
  white-space: nowrap;
  overflow: hidden;
  .container {
    display: inline-block;
    width: calc(60vw - 2em);
    height: calc(100vh - 4em);
    margin: 0;
    padding: 0;
    transition: width 1s, margin 0.5s, padding 0.5s;
    &.minimized {
      // padding-top: 4em;
      width: 20vw;
    }
    &.left {
      margin-left: 2em;
    }
    &.right {
      margin-right: 2em;
    }
    &.hide {
      width: 0 !important;
      overflow: hidden !important;
      &.left {
        margin-left: -20vw;
        margin-right: 20vw;
      }
      &.right {
        margin-left: 20vw;
      }
    }
  }
  &.layout-main {
    .container.right {
      opacity: 0.5;
    }
  }
  &.layout-market {
    .container.current {
      width: calc(80vw - 3em);
    }
    .container.right {
      width: 0;
      overflow: hidden;
    }
  }
  &.layout-corp {
    .container.left {
      width: calc(40vw - 1.5em);
    }
    .container.current {
      margin-left: 1.25em;
      width: calc(60vw - 1.75em);
    }
    .container.right {
      width: 0;
      overflow: hidden;
    }
  }
  &.layout-block {
    .container.left {
      width: calc(70vw - 3em);
    }
    .container.current {
      width: calc(30vw);
      margin-left: 1em;
    }
    .container.right {
      width: 0;
      overflow: hidden;
    }
  }
  // &.no-left {
  //   .container.left {
  //     width: 0;
  //     overflow: hidden;
  //   }
  //   .container.current {
  //     width: calc(80vw - 2em);
  //   }
  // }
}
</style>
