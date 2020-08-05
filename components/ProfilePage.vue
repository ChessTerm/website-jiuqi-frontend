<template>
  <div class="text-center">
    <h2 class="font-weight-normal mb-3">
      欢迎{{ userInfo.name ? '，' + userInfo.name : '' }}
    </h2>
    <p class="lead font-weight-bold">您的棋盘码：{{ userInfo.id }}</p>
    <b-dropdown class="mt-5" size="lg" block variant="primary"
                text="进入 ChessTerm" split-to="gui" split right>
      <b-dropdown-item to="gui" prefetch>
        <b-icon icon="box"></b-icon> 进入我的棋盘
      </b-dropdown-item>
      <b-dropdown-item-button @click="$bvModal.show('inputBoardModal')">
        <b-icon icon="eye"></b-icon> 观看其它棋盘
      </b-dropdown-item-button>
      <b-dropdown-item-button @click="logout" variant="danger">
        <b-icon icon="box-arrow-right"></b-icon> 退出登录
      </b-dropdown-item-button>
    </b-dropdown>
    <!-- Modals -->
    <input-board-modal></input-board-modal>
  </div>
</template>

<script>
  import { userStore } from "~/store/index";
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
      logout() {
        this.$callApi("logout", {
          method: "POST",
          maxRedirects: 0
        }).finally(() => userStore.getInfo());
      }
    }
  }
</script>
