<template>
  <div>
    <float-box icon="tools" title="久棋工具箱" width="16rem">
      <b-list-group class="mt-3 bg-transparent">
        <b-list-group-item button v-b-modal:jtp-nextStep-modal>
          State Parser
          <b-icon icon="question-circle-fill" id="jtp-stateParser-help"></b-icon>
        </b-list-group-item>
        <!--<b-list-group-item button>
          Next Step
          <b-icon icon="question-circle-fill" id="jtb-nextStep-help"></b-icon>
        </b-list-group-item>-->
      </b-list-group>
    </float-box>
    <b-popover target="jtp-stateParser-help" triggers="hover" placement="right">
      <template v-slot:title>久棋工具箱：<strong>State Parser</strong></template>
      <p>在使用我们的一些程序时，可能会遇到由 <code>X</code>、<code>O</code> 和 <code>-</code> 组成的 <code>State</code> 序列。</p>
      <p>这个工具可以让您输入 <code>State</code>，然后将它在棋盘上显示出来。</p>
    </b-popover>
    <b-modal id="jtp-nextStep-modal" title="State Parser" @hidden="resetStateParser">
      <b-form-textarea v-model="stateParserValue" :rows="stateParserFinished ? 8 : 14" placeholder="请在此粘贴你的 State"
                       :state="stateParserFailed ? false : (stateParserFinished ? true : null)" @input="resetStateParser(false)" />
      <b-form-invalid-feedback>{{ stateParserFeedback }}</b-form-invalid-feedback>
      <b-form-valid-feedback>State 解析完成！若有问题，可以使用“历史记录”功能找回之前的棋盘状态。</b-form-valid-feedback>
      <template v-slot:modal-footer="{ cancel }">
        <b-button variant="secondary" @click="cancel">
          <b-icon icon="x"></b-icon>
          {{ stateParserFinished ? '关闭' : '取消' }}
        </b-button>
        <b-button variant="primary" v-if="!stateParserFinished" :disabled="stateParserLoading" @click="stateParserSubmit">
          <span v-if="stateParserLoading">
            <b-spinner variant="white" small></b-spinner>
            加载中...
          </span>
          <span v-else>
            <b-icon icon="check2"></b-icon>
            提交
          </span>
        </b-button>
      </template>
    </b-modal>
    <b-popover target="jtb-nextStep-help" triggers="hover" placement="right">
      <template v-slot:title>久棋工具箱：<strong>Next Step</strong></template>
      <p>使用我们基于 MCTS 算法的程序来自动下一步棋！</p>
      <p class="small">
        Powered by <a href="https://github.com/zhc7" target="_blank">ZHC</a>.<br>
        Source code available at <a href="https://github.com/ChessTerm/flamechess-java" target="_blank">GitHub</a>.
      </p>
    </b-popover>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";

  import FloatBox from "~/components/FloatBox.vue";

  export default Vue.extend({
    components: {
      FloatBox,
    },
    data() {
      return {
        stateParserLoading: false,
        stateParserFailed: false,
        stateParserValue: "",
        stateParserFeedback: "",
        stateParserFinished: false,
      }
    },
    methods: {
      stateParserSubmit() {
        this.stateParserLoading = true;
        this.stateParserFailed = false;
        this.$axios.$post("jiuqi_toolbox/parse_state", this.stateParserValue, {
          headers: { "Content-Type": "text/plain" }
        }).then(() => {
          this.stateParserFinished = true;
        }).catch((e) => {
          console.error(e);
          this.stateParserFailed = true;
          this.stateParserFeedback = `State 解析失败，请检查输入是否正确。`;
        }).finally(() => this.stateParserLoading = false);
      },
      resetStateParser(value?: boolean) {
        this.stateParserLoading = false;
        this.stateParserFailed = false;
        this.stateParserFinished = false;
        if (value !== false) this.stateParserValue = "";
        this.stateParserFeedback = "";
      }
    }
  });
</script>

<style lang="scss" scoped>
  .bg-transparent {
    * {
      background: none;
    }

    button:hover {
      background: rgba(93, 97, 102, 0.3);
    }
  }
</style>
