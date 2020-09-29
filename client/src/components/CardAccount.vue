<template>
  <div
    id="top-view"
    :class="{ minimized: true, flipped: flipped }"
    @click="setPage()"
  >
    <div class="linked-line" />
    <section class="front card">
      <img
        id="account-img"
        class="d-block mx-auto"
        src="../assets/user-2.png"
      />
      <div id="account-text" @click="setPage()">
        <h4 class="mt-3 grey--text text--darken-3">회원님 환영합니다.</h4>
      </div>
    </section>
    <section class="back card">
      <img src="@/assets/profile-sample.jpeg" />
      <h1>Account</h1>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

interface Token {
  user_id: string;
  expires_in: number;
  created: number;
  updated: number;
}

interface Member {
  user_id: string;
  user_level: string;
  created: number;
  updated: number;
}

@Component
export default class CardAccount extends Vue {
  @Prop() readonly minimized!: boolean;
  get flipped(): boolean {
    return this.$store.getters.getViewMode === "reporting";
  }

  public setPage() {
    if (this.minimized) this.$store.commit("setPage", "account");
  }
}
</script>

<style lang="scss" scoped>
#top-view {
  z-index: 4;
  .linked-line {
    width: calc(40vw - 5.5em);
    margin-left: calc(5em - 40vw);
  }
  .front {
    overflow: visible;
    margin-top: 7.5em;
    background: linear-gradient(45deg, #dcdcdc, #f1f1f1);
    #account-img {
      width: 4em;
      height: 4em;
      filter: grayscale(0.5);
    }
    #account-text {
      width: 17em;
      position: absolute;
      margin-top: 2.5em;
      margin-left: -6.5em;
      text-align: center;
      pointer-events: none;
    }
  }
  .back {
    background: white;
    img {
      margin-top: -2em;
      margin-left: -2em;
      width: 9em;
      height: 9em;
      object-fit: cover;
    }
  }
  &.active {
    .card {
      transform: scale(1.5);
    }
  }
}
</style>
