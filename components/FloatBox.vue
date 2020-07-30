<template>
  <div class="float-box" :class="{ 'float-box-show': show }" :style="{ width: boxWidth, height: boxHeight }"
       @click.stop="clickHandler" @mouseover="mouseOverHandler" @mouseout="mouseOutHanlder">
    <b-icon :icon="icon"></b-icon>
    <span class="float-box-title" ref="title">{{ title }}</span>
    <div class="float-box-content" ref="content" :style="{ width, 'max-width': maxWidth }" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  export default Vue.extend({
    name: "FloatBox",
    props: {
      title: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        default: "justify"
      },
      width: {
        type: String,
        default: "22.5rem"
      },
      maxWidth: {
        type: String,
        default: "80vw"
      }
    },
    data() {
      return {
        boxWidth: "",
        boxHeight: "",
        show: false,
      }
    },
    methods: {
      mouseOverHandler(): void {
        if (!this.show) {
          const title = this.$refs.title as HTMLSpanElement;
          const titleWidth = title.getBoundingClientRect().width + 5
          this.boxWidth = `calc(3.5rem + ${titleWidth}px)`;
        }
      },
      mouseOutHanlder(): void {
        if (!this.show) this.boxWidth = "";
      },
      clickHandler(): void {
        if (this.show) {
          this.show = false;
          this.mouseOverHandler();
          this.boxHeight = "";
        } else {
          this.show = true;
          Vue.nextTick(() => {
            const title = this.$refs.title as HTMLSpanElement;
            const content = this.$refs.content as HTMLDivElement;
            const { width: titleWidth, height: titleHeight } = title.getBoundingClientRect()
            const { width: contentWidth, height: contentHeight } = content.getBoundingClientRect()
            const width = Math.max(titleWidth, contentWidth);
            const height = titleHeight + contentHeight;
            this.boxWidth = `calc(2rem + ${width}px)`;
            this.boxHeight = `calc(2.5rem + ${height}px)`;
          });
        }
      }
    }
  });
</script>

<style lang="scss" scoped>
  @media print {
    .float-box {
      display: none;
    }
  }

  .float-box {
    position: fixed;
    z-index: 1000;
    top: 5rem;
    left: 3rem;
    width: 3.5rem;
    height: 3.5rem;
    padding: 1rem;
    border-radius: 1.75rem;
    font-size: 1.5rem;
    line-height: 1.5rem;
    background-color: rgba(198, 198, 198, 0.2);
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
    color: rgba(0, 0, 0, 0.7);
    cursor: pointer;
    transition: 0.5s;
    overflow: hidden;
    white-space: nowrap;
    text-align: left;
    user-select: none;
  }

  .float-box:hover {
    border-radius: 1.25rem;
    background-color: rgba(217, 217, 217, 0.7);
    color: rgba(0, 0, 0, 0.9);
  }

  .float-box.float-box-show {
    border-radius: 0.75rem;
    background-color: rgba(217, 217, 217, 0.9);
    color: black;

    .float-box-content {
      display: block;
    }
  }

  .float-box-title {
    display: none;
  }

  .float-box-title::before {
    content: " ";
  }

  .float-box.float-box-show, .float-box:hover {
    text-align: center;

    .float-box-title {
      display: inline;
    }
  }

  .float-box-content {
    display: none;
    margin-top: 0.5rem;
    font-size: initial;
    line-height: initial;
    cursor: auto;
    text-align: initial;
    user-select: auto;
  }

  .bg-dark {
    .float-box {
      background-color: rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.7);
    }

    .float-box:hover {
      background-color: rgba(93, 97, 102, 0.7);
      color: rgba(255, 255, 255, 0.9);
    }

    .float-box.float-box-show {
      background-color: rgba(93, 97, 102, 0.9);
      color: white;
    }
  }
</style>
