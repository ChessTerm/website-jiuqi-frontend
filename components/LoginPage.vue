<template>
  <div>
    <b-form @submit.prevent="submit">
      <h2 class="font-weight-normal text-center mb-3">
        登录
      </h2>

      <b-form-group>
        <b-input-group>
          <template v-slot:prepend>
            <b-input-group-text>
              <b-icon icon="person-bounding-box" />
            </b-input-group-text>
          </template>
          <b-form-input v-model="form.id" placeholder="请输入您的棋盘码" autocomplete="username"
                        required @input="loadUsername" @change="loadUsername" />
        </b-input-group>
        <b-form-text>为了识别您的身份，请输入您的棋盘码。</b-form-text>
      </b-form-group>

      <transition name="fadeDown">
        <b-form-group v-if="needPassword">
          <b-input-group>
            <template v-slot:prepend>
              <b-input-group-text>
                <b-icon icon="key" />
              </b-input-group-text>
            </template>
            <b-form-input v-model="form.password" type="password" placeholder="请输入您的密码"
                          autocomplete="current-password" />
          </b-input-group>
          <b-form-text>此棋盘码可能已设置密码，请输入正确的密码。</b-form-text>
        </b-form-group>
      </transition>

      <transition name="fadeDown">
        <p v-if="errorMessage" class="text-danger">
          错误：{{ errorMessage }}
        </p>
      </transition>

      <b-form-group>
        <b-button type="submit" variant="primary" block
                  :disabled="loading">
          <span v-if="loading"><b-spinner small /> 请稍候...</span>
          <span v-else><b-icon icon="check2" /> 提交</span>
        </b-button>
      </b-form-group>
    </b-form>
    <hr>
    <p class="small mb-1">
      没有棋盘码？
    </p>
    <b-button class="mb-1" variant="dark" href="/api/oauth/github/authorize?scope=read:user user:email"
              block>
      <img src="/images/github_logo.png" alt="GitHub Logo" style="height:1rem;">
      用 GitHub 账号登录
    </b-button>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

import User from "~/libs/classes/models/User"
import ApiReturnData from "~/libs/classes/ApiReturnData"
import { userStore } from "~/store/index"

export default Vue.extend({
  data(): {
      form: any,
      loading: boolean,
      needPassword: boolean,
      usersWithPassword: Array<string>,
      errorMessage: string
      } {
    return {
      form: {
        id: "",
        password: "",
      },
      loading: false,
      needPassword: false,
      usersWithPassword: [],
      errorMessage: "",
    }
  },
  computed: {
    userInfo(): User|null {
      return userStore.info
    },
    authFor(): string {
      return String(this.$route.query.auth || "")
    },
  },
  mounted() {
    this.loadUsersWithPassword()
  },
  methods: {
    submit() {
      this.loading = true
      this.errorMessage = ""
      this.$callApi("login", {
        method: "POST",
        data: {
          id: this.form.id,
          password: this.form.password,
        },
      }).then(() => {
        this.$emit("update")
        if (this.authFor) this.$router.push(`/association/${this.authFor}/callback`)
      }).catch((data: ApiReturnData<User|null>) => {
        if (data.message) {
          if (this.usersWithPassword.includes(this.form.id)) {
            this.needPassword = true
            this.errorMessage = data.message
          } else this.addToUsersWithPasswordIfExists()
        }
      }).finally(() => this.loading = false)
    },
    addToUsersWithPasswordIfExists() {
      const id = this.form.id
      this.$callApi("user/exists", {
        params: { id },
      }).then((data: boolean) => {
        if (data) {
          this.usersWithPassword.push(id)
          this.saveUsersWithPassword()
          this.needPassword = true
        } else {
          this.needPassword = false
          this.errorMessage = "未找到此用户，请检查您输入的棋盘码是否存在。"
        }
      })
    },
    loadUsername(value: string) {
      this.errorMessage = ""
      this.needPassword = this.usersWithPassword.includes(value)
    },
    loadUsersWithPassword() {
      const items = localStorage.getItem("usersWithPassword")
      if (items) this.usersWithPassword = JSON.parse(items)
    },
    saveUsersWithPassword() {
      const json = JSON.stringify(this.usersWithPassword)
      localStorage.setItem("usersWithPassword", json)
    },
  },
})
</script>
