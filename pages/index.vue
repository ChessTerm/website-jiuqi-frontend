<template>
  <b-container class="mt-3 mb-5 mt-md-5" fluid="md">
    <github-banner></github-banner>

    <b-jumbotron class="pt-sm-4 pb-sm-5">
      <h1 class="display-4">ChessTerm <small class="d-none d-sm-inline text-muted" id="version">for 久棋 ({{ version }})</small></h1>
      <p class="lead mb-1">An online checkerboard dedicated to 久棋.</p>
      <p class="mb-0">Developed by <a href="https://www.jingbh.top/" target="_blank">JingBh</a>.</p>
    </b-jumbotron>

    <b-overlay id="form-container" :show="loading" spinner-variant="primary" variant="white">
      <login-page v-if="!userLoggedIn" @update="updateUserInfo"></login-page>
      <profile-page v-else></profile-page>
    </b-overlay>

  </b-container>
</template>

<script>
  import GithubBanner from "~/components/GithubBanner";
  import LoginPage from "~/components/LoginPage";
  import ProfilePage from "~/components/ProfilePage";

  import { userStore } from "~/store/index";
  import version from "~/libs/version";
  import user from "~/store/user";

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
        this.$callApi("user").then((userInfo) => {
          userStore.updateInfo(userInfo);
        }).finally(() => this.loading = false);
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
