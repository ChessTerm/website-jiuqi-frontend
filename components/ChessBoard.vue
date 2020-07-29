<template>
  <div class="w-100" id="tableContainer" :style="{ '--fit-size': fitSize + 'px' }">
    <img v-if="pickedUpImage" id="pickedUpFollow" :src="pickedUpImage" alt="拾起的棋子"
         title="点击棋盘四周的空白处可以删除棋子" :style="pickedUpImageStyles">
    <b-row align-h="center" id="toolbar">
      <b-col cols="auto">
        <b-button-toolbar v-if="writeable && isLastStep">
          <b-button-group class="mr-2" size="sm">
            <b-button variant="secondary" disabled v-if="writeableX || writeableO">
              获取棋子
              <b-icon icon="arrow-right"></b-icon>
            </b-button>
            <b-button variant="warning" v-if="writeableX" @click="pickUpHandler(-1)">
              <b-icon icon="circle-fill" style="color:#FFDC04;"></b-icon>
            </b-button>
            <b-button variant="info" v-if="writeableO" @click="pickUpHandler(1)">
              <b-icon icon="circle-fill" style="color:#3EC6DB;"></b-icon>
            </b-button>
          </b-button-group>
          <b-button-group size="sm">
            <b-button variant="outline-warning" :pressed.sync="writeableX">
              <strong>控制黄子</strong>
              ({{ writeableX ? '开' : '关' }})
            </b-button>
            <b-button variant="outline-info" :pressed.sync="writeableO">
              <strong>控制蓝子</strong>
              ({{ writeableO ? '开' : '关' }})
            </b-button>
          </b-button-group>
        </b-button-toolbar>
      </b-col>
      <b-col cols="auto">
        <b-button-toolbar class="ml-auto">
          <b-button-group size="sm">
            <b-button v-if="hasHistory && historyIndex !== 0" variant="success"
                      @click="toHistory(historyIndex - 1)">
              <b-icon icon="arrow-counterclockwise"></b-icon>
              上一步
            </b-button>
            <b-button v-if="hasHistory && !isLastStep" variant="success"
                      @click="toHistory(historyIndex + 1)">
              <b-icon icon="arrow-clockwise"></b-icon>
              下一步
            </b-button>
            <b-button v-if="hasHistory && !isLastStep && writeable" variant="primary" @click="applyHistory">
              <b-icon icon="check2"></b-icon>
              应用
            </b-button>
            <b-button v-if="!hasHistory" variant="primary"
                      :disabled="historyLoading" @click="loadHistory">
          <span v-if="historyLoading">
            <b-spinner variant="white" small></b-spinner>
            加载中...
          </span>
              <span v-else>
            <b-icon icon="clock-history"></b-icon>
            历史记录
          </span>
            </b-button>
          </b-button-group>
          <b-button v-if="writeable && isLastStep" class="ml-2"
                    size="sm" variant="danger" @click="$emit('resetState')">
            <b-icon icon="trash"></b-icon>
            重置棋盘
          </b-button>
        </b-button-toolbar>
      </b-col>
    </b-row>
    <table :class="{ 'td-no-border': game.rectpaper }" id="table">
      <tbody id="board">
        <!-- 绘制棋盘 -->
        <tr><!-- 第一行：列编号 -->
          <td><!-- 空出最左边 --></td>
          <td v-for="(cell, i) in state[0]" :key="'col-' + i">
            {{ String.fromCharCode(65 + i) }}
          </td>
          <td><!-- 为了使棋盘居中空出最右边一列 --></td>
        </tr>
        <tr v-for="(rowState, row) in state" :key="'row-' + row">
          <td>{{ row + 1 }}</td>
          <chess-board-cell v-for="(cell, col) in rowState" :key="`${row}-${col}`" available
                            :row="row" :col="col" :value="cell" :pickable="isWriteable(cell)"
                            @pickUp="pickUpHandler" @putDown="putDownHandler"
                            @contextmenu="contextMenuHandler">
            <!-- 可下子的单元格 -->
          </chess-board-cell>
          <td><!-- 为了使棋盘居中空出最右边一列 --></td>
        </tr>
      </tbody>
      <chess-board-rectpaper v-if="game.rectpaper" :fit-size="fitSize" />
    </table>
    <transition name="fadeDown" leave-active-class="fadeOutUp">
      <div class="dropdown-menu shadow-lg" v-if="contextMenu" id="contextMenu" :style="contextMenuStyles">
        <b-dropdown-group v-if="isWriteable(contextMenuValue) && (writeableX || writeableO)"
                          :header="'对 ' + contextMenuCoordinatesText + ' 的操作：'">
          <b-dropdown-item-button v-if="writeableX && contextMenuValue === 0" variant="warning"
                                  @click="setCellValue(contextMenuCoordinates, -1, true)">
            <b-icon icon="circle-fill" style="color:#FFDC04;"></b-icon>
            放置黄子
          </b-dropdown-item-button>
          <b-dropdown-item-button v-if="writeableO && contextMenuValue === 0" variant="info"
                                  @click="setCellValue(contextMenuCoordinates, 1, true)">
            <b-icon icon="circle-fill" style="color:#3EC6DB;"></b-icon>
            放置蓝子
          </b-dropdown-item-button>
          <b-dropdown-item-button v-if="contextMenuValue !== 0 && isWriteable(contextMenuValue)" variant="success"
                                  @click="pickUpHandler(contextMenuValue, contextMenuCoordinates)">
            <b-icon icon="hand-index-thumb"></b-icon>
            拾起棋子
          </b-dropdown-item-button>
          <b-dropdown-item-button v-if="contextMenuValue !== 0 && isWriteable(contextMenuValue)" variant="danger"
                                  @click="setCellValue(contextMenuCoordinates, 0, true)">
            <b-icon icon="trash"></b-icon>
            删除棋子
          </b-dropdown-item-button>
        </b-dropdown-group>
        <b-dropdown-header v-else-if="isLastStep">对 {{ contextMenuCoordinatesText }} 无可用操作</b-dropdown-header>
        <b-dropdown-header v-else>查看历史记录时不可操作棋盘<br>若要操作，请先点击上方的”应用“</b-dropdown-header>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";

  import ChessBoardCell from "~/components/ChessBoardCell.vue";
  import ChessBoardRectpaper from "~/components/ChessBoardRectpaper.vue";
  import { boardStore } from "~/store/index";
  import Board from "~/libs/classes/models/Board";
  import Game from "~/libs/classes/models/Game";
  import User from "~/libs/classes/models/User";
  import State from "~/libs/classes/models/State";
  import { getSize, minEach } from "~/libs/board/fit";
  import Coordinates from "~/libs/classes/Coordinates";
  import Chess from "~/libs/classes/Chess";
  import getChessImage from "~/libs/board/getChessImage";

  export default Vue.extend({
    props: {
      writeable: Boolean
    },
    components: {
      ChessBoardCell,
      ChessBoardRectpaper,
    },
    data() {
      return {
        fitSize: minEach,
        clientX: 0,
        clientY: 0,
        writeableX: true,
        writeableO: true,
        history: new Array<State>(),
        historyIndex: -1,
        historyLoading: false,
        historyState: [[]] as State,
        contextMenu: false,
        contextMenuCoordinates: new Coordinates(0, 0),
        contextMenuCoordinatesText: "",
        contextMenuValue: Chess.None,
      }
    },
    computed: {
      board(): Board {
        return boardStore.board || {} as Board;
      },
      game(): Game {
        return this.board.game || {} as Game;
      },
      user(): User {
        return this.board.user || {} as User;
      },
      state(): State {
        if (this.hasHistory && !this.isLastStep) {
          return this.historyState;
        } else return this.board.state || [[]] as State;
      },
      pickedUpImage(): string {
        if (boardStore.pickedUp && boardStore.pickedUpChess) {
          return getChessImage(boardStore.pickedUpChess);
        } else return "";
      },
      pickedUpImageStyles(): object {
        return {
          width: this.fitSize + "px",
          height: this.fitSize + "px",
          left: (this.clientX - this.fitSize / 2) + "px",
          top: (this.clientY - this.fitSize / 2) + "px",
        }
      },
      contextMenuStyles(): object {
        return {
          left: this.clientX + "px",
          top: this.clientY + "px",
        }
      },
      hasHistory(): boolean {
        return this.history.length > 0;
      },
      isLastStep(): boolean {
        if (this.history) {
          return this.history.length - 1 == this.historyIndex;
        } else return true;
      }
    },
    methods: {
      getFitSize(): void {
        this.fitSize = getSize(Math.max(this.game.row + 1, this.game.column + 2));
      },
      isWriteable(value: Chess): boolean {
        if (this.writeable && this.isLastStep) {
          if (value == Chess.X) return this.writeableX;
          if (value == Chess.O) return this.writeableO;
          return true;
        } else return false;
      },
      getCellValue(coordinates: Coordinates): Chess {
        return ((this.state || [])[coordinates.row] || [])[coordinates.column];
      },
      setCellValue(coordinates: Coordinates, value: Chess, submit?: boolean): void {
        boardStore.updateState({ value, coordinates });
        if (submit) this.$emit("uploadState");
      },
      putDownHandler(coordinates?: Coordinates): void {
        this.contextMenu = false;
        if (boardStore.pickedUp) {
          if (boardStore.pickedUpOn + 50 > new Date().getTime()) return;
          if (coordinates) {
            const value: Chess = this.getCellValue(coordinates);
            if (value == Chess.None) {
              if (boardStore.pickedUpCoordinates)
                this.setCellValue(boardStore.pickedUpCoordinates, Chess.None);
              this.setCellValue(coordinates, boardStore.pickedUpChess, true);
            } else return;
          } else if (boardStore.pickedUpCoordinates) {
            this.setCellValue(boardStore.pickedUpCoordinates, Chess.None, true);
          }
          boardStore.putDown();
        }
      },
      pickUpHandler(value: Chess, coordinates?: Coordinates): void {
        this.contextMenu = false;
        if (boardStore.pickedUp) {
          if (boardStore.pickedUpCoordinates && boardStore.pickedUpCoordinates.equals(coordinates))
            boardStore.putDown();
        } else boardStore.pickUp({ value, coordinates });
      },
      windowPutDownHandler(): void {
        this.contextMenu = false;
        this.putDownHandler();
      },
      mouseMoveHandler(event: MouseEvent): void {
        if (!this.contextMenu) {
          this.clientX = event.clientX;
          this.clientY = event.clientY;
        }
      },
      contextMenuHandler(coordinates: Coordinates, value: Chess, event: MouseEvent): void {
        if (!boardStore.pickedUp) {
          this.clientX = event.clientX;
          this.clientY = event.clientY;
          this.contextMenu = true;
          this.contextMenuCoordinates = coordinates;
          this.contextMenuCoordinatesText =
            String.fromCharCode(65 + coordinates.column) + String(coordinates.row + 1);
          this.contextMenuValue = value;
        }
      },
      loadHistory(): void {
        this.historyLoading = true;
        this.$callApi(`boards/${this.board.id}/history`).then((data: Array<State>) => {
          this.history = data;
          this.historyIndex = data.length - 1;
          this.$once("uploadState", () => {
            this.history = new Array<State>();
            this.historyIndex = -1;
          });
        }).catch(() => {
          alert("获取历史记录失败。");
        }).finally(() => this.historyLoading = false);
      },
      toHistory(index: number): void {
        if (index + 1 == this.history.length) {
          this.history = new Array<State>();
          this.historyIndex = -1;
        } else if (this.history[index]) {
          this.historyState = this.history[index];
          this.historyIndex = index;
        }
      },
      applyHistory(): void {
        if (this.historyState) {
          boardStore.replaceState(this.historyState);
          this.$emit("uploadState");
        }
      }
    },
    mounted() {
      if (this.$route.query.id) {
        this.writeableO = false;
        this.writeableX = false;
      }
      this.getFitSize();
      window.addEventListener("resize", this.getFitSize);
      window.addEventListener("click", this.windowPutDownHandler);
      window.addEventListener("mousemove", this.mouseMoveHandler);
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.getFitSize);
      window.removeEventListener("click", this.windowPutDownHandler);
      window.removeEventListener("mousemove", this.mouseMoveHandler);
    }
  });
</script>

<style lang="scss" scoped>
  #tableContainer {
    min-height: 500px;
  }

  #table {
    margin: 0 auto;
    position: relative;

    td, th {
      width: var(--fit-size);
      height: var(--fit-size);
    }

    td.data-available {
      background-color: #f8f9fa;  // Bootstrap $gray-100
      border: var(--dark) 1px solid;
    }

    td.data-unavailable {
      background-color: #e9ecef;  // Bootstrap $gray-200
    }
  }

  #table.td-no-border td {
    border: none;
  }

  #pickedUpFollow {
    position: fixed;
    z-index: 105;
    cursor: move;
    pointer-events: none;
  }

  #toolbar {
    margin: 1.5rem auto 0.5rem;

    .btn-toolbar {
      margin-top: 0.5rem;
      width: 100%;
    }
  }

  #contextMenu {
    display: block;
    position: fixed;
    transition-duration: 100ms;
    animation-duration: 300ms;
  }
</style>
