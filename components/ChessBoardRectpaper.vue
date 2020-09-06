<template>
  <img id="rectpaper" alt="rectpaper" :src="src"
       :style="style">
</template>

<script lang="ts">
import Vue from "vue"

import { boardStore } from "~/store/index"
import Game from "~/libs/classes/models/Game"

export default Vue.extend({
  props: {
    fitSize: {
      type: Number,
      default: 0,
    },
  },
  data(): {
      src: string,
      placeX: number,
      placeY: number,
      width: number,
      height: number,
      } {
    return {
      src: "",
      placeX: 0,
      placeY: 0,
      width: 0,
      height: 0,
    }
  },
  computed: {
    style(): Object {
      return {
        left: ((this.placeX + 1) * this.fitSize) + "px",
        top: ((this.placeY + 1) * this.fitSize) + "px",
        width: (this.width * this.fitSize) + "px",
        height: (this.height * this.fitSize) + "px",
      }
    },
    game(): Game {
      return boardStore.board?.game || {} as Game
    },
  },
  mounted() {
    if (this.game.rectpaper) {
      const cut = this.game.rectpaper.split("#")
      if (cut.length === 5) {
        this.placeX = Number(cut.slice(-4, -3)[0]) || 0
        this.placeY = Number(cut.slice(-3, -2)[0]) || 0
        this.width = Number(cut.slice(-2, -1)[0]) || this.game.row - this.placeX - 1
        this.height = Number(cut.slice(-1)[0]) || this.game.column - this.placeY - 1
        this.src = cut.slice(0, -4).join("#")
      } else this.src = cut.join("#")
    }
  },
})
</script>

<style scoped>
  #rectpaper {
    display: block;
    position: absolute;
    pointer-events: none;
    user-select: none;
    width: 0;
    height: 0;
    /* opacity: 0.85; */
  }
</style>
