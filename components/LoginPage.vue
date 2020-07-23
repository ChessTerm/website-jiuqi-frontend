<template>
  <b-form @submit.prevent="submit">
    <h2 class="font-weight-normal text-center mb-3">登录</h2>

    <b-form-group>
      <b-input-group>
        <template v-slot:prepend>
          <b-input-group-text>
            <b-icon icon="person-bounding-box"></b-icon>
          </b-input-group-text>
        </template>
        <b-form-input placeholder="请输入您的棋盘码" v-model="form.id" autocomplete="username"
                      required @input="loadUsername" @change="loadUsername"></b-form-input>
      </b-input-group>
      <b-form-text>为了识别您的身份，请输入您的棋盘码。</b-form-text>
    </b-form-group>

    <transition name="fadeDown">
      <b-form-group v-if="needPassword" style="animation-duration:0.2s;">
        <b-input-group>
          <template v-slot:prepend>
            <b-input-group-text>
              <b-icon icon="shield-lock"></b-icon>
            </b-input-group-text>
          </template>
          <b-form-input type="password" placeholder="请输入您的密码" v-model="form.password"
                        autocomplete="current-password"></b-form-input>
        </b-input-group>
        <b-form-text>此棋盘码可能已设置密码，请输入正确的密码。</b-form-text>
      </b-form-group>
    </transition>

    <transition name="fadeDown">
      <p v-if="errorMessage" class="text-danger" style="animation-duration:0.2s;">错误：{{ errorMessage }}</p>
    </transition>

    <b-form-group>
      <b-button type="submit" variant="primary" block :disabled="loading">
        <span v-if="loading"><b-spinner small></b-spinner> 请稍候...</span>
        <span v-else><b-icon icon="check2"></b-icon> 提交</span>
      </b-button>
    </b-form-group>
  </b-form>
</template>

<script lang="ts">
  import Vue from "vue";

  import User from "~/libs/classes/models/User";
  import ApiReturnData from "~/libs/classes/ApiReturnData";
  import { userStore } from "~/store/index";

  interface data {
    form: any,
    loading: boolean,
    needPassword: boolean,
    usersWithPassword: Array<string>,
    errorMessage: string
  }

  export default Vue.extend({
    data(): data {
      return {
        form: {
          id: "",
          password: ""
        },
        loading: false,
        needPassword: false,
        usersWithPassword: [],
        errorMessage: ""
      }
    },
    computed: {
      userInfo(): User|null {
        return userStore.info;
      }
    },
    methods: {
      submit() {
        this.loading = true;
        this.errorMessage = "";
        this.$callApi("login", {
          method: "POST",
          data: {
            id: this.form.id,
            password: this.form.password
          }
        }).then(() => {
          this.$emit("update");
        }).catch((data: ApiReturnData<User|null>) => {
          if (data.message) {
            if (this.usersWithPassword.indexOf(this.form.id) !== -1) {
              this.needPassword = true;
              this.errorMessage = data.message;
            } else this.addToUsersWithPasswordIfExists();
          }
        }).finally(() => this.loading = false);
      },
      addToUsersWithPasswordIfExists() {
        const id = this.form.id;
        this.$callApi("user/exists", {
          params: { id }
        }).then((data: boolean) => {
          if (data) {
            this.usersWithPassword.push(id);
            this.saveUsersWithPassword();
            this.needPassword = true;
          } else {
            this.needPassword = false;
            this.errorMessage = "未找到此用户，请检查您输入的棋盘码是否存在。";
          }
        });
      },
      loadUsername(value: string) {
        this.errorMessage = "";
        this.needPassword = this.usersWithPassword.indexOf(value) !== -1
      },
      loadUsersWithPassword() {
        const items = localStorage.getItem("usersWithPassword");
        if (items) this.usersWithPassword = JSON.parse(items);
      },
      saveUsersWithPassword() {
        const json = JSON.stringify(this.usersWithPassword);
        localStorage.setItem("usersWithPassword", json);
      }
    },
    mounted() {
      this.loadUsersWithPassword();
    }
  });
</script>
