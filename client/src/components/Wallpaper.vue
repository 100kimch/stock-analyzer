<template>
  <div id="wallpaper">
    <img id="sketch" src="../assets/wallpaper-2.png" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MapPlane from "@/components/MapPlane.vue";

@Component
export default class Wallpaper extends Vue {}
</script>

<style lang="scss" scoped>
@keyframes sketch-intro {
  to {
    width: 100vw;
    margin-left: 0;
  }
}
#wallpaper {
  position: fixed;
  width: 100vw;
  height: 100vh;
  // background: linear-gradient(45deg, #333, #555);
  background: linear-gradient(45deg, #ddd, #fff);
  z-index: 0;
  #sketch {
    position: fixed;
    width: 120vw;
    height: 70%;
    margin-left: -10vw;
    margin-bottom: -10vh;
    bottom: 0;
    opacity: 0.3;
    object-fit: cover;
    mix-blend-mode: multiply;
    animation: sketch-intro 5s ease-out 0.5s;
    animation-fill-mode: forwards;
    will-change: width, margin;
  }
}
</style>
