<template>
  <form-container>
    <div class="text-center" v-if="loading">
      <h3 class="font-weight-light" style="margin-top:7.5rem;">
        <b-spinner variant="primary"></b-spinner>
        正在加载用户信息...
      </h3>
    </div>
    <login-page v-else-if="!userLoggedIn" @update="updateUserInfo"></login-page>
    <profile-page v-else></profile-page>
  </form-container>
</template>

<script lang="ts">
  import Vue from "vue";

  import LoginPage from "~/components/LoginPage.vue";
  import ProfilePage from "~/components/ProfilePage.vue";
  import FormContainer from "~/components/FormContainer.vue";
  import { userStore } from "~/store/index";
  import User from "~/libs/classes/models/User";

  export default Vue.extend({
    components: {
      FormContainer,
      LoginPage,
      ProfilePage
    },
    data() {
      return {
        loading: true
      }
    },
    computed: {
      userInfo(): User {
        return userStore.info || {} as User;
      },
      userLoggedIn(): boolean {
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
    },
    transition: "fade"
  });
</script>
