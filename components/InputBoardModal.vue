<template>
  <b-modal id="inputBoardModal" title="观看其它棋盘">
    <b-form @submit.prevent="submit">
      <b-form-group class="mb-0" label="棋盘码" label-for="inputBoardUserId">
        <b-form-input id="inputBoardUserId" v-model="form.user" autofocus
                      :state="invalid ? false : null"
                      placeholder="请输入您要观看的棋盘码" autocomplete="off" required />
        <b-form-text>请注意：若您输入的棋盘码存在，但此用户从未使用过 ChessTerm，则也不能进行观看。</b-form-text>
        <b-form-invalid-feedback>错误：{{ invalidFeedback }}</b-form-invalid-feedback>
      </b-form-group>
    </b-form>

    <template v-slot:modal-footer="{ cancel }">
      <b-button variant="secondary" @click="cancel">
        取消
      </b-button>
      <b-button variant="primary" :disabled="loading" @click="submit">
        <b-spinner v-if="loading" small variant="white" /> 确认
      </b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from "vue"
import ApiReturnData from "~/libs/classes/ApiReturnData"
import Board from "~/libs/classes/models/Board"
import { userStore } from "~/store/index"

export default Vue.extend({
  data() {
    return {
      form: {
        user: "",
        game: 1,
      },
      invalid: false,
      invalidFeedback: "",
      loading: false,
    }
  },
  computed: {
    userId() {
      return userStore.info?.id
    },
  },
  methods: {
    submit() {
      if (this.form.user && this.form.game) {
        this.loading = true
        const url = Number(this.form.user) === this.userId ? "user/getBoard" : "boards/find"
        this.$callApi(url, {
          params: this.form,
        }).then((data: Board) => {
          this.start(data.user.id)
        }).catch((response: ApiReturnData<Board|null>) => {
          this.invalid = true
          this.invalidFeedback = response.message || "未知错误。"
        }).finally(() => this.loading = false)
      } else {
        this.invalid = true
        this.invalidFeedback = "请输入正确的棋盘码。"
      }
    },
    start(userId: number) {
      this.$router.push(`/gui?id=${userId}`)
      this.$bvModal.hide("inputBoardModal")
    },
  },
})
</script>
