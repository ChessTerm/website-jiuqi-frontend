<template>
  <float-box icon="tools" title="久棋工具箱" width="16rem">
    <b-list-group class="mt-3 bg-transparent">
      <b-list-group-item button v-b-modal:jtp-stateParser-modal>
        State Parser
        <b-icon icon="question-circle-fill" id="jtp-stateParser-help"></b-icon>
      </b-list-group-item>
      <b-list-group-item button v-b-modal:jtp-nextStep-modal>
        Next Step
        <b-icon icon="question-circle-fill" id="jtb-nextStep-help"></b-icon>
      </b-list-group-item>
    </b-list-group>
    <b-popover target="jtp-stateParser-help" triggers="hover" placement="right">
      <template v-slot:title>久棋工具箱：<strong>State Parser</strong></template>
      <p>在使用我们的一些程序时，可能会遇到由 <code>X</code>、<code>O</code> 和 <code>-</code> 组成的 <code>State</code> 序列。</p>
      <p>这个工具可以让您输入 <code>State</code>，然后将它在棋盘上显示出来；您也可以把棋盘当前状态导出为 <code>State</code> 序列。</p>
    </b-popover>
    <b-modal id="jtp-stateParser-modal" title="State Parser" @hidden="resetStateParser">
      <b-form-textarea v-model="stateParserValue" :rows="15" placeholder="请在此粘贴你的 State"
                       :state="stateParserFailed ? false : (stateParserFinished ? true : null)" @input="resetStateParser(false)" />
      <b-form-invalid-feedback>{{ stateParserFeedback }}</b-form-invalid-feedback>
      <b-form-valid-feedback>State 解析完成！若有问题，可以使用“历史记录”功能找回之前的棋盘状态。</b-form-valid-feedback>
      <template v-slot:modal-footer="{ cancel }">
        <b-button variant="success" @click="stateParserExport">
          <span v-if="stateParserLoading"><b-spinner variant="white" small></b-spinner> 加载中...</span>
          <span v-else><b-icon icon="box-arrow-up"></b-icon> 导出当前 <code>State</code></span>
        </b-button>
        <b-button variant="secondary" @click="cancel">
          <b-icon icon="x"></b-icon> {{ stateParserFinished ? '关闭' : '取消' }}
        </b-button>
        <b-button variant="primary" v-if="!stateParserFinished" :disabled="stateParserLoading" @click="stateParserSubmit">
          <span v-if="stateParserLoading"><b-spinner variant="white" small></b-spinner> 加载中...</span>
          <span v-else><b-icon icon="check2"></b-icon> 提交</span>
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
    <b-modal id="jtp-nextStep-modal" title="Next Step" @show="nextStepCheck">
      <transition name="fadeDown" leave-active-class="fadeOutUp" mode="out-in">
        <div v-if="!nextStepStarted">
          <p>要让我们的程序下一步棋，您必须提供几个参数：</p>
          <b-row>
            <b-col cols="12" sm="6">
              <b-form-group label="阵营" label-for="jtp-nextStep-input-player">
                <b-form-select id="jtp-nextStep-input-player" :options="nextStepPlayers"
                               v-model="nextStepPlayer" required :state="nextStepPlayerError"></b-form-select>
                <b-form-text>程序将为您选择的一方下一步棋。</b-form-text>
              </b-form-group>
            </b-col>
            <b-col cols="12" sm="6">
              <b-form-group label="阶段" label-for="jtp-nextStep-input-stage">
                <b-form-select id="jtp-nextStep-input-stage" :options="nextStepStages"
                               v-model="nextStepStage" required :state="nextStepStageError"></b-form-select>
                <b-form-text>请选择当前的游戏阶段。</b-form-text>
              </b-form-group>
            </b-col>
          </b-row>
        </div>
        <div v-else>
          <p class="lead text-success">
            <b-icon class="mr-2" icon="circle-fill" animation="throb" font-scale="1.2"></b-icon>
            程序正在运行中...
          </p>
          <label>运行进度：{{ nextStepProgressObj.now || 0 }} / {{ nextStepProgressObj.all || 1000 }}</label>
          <b-progress :max="nextStepProgressObj.all || 1000" height="1.5rem" :animated="nextStepStarted">
            <b-progress-bar :value="nextStepProgressObj.now || 0" :label="nextStepProgressLabel" />
          </b-progress>
        </div>
      </transition>
      <transition name="fadeUp">
        <p class="text-danger mb-0 mt-n2" v-if="nextStepError && !nextStepSuccessful">错误：{{ nextStepError }}</p>
      </transition>
      <transition name="fadeUp">
        <p class="text-success mb-0 mt-n2" v-if="nextStepSuccessful">程序已完成运行！</p>
      </transition>
      <template v-slot:modal-footer="{ cancel }">
        <p class="mr-auto text-muted">算法由 ZHC 提供</p>
        <b-button variant="secondary" @click="cancel">
          <b-icon icon="x"></b-icon> 关闭
        </b-button>
        <b-button variant="primary" :disabled="nextStepLoading"
                  v-if="!nextStepStarted" @click="nextStepStart">
          <span v-if="nextStepLoading"><b-spinner variant="white" small></b-spinner> 加载中...</span>
          <span v-else><b-icon icon="check2"></b-icon> 提交</span>
        </b-button>
        <b-button variant="danger" v-else @click="nextStepStop">
          <span v-if="nextStepLoading"><b-spinner variant="white" small></b-spinner> 加载中...</span>
          <span v-else><b-icon icon="exclamation-octagon"></b-icon> 结束进程</span>
        </b-button>
      </template>
    </b-modal>
  </float-box>
</template>

<script lang="ts">
  import Vue from "vue";

  import FloatBox from "~/components/FloatBox.vue";
  import eventBus from "~/libs/board/eventBus";
  import Progress, { percentageToText } from "~/libs/classes/Progress";
  import "~/plugins/callApi";

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
        nextStepLoading: false,
        nextStepError: "",
        nextStepSuccessful: false,
        nextStepPlayers: [
          { value: "", html: "请选择阵营", disabled: true },
          { value: "-1", text: "黄方 (-1, X)" },
          { value: "1", text: "蓝方 (1, O)" },
        ],
        nextStepStages: [
          { value: "", text: "请选择阶段", disabled: true },
          { value: "LAYOUT", text: "布子 (Layout)" },
          { value: "PLAY", text: "行棋 (Play)" }
        ],
        nextStepPlayer: "",
        nextStepStage: "",
        nextStepStarted: false,
        nextStepProgressObj: {} as Progress
      }
    },
    computed: {
      nextStepPlayerError(): boolean|null {
        if (this.nextStepError && this.nextStepError.indexOf("player") !== -1) return false;
        return null;
      },
      nextStepStageError(): boolean|null {
        if (this.nextStepError && this.nextStepError.indexOf("stage") !== -1) return false;
        return null;
      },
      nextStepProgressLabel(): string {
        return percentageToText(this.nextStepProgressObj.percentage);
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
      stateParserExport() {
        this.stateParserLoading = true;
        this.stateParserFailed = false;
        this.stateParserFinished = false;
        this.$callApi("jiuqi_toolbox/export_state", {
          responseType: "text"
        }).then((data: string) => {
          this.stateParserValue = data;
          window.setTimeout(() => alert("快来复制框里的 State 吧~"), 50);
        }).finally(() => this.stateParserLoading = false);
      },
      resetStateParser(value?: boolean) {
        this.stateParserLoading = false;
        this.stateParserFailed = false;
        this.stateParserFinished = false;
        if (value !== false) this.stateParserValue = "";
        this.stateParserFeedback = "";
      },
      nextStepStart() {
        this.nextStepLoading = true;
        this.nextStepSuccessful = false;
        this.nextStepError = "";
        this.$callApi("jiuqi_toolbox/next_step/start", {
          method: "POST",
          params: {
            player: this.nextStepPlayer,
            stage: this.nextStepStage
          }
        }).then(() => {
          this.nextStepCheck();
        }).catch((e) => {
          console.error(e);
          if (e.message) this.nextStepError = e.message;
          this.nextStepLoading = false;
        });
      },
      nextStepCheck() {
        this.nextStepLoading = true;
        this.$callApi("jiuqi_toolbox/next_step/check").then((data: boolean) => {
          this.nextStepStarted = data;
          this.nextStepProgressObj = {} as Progress;
        }).finally(() => this.nextStepLoading = false);
      },
      nextStepStop() {
        this.nextStepLoading = true;
        this.$callApi("jiuqi_toolbox/next_step/stop", {
          method: "POST"
        }).then(() => {
          this.nextStepError = "进程已被用户强制结束。";
        }).catch(() => {
          this.nextStepError = "未能成功结束进程。";
        }).finally(() => {
          this.nextStepSuccessful = false;
          this.nextStepCheck();
        });
      },
      nextStepSuccess() {
        this.nextStepSuccessful = true;
        this.nextStepCheck();
      },
      nextStepProgress(progress: Progress) {
        this.nextStepProgressObj = progress;
      },
      nextStepFail(message: string) {
        this.nextStepError = message;
        this.nextStepCheck();
      }
    },
    mounted() {
      eventBus.$on("nextStepProgress", this.nextStepProgress);
      eventBus.$on("nextStepSuccess", this.nextStepSuccess);
      eventBus.$on("nextStepFail", this.nextStepFail);
    },
    beforeDestroy() {
      eventBus.$off("nextStepProgress", this.nextStepProgress);
      eventBus.$off("nextStepSuccess", this.nextStepSuccess);
      eventBus.$off("nextStepFail", this.nextStepFail);
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

  button code {
    color: inherit;
  }
</style>
