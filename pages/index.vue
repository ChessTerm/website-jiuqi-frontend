<template>
  <b-container class="mt-3 mb-5 mt-md-5" fluid="md">

    <b-jumbotron class="pt-sm-4 pb-sm-5">
      <h1 class="display-4">ChessTerm <small class="d-none d-sm-inline text-muted" id="version">for 久棋 ({{ version }})</small></h1>
      <p class="lead mb-1">An online checkerboard dedicated to 久棋.</p>
      <p class="mb-0">Developed by <a href="https://www.jingbh.top/" target="_blank">JingBh</a>.</p>
    </b-jumbotron>

    <div id="form-container">
      <div class="text-center" v-if="loading">
        <h3 class="font-weight-light" style="margin-top:7.5rem;">
          <b-spinner variant="primary"></b-spinner>
          正在加载用户信息...
        </h3>
      </div>
      <login-page v-else-if="!userLoggedIn" @update="updateUserInfo"></login-page>
      <profile-page v-else></profile-page>
    </div>

  </b-container>
</template>

<script>
  import GithubBanner from "~/components/GithubBanner";
  import LoginPage from "~/components/LoginPage";
  import ProfilePage from "~/components/ProfilePage";

  import { userStore } from "~/store/index";
  import version from "~/libs/version";

  export default {
    components: {
      GithubBanner,
      LoginPage,
      ProfilePage
    },
    data() {
      return {
        loading: true,
        version: version
      }
    },
    computed: {
      userInfo() {
        return userStore.info;
      },
      userLoggedIn() {
        return !!this.userInfo?.id;
      }
    },
    methods: {
      updateUserInfo() {
        this.loading = true;
        userStore.getInfo(() => this.loading = false);
      }
    },
    mounted() {
      this.updateUserInfo();
    }
  }
</script>

<style scoped>
  #version {
    font-size: 1.5rem;
  }

  #form-container {
    max-width: 25rem;
    margin: 3rem auto;
  }
</style>
