<template>
  <b-sidebar id="sidebar-info" shadow="lg">
    <template v-slot:title><b-icon icon="info-circle"></b-icon> 棋盘信息</template>
    <div class="px-3 py-2">
      <div class="text-left" v-if="board.id">
        <h3 class="font-weight-light">{{ game.title }}</h3>
        <p class="lead">{{ game.description }}</p>
        <p><strong>棋盘大小：</strong>{{ game.row }}×{{ game.column }}</p>
        <p v-if="user.id !== board.user.id"><strong>棋盘码：</strong>{{ board.user.id }}</p>
        <p v-if="connected || connected === false" :class="connected ? 'text-success' : 'text-danger'">
          棋盘同步服务{{ connected ? '已' : '未' }}连接
        </p>
        <div v-if="user.id">
          <hr>
          <h4 class="mb-3">
            <b-icon icon="person-circle"></b-icon>
            {{ user.name || '用户信息' }}
          </h4>
          <p><strong>棋盘码：</strong>{{ user.id }}</p>
          <p v-if="user.admin === true" class="text-primary strong">管理员账号</p>
        </div>
      </div>
      <p class="mt-5" v-else><b-spinner variant="primary" small /> 棋盘信息加载中...</p>
    </div>
  </b-sidebar>
</template>

<script lang="ts">
  import Vue from "vue";

  import Board from "~/libs/classes/models/Board";
  import Game from "~/libs/classes/models/Game";
  import User from "~/libs/classes/models/User";
  import { boardStore, userStore } from "~/store/index";

  export default Vue.extend({
    props: {
      connected: {
        type: Boolean,
        required: false
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
        return userStore.info || {} as User;
      }
    }
  });
</script>

<style scoped>
  p {
    margin-bottom: 0.25rem;
  }
</style>
