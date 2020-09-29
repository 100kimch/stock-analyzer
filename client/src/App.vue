<template>
  <v-app>
    <Wallpaper />

    <v-app-bar app color="#eee" flat>
      <v-row class="full-width" no-gutters>
        <v-col cols="4" class="text-justify">
          <h1 class="d-inline-block">Testing Page</h1>
        </v-col>
        <v-col cols="4" class="text-center">
          <v-btn-toggle id="view-mode-bar" v-model="viewMode" rounded outline mandatory>
            <v-btn color="transparent" value="monitoring">모니터링</v-btn>
            <v-btn value="reporting">리포팅</v-btn>
            <v-btn value="scaling">스케일링</v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="4" class="text-right">
          <p class="service-logo ma-0">
            Stock
            <b>analyzer</b>
          </p>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Wallpaper from "@/components/Wallpaper.vue";

@Component({
  components: {
    Wallpaper,
  },
})
export default class App extends Vue {
  mounted() {
    // Vue.loadScript("/client-reservation/src/assets/kakao.min.js");
  }
  get viewMode(): string {
    return this.$store.getters.getViewMode;
  }

  set viewMode(newVal) {
    this.$store.commit("setViewMode", newVal);
  }

  // @Watch('viewMode')
  // onChangedViewMode (newVal) {
  //   this.$store.commit('setViewMode', newVal);
  // }
}
</script>

<style lang="scss" scoped>
#app {
  background: l inear-gradient(45deg, #eee, #fff);
}
</style>

<style lang="scss">
@import "https://fonts.googleapis.com/css2?family=Stylish&family=Sunflower:wght@300;500;700&display=swap";
// $body-font-family: "Stylish";
$body-font-family: "Sunflower";

@keyframes not-flipped-temp {
  from {
    transform: rotateY(90deg);
  }
  50% {
    transform: rotateY(90deg);
  }
  to {
    transform: rotateY(0);
  }
}

.v-application {
  font-family: $body-font-family, sans-serif !important;
  font-weight: 300;
  position: fixed; // NOTE: due to Vuetify bug
}

::-webkit-scrollbar {
  display: none;
}

h1 {
  line-height: 2.5em;
  font-size: 1.2em;
}
.service-logo {
  line-height: 3.25rem;
  margin: 0;
  b {
    margin-left: -0.2em;
  }
}
.v-application .v-main .container > div {
  position: relative;
  margin: auto;
  transition: margin 0.5s;
  text-align: center;
  .linked-line {
    position: absolute;
    height: 0.25em;
    // border-top: 5px solid #ebebeb;
    margin-top: 10.5em;
    box-shadow: 5px 5px 15px #999, -5px -5px 15px #ffffff;
    z-index: -1;
  }
  .card {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    // margin: auto;
    margin-left: 0;
    margin-top: 0;
    padding: 1.5em;
    background: #ebebeb;
    border-radius: 2em;
    box-shadow: 0.7em 0.7em 2.1em #c8c8c8, -0.7em -0.7em 2.1em #ffffff;
    transition: width 1s, height 1s, border-radius 0.5s, padding 1.5s, margin 1s,
      opacity 0.5s, transform 0.5s;
    overflow: hidden;
    z-index: 2;
    &.no-shadow {
      box-shadow: none;
    }

    &.back {
      // position: relative;
      background: #333;
      color: white;
      transform: rotateY(-90deg);
      h2 {
        line-height: 300%;
      }
    }

    &.done {
      background: linear-gradient(45deg, #16a951, #3ad840);
      color: white;
      transform: rotateY(-90deg);
    }
    &.deleted {
      background: linear-gradient(45deg, #a91616, #d83a3a);
      color: white;
      transform: rotateY(-90deg);
    }
  }

  &.minimized {
    width: 7em;
    height: 7em;
    margin: auto;
    .card {
      width: 7em;
      height: 7em;
      margin: auto;
      margin-left: calc(50% - 3.5em);
      cursor: pointer;
      border-radius: 50%;
      &:hover {
        transform: scale(1.1);
      }
    }
    .front.card,
    .back.card,
    .done.card,
    .deleted.card {
      margin-top: 7.5em;
    }
  }

  &.flipped {
    .front.card {
      transform: rotateY(90deg);
      transition-timing-function: ease-in;
    }
    .back.card,
    .done.card,
    .deleted.card {
      transform: rotateY(0);
      transition-timing-function: ease-out;
      transition-delay: 0.5s;
    }
  }
  &:not(.flipped) {
    .front.card {
      animation: not-flipped-temp 1s;
      animation-timing-function: ease-out;
    }
    .back.card,
    .done.card,
    .deleted.card {
      transition-timing-function: ease-in;
    }
  }
}

.v-btn {
  border-radius: 1em;
  box-shadow: none;
}
</style>
