<template>
  <div id="top-view" :class="{ minimized: minimized || changed, flipped: flipped }">
    <section class="front card">
      <img class="logo-img d-inline-block" src="@/assets/logo.png" />
      <div class="description">
        <h3>Existed Event</h3>
        <v-row>
          <v-col cols="12">
            <v-progress-circular color="blue" size="70" :value="60">
              60GB
              <br />
              <!-- <span class="subtitle">Storage</span> -->
            </v-progress-circular>
            <v-progress-circular class="ml-5" color="teal" size="70" :value="40">4GB</v-progress-circular>
            <v-progress-circular class="ml-5" color="indigo" size="70" :value="70">60%</v-progress-circular>
          </v-col>
        </v-row>
        <v-tabs center-active background-color="transparent">
          <v-tab>요약</v-tab>
          <v-tab>상태</v-tab>
          <v-tab>스케일링</v-tab>
        </v-tabs>
        <!-- <v-icon class="mt-5" size="3em">mdi-close-circle-outline</v-icon> -->
        <div class="mt-5 pl-4 text-justify">
          <li>이름: hello-world</li>
          <li>ID: b2b19b58-3017-4d70-87b5-90eadb42ad0a</li>
          <li>설명: to type "hello"</li>
          <li>프로젝트 ID: dab25fffe9954f6faf71c76fff3e304a</li>
          <li>상태: Active</li>
          <li>잠김: False</li>
          <li>가용 구역: Dev_Zone</li>
          <li>생성됨: 2020년 7월 8일 3:31 오후</li>
          <li>기간 (Age): 1주, 6일</li>
        </div>
      </div>
    </section>
    <section class="back card">
      <h1>Hello Event</h1>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class CardEvent extends Vue {
  @Prop() readonly minimized = false;
  //   @Prop() readonly blockData: object = {};
  private changed = false;

  get selectedBlock() {
    return this.$store.getters.getSelectedBlock;
  }

  get flipped() {
    return this.$store.getters.getViewMode === "reporting";
  }

  mounted() {
    this.changed = true;
    setTimeout(() => {
      this.changed = false;
    }, 3000);
  }

  @Watch("selectedBlock")
  public onChangedSelectedBlock() {
    this.changed = true;
    setTimeout(() => {
      this.changed = false;
    }, 3000);
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

  .front.card {
    overflow: auto;
    .logo-img {
      width: 70%;
      height: 3em;
      object-fit: contain;
      transition: width 1s, height 1s;
    }
    .description {
      opacity: 1;
      transition: opacity 0.5s;
    }
    h3 {
      margin-top: -0.25em;
      margin-bottom: 0.5em;
    }
    .subtitle {
      display: inline;
      font-size: 0.5em;
    }

    .v-calendar {
      background: none !important;
      user-select: none;
    }
  }

  &.minimized {
    .logo-img {
      width: 4em;
      height: 4em;
    }
    .description {
      opacity: 0;
      pointer-events: none;
    }
  }
}
</style>

