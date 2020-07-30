<template>
  <b-container fluid="lg" class="text-center my-3 mt-md-4">
    <h1 class="font-weight-light mb-3">
      ChessTerm
      <small class="text-secondary" style="font-size:1.5rem;font-weight:lighter;vertical-align:super;">
        {{ gameName ? ' for ' + gameName : '' }}
      </small>
    </h1>
    <transition name="fade" mode="out-in">
      <div id="loading" key="loading" :class="failed ? 'text-danger' : ''"
           v-if="loading || failed" style="animation-duration:0.5s;">
        <loading class="mb-4" v-if="loading"></loading>
        <h4 v-if="failed">
          <span v-if="started">ChessTerm 出现错误</span>
          <span v-else>ChessTerm 加载失败</span>
        </h4>
        <p>{{ status }}</p>
      </div>
      <chess-board v-else key="board" style="animation-duration:0.3s;" :writeable="writeable"
                   :isSelf="isSelf" @uploadState="uploadState" @resetState="resetState" />
    </transition>
    <jiuqi-toolbox v-if="board && board.game && board.game.id === 1 && isSelf" />
    <chess-info-bar :connected="!!stompClient && !failed" />
  </b-container>
</template>

<script lang="ts">
  import Vue from "vue";
  import SockJS from "sockjs-client";
  import webstomp, { Client, Message } from "webstomp-client";

  import ChessBoard from "~/components/ChessBoard.vue";
  import Loading from "~/components/Loading2.vue";
  import JiuqiToolbox from "~/components/JiuqiToolbox.vue";
  import ChessInfoBar from "~/components/ChessInfoBar.vue";
  import Board from "~/libs/classes/models/Board";
  import Role from "~/libs/classes/Role";
  import ApiReturnData from "../libs/classes/ApiReturnData";
  import { boardStore } from "~/store/index";

  export default Vue.extend({
    components: {
      Loading,
      ChessBoard,
      JiuqiToolbox,
      ChessInfoBar,
    },
    data(): {
      loading: boolean,
      failed: boolean,
      status: string,
      board: Board,
      writeable: boolean,
      started: boolean,
      stompClient: Client|null,
    } {
      return {
        loading: true,
        failed: false,
        status: "加载中...",
        board: {} as Board,
        writeable: false,
        started: false,
        stompClient: null,
      }
    },
    computed: {
      inputId(): number {
        return Number(this.$route.query.id) || 0;
      },
      isSelf(): boolean {
        return this.inputId ? (this.inputId === this.board?.user?.id) : true;
      },
      gameName(): string {
        return this.board?.game?.title || "";
      }
    },
    watch: {
      board() {
        boardStore.updateBoard(this.board);
      }
    },
    methods: {
      loadInfo() {
        this.failed = false;
        this.status = "加载棋盘信息...";
        this.$callApi(this.inputId ? "boards/find" : "user/getBoard", {
          params: {
            game: 1,
            user: this.inputId || 0,
          }
        }).then((board: Board) => {
          this.failed = false;
          this.board = board;
          this.status = "获取棋盘权限...";
          this.$callApi(`boards/${board.id}/role`).then((role: Role) => {
            if (role.read) {
              this.writeable = role.write;
              this.connectSocket();
            } else {
              this.failed = true;
              this.status = "Access denied.";
            }
          });
        }).catch((response: ApiReturnData<Board|null>) => {
          this.failed = true;
          this.status = response.message || "";
          this.loading = false;
          if (response.message && response.message.indexOf("login") !== -1)
            window.setTimeout(() => {
              this.$router.push("/");
            }, 3000);
        });
      },
      connectSocket() {
        this.failed = false;
        this.status = "连接棋盘同步服务...";
        const sock = new SockJS(location.origin + "/api/ws");
        const client = this.stompClient = webstomp.over(sock);
        client.connect({}, () => {
          this.started = true;
          this.status = "完成";
          this.loading = false;
          client.subscribe(`/topic/boards/${this.board.id}/sync`, (message: Message) => {
            boardStore.replaceState(JSON.parse(message.body));
          });
        }, () => {
          this.failed = true;
          this.status = "失去棋盘同步服务的连接。即将尝试重连...";
          sock.close();
          window.setTimeout(() => {
            this.loading = true;
            this.loadInfo();
          }, 7500);
        });
      },
      uploadState() {
        if (this.stompClient) {
          this.stompClient.send(`/app/boards/${this.board.id}/sync`, JSON.stringify(this.board.state));
        }
      },
      resetState() {
        this.$bvModal.msgBoxConfirm("重置后，棋盘会回到初始状态，且会清空历史记录。您确定要重置棋盘吗？", {
          title: "重置棋盘确认",
          okVariant: "danger",
          okTitle: "确认",
          cancelTitle: "取消",
        }).then((value: boolean) => {
          if (value && this.stompClient) {
            this.stompClient.send(`/app/boards/${this.board.id}/reset`);
          }
        });
      }
    },
    head() {
      return {
        meta: [
          { hid: 'viewport', name: 'viewport', content: 'width=700px, initial-scale=1' }
        ]
      }
    },
    mounted() {
      this.loadInfo();
    },
    destroyed() {
      this.stompClient?.disconnect();
    }
  });
</script>

<style lang="scss" scoped>
  .release-stage {
    font-family: var(--font-family-monospace);
    vertical-align: top;
    font-size: 0.8rem;
  }

  #loading {
    margin: 30vh 0 2.5rem;
  }

  .data-new-chess {
    display: inline-block;
    text-align: center;
  }

  #pickedUpFollow {
    position: fixed;
    z-index: 105;
    cursor: move;
    pointer-events: none;
  }

  #contextMenu {
    display: none;
    position: fixed;
  }
</style>
