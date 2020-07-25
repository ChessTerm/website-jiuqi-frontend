<template>
  <b-container fluid="lg" class="text-center my-3 mt-md-4">
    <h1 class="font-weight-light mb-3">ChessTerm GUI</h1>
    <transition name="fade" mode="out-in">
      <div id="loading" key="loading" :class="failed ? 'text-danger' : ''"
           v-if="loading || failed" style="transition-duration:0.2s;">
        <loading class="mb-4" v-if="loading"></loading>
        <h4 v-if="failed">
          <span v-if="started">ChessTerm 出现错误</span>
          <span v-else>ChessTerm 加载失败</span>
        </h4>
        <p>{{ status }}</p>
      </div>
      <chess-board v-else key="board" style="transition-duration:0.2s;" :writeable="writeable"
                   @uploadState="uploadState" @resetState="resetState" />
    </transition>
    <!--<div class="text-left d-none" id="info">
      <hr style="margin: 5rem 0 1rem">
      <div class="row">
        <div class="col">
          <h1 class="font-weight-light">
            <span data-param="game.title"></span>
            <small class="text-muted mx-1 text-nowrap" style="font-size:50%;vertical-align:super;">
              # <span data-param="user.id"></span>
            </small>
          </h1>
          <p data-param="game.description"></p>
        </div>
        <div class="col-auto text-nowrap">
          <h6 class="text-secondary d-none d-sm-inline-block">从这里拿新棋子 &rarr;</h6>
          <div class="data-new-chess pickable" data-status="x">
            <img class="data-chess" src="../assets/images/yellow_zu.png">
          </div>
          <div class="data-new-chess pickable" data-status="o">
            <img class="data-chess" src="../assets/images/blue_zu.png">
          </div>
        </div>
      </div>
    </div>-->
    <!-- TODO: Use BSidebar to display info and chat -->
  </b-container>
</template>

<script lang="ts">
  import Vue from "vue";
  import SockJS from "sockjs-client";
  import webstomp, { Client, Message } from "webstomp-client";

  import ChessBoard from "~/components/ChessBoard.vue";
  import Loading from "~/components/Loading2.vue";
  import Board from "~/libs/classes/models/Board";
  import Role from "~/libs/classes/Role";
  import ApiReturnData from "../libs/classes/ApiReturnData";
  import { boardStore } from "~/store/index";

  export default Vue.extend({
    components: {
      Loading,
      ChessBoard,
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
      inputId() {
        return this.$route.query.id;
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
        this.$bvModal.msgBoxConfirm("重置后，棋盘会回到初始状态，您确定要重置棋盘吗？", {
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
