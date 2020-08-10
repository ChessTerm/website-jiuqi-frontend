<template>
  <form-container>
    <div class="text-center">
      <h1 class="font-weight-light mb-5">Login with GitHub</h1>
      <div v-if="loading">
        <h3><b-spinner variant="primary"></b-spinner> 加载用户信息...</h3>
      </div>
      <div class="text-success" v-else-if="succeed">
        <h3><b-icon icon="check2"></b-icon> 登录成功</h3>
        <h5>即将跳转到主页...</h5>
      </div>
      <div class="text-danger" v-else>
        <h3><b-icon icon="x"></b-icon> 登录失败</h3>
        <h5>{{ errorText ? '错误：' + errorText : '' }}</h5>
      </div>
    </div>
  </form-container>
</template>

<script lang="ts">
  import Vue from "vue";

  import FormContainer from "~/components/FormContainer.vue";
  import "~/plugins/callApi";

  export default Vue.extend({
    components: {
      FormContainer
    },
    data() {
      return {
        loading: true,
        failed: false,
        errorText: "",
        succeed: false,
      }
    },
    computed: {
      githubCode(): string {
        return String(this.$route.query.code || "");
      }
    },
    watch: {
      loading() {
        if (this.loading === false) {
          window.setTimeout(() => {
            this.$router.push("/");
          }, this.succeed ? 0 : 3000);
        }
      }
    },
    methods: {
      fail(message: string) {
        this.failed = true;
        this.errorText = message;
        this.loading = false;
      },
      success() {
        this.succeed = true;
        this.loading = false;
      }
    },
    mounted() {
      this.$callApi("oauth/github/callback", {
        params: { "code": this.githubCode }
      }).then((data: boolean) => {
        if (data) {
          this.success();
        } else {
          this.$bvModal.msgBoxConfirm("您正在以一个还未绑定棋盘的 GitHub 账号登录，请选择您的操作：", {
            title: "绑定棋盘",
            okTitle: "绑定现有棋盘",
            cancelTitle: "创建新棋盘",
            centered: true,
            hideHeaderClose: false,
            noCloseOnBackdrop: true
          }).then((value: boolean|null) => {
            if (value === true) {
              this.$bvModal.msgBoxOk("请使用您的棋盘码直接登录，系统将为您自动绑定。", {
                title: "绑定现有棋盘",
                okTitle: "好的",
                centered: true
              }).then(() => {
                this.$router.push("/?auth=github");
              });
            } else if (value === false) {
              this.$callApi("oauth/github/callback", {
                params: { "create": "yes" }
              }).then((data: boolean) => {
                if (data) {
                  this.success();
                } else this.fail("请求失败，请重试");
              }).catch(() => this.fail("请求失败，请重试"));
            } else this.fail("用户已取消");
          });
        }
      }).catch(() => this.fail("请求失败，请重试"));
    },
    transition: "fade"
  });
</script>
