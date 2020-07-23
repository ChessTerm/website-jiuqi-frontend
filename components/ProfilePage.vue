<template>
  <div class="text-center">
    <h2 class="font-weight-normal mb-3">
      欢迎{{ userInfo.name ? '，' + userInfo.name : '' }}
    </h2>
    <p class="lead font-weight-bold">您的棋盘码：{{ userInfo.id }}</p>
    <b-dropdown class="mt-5" size="lg" block variant="outline-primary" text="进入 ChessTerm" split right @click="start">
      <b-dropdown-item href="#" @click.prevent="start"><b-icon icon="box"></b-icon> 进入我的棋盘</b-dropdown-item>
      <b-dropdown-item href="#" @click.prevent="$bvModal.show('inputBoardModal')">
        <b-icon icon="eye"></b-icon> 观看其它棋盘
      </b-dropdown-item>
    </b-dropdown>
    <!-- Modals -->
    <input-board-modal></input-board-modal>
  </div>
</template>

<script>
  import {userStore} from "~/store/index";
  import InputBoardModal from "~/components/InputBoardModal";

  export default {
    components: {
      InputBoardModal
    },
    computed: {
      userInfo() {
        return userStore.info;
      }
    },
    methods: {
      start() {
        // TODO: Go to ChessTerm GUI
      }
    },
  }
</script>
