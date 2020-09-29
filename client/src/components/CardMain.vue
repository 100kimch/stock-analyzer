<template>
  <div
    id="top-view"
    :class="{
      loaded: loaded,
      minimized: !loaded || minimized,
      flipped: flipped,
    }"
    @click="setPage()"
  >
    <section class="front card">
      <img id="logo-img" class="d-block mx-auto" src="../assets/logo.png" />
      <div id="logo-text" class="text-center">
        <h1>Stock</h1>
        <h2>Analyzer</h2>
      </div>
      <div class="description">
        <slot>
          <v-btn
            class="d-block mx-auto mt-4"
            @click="$router.push({ path: 'cloud/blocks' })"
            color="#fd9a0f"
            text
            >Login with Kakao</v-btn
          >
          <v-btn
            class="d-block mx-auto"
            @click="$router.push({ path: 'cloud/blocks' })"
            color="#666"
            text
            >Login with Github</v-btn
          >
        </slot>
      </div>
    </section>
    <section class="back card">
      <h1>
        Stock
        <b>Analyzer</b>
      </h1>
      <p>Version 1.0.0</p>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class CardMain extends Vue {
  @Prop() readonly loaded!: boolean;
  @Prop() readonly minimized!: boolean;

  get flipped(): boolean {
    return this.$store.getters.getViewMode === "reporting";
  }

  public setPage() {
    if (this.minimized) this.$store.commit("setPage", "main");
  }
}
</script>

<style lang="scss" scoped>
#top-view {
  z-index: 5;
  width: 100%;
  max-width: 20em;
  border-radius: 2em;
  .front {
    width: 100%;
    height: 20em;
    overflow: hidden;
    background: linear-gradient(45deg, #00b5a4, #94e3fb);
    #logo-img {
      width: 8em;
      height: 8em;
      filter: hue-rotate(178deg);
      transition: width 1s, height 1s;
    }
    #logo-text {
      transition: opacity 0.5s;
      h1,
      h2 {
        color: #685349;
        font-size: 2em;
        display: inline-block;
      }
      h1 {
        font-weight: normal;
      }
    }
    .description {
      opacity: 0;
      transition: opacity 0.5s;
      pointer-events: none;
    }
  }
  .back {
    height: 20em;
    overflow: hidden;
  }
  &.loaded {
    // width: 100%;
    // max-width: 20em;
    // border-radius: 2em;
    .description {
      opacity: 1;
      pointer-events: all;
    }
  }
  &.minimized {
    .front.card {
      width: 7em;
      height: 7em;
      #logo-img {
        width: 4em;
        height: 4em;
      }
      #logo-text {
        opacity: 0;
      }
      .description {
        opacity: 0;
      }
    }
  }
}
</style>
