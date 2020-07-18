<template>
  <div class="text-center">
    <h2 class="font-weight-normal mb-3">
      欢迎{{ userInfo.name ? '，' + userInfo.name : '' }}
    </h2>
    <p class="lead font-weight-bold">您的棋盘码：{{ userInfo.id }}</p>
    <b-button class="mt-5" size="lg" block variant="outline-primary">进入 ChessTerm</b-button>
  </div>
</template>

<script lang="ts">
  import {userStore} from "~/store/index";

  export default {
    computed: {
      userInfo(): User|null {
        return userStore.info;
      }
    },
  }
</script>
