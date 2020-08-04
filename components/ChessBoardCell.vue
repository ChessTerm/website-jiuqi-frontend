<template>
  <td :class="classes" :title="hovertext" @mouseenter="mouseEnter" @mouseout="mouseOut"
      @contextmenu.prevent="$emit('contextmenu', coordinates, value, $event)"
      @click.self.stop="$emit('putDown', coordinates)"
      @dblclick.self.stop="$emit('quickPut', coordinates)">
    <img v-if="image" class="data-chess" :src="image" alt="棋子" draggable="false" @click.self.stop="pickUp">
    <img v-if="mouseOver && !pickedUp && !image" class="data-chess-pre" :src="pickedUpImage" alt="棋子">
  </td>
</template>

<script lang="ts">
  import Vue from "vue";
  import Coordinates from "~/libs/classes/Coordinates";
  import Chess from "~/libs/classes/Chess";
  import { boardStore } from "~/store/index";
  import getChessImage from "~/libs/board/getChessImage";

  export default Vue.extend({
    props: {
      available: {
        type: Boolean,
        default: true
      },
      pickable: {
        type: Boolean,
        default: false
      },
      row: {
        type: Number,
        required: true
      },
      col: {
        type: Number,
        required: true
      },
      value: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        mouseOver: false
      }
    },
    computed: {
      image(): string {
        return getChessImage(this.value);
      },
      pickedUpImage(): string {
        if (boardStore.pickedUp && boardStore.pickedUpChess) {
          return getChessImage(boardStore.pickedUpChess);
        } else return "";
      },
      classes(): Array<string> {
        return [
          this.available ? 'data-available' : 'data-unavailable',
          this.clickable ? 'clickable' : '',
          this.pickedUp ? 'picked-up' : '',
        ];
      },
      rowText(): string {
        return String(this.row + 1);
      },
      colText(): string {
        return String.fromCharCode(65 + this.col)
      },
      hovertext(): string {
        if (boardStore.pickedUp) {
          if (this.value == Chess.None) {
            return `点击在此放下拾起的棋子\n(${this.colText}${this.rowText}, ${boardStore.pickedUpChess})`;
          } else if (this.pickedUp) {
            return "点击放回棋子";
          } else return "";
        } else {
          if (this.pickable && this.value) {
            return `点击拾起此棋子\n(${this.colText}${this.rowText}, ${this.value})`;
          } else return "";
        }
      },
      coordinates(): Coordinates {
        return new Coordinates(this.row, this.col);
      },
      pickedUp(): boolean {
        if (boardStore.pickedUp && boardStore.pickedUpCoordinates) {
          return boardStore.pickedUpCoordinates.equals(this.coordinates);
        } else return false;
      },
      clickable(): boolean {
        if (boardStore.pickedUp) {
          return this.available && (this.value == Chess.None || this.pickedUp);
        } else return (this.pickable && (this.value == Chess.X || this.value == Chess.O));
      },
    },
    methods: {
      pickUp() {
        if (this.pickable) this.$emit("pickUp", this.value, this.coordinates);
      },
      mouseEnter(): void {
        if (boardStore.pickedUp) this.mouseOver = true;
      },
      mouseOut(): void {
        this.mouseOver = false;
      }
    },
  });
</script>

<style scoped>
  .data-chess, .data-chess-pre {
    position: relative;
    z-index: 100;
    max-width: 100%;
    max-height: 100%;
    user-select: none;
  }

  .clickable {
    cursor: pointer;
  }

  .picked-up .data-chess, .data-chess-pre {
    opacity: 0.5;
  }

  .data-chess-pre {
    pointer-events: none;
    user-select: none;
  }
</style>
