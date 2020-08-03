<template>
  <div class="text-secondary small" id="bottomInfo">
    <p>ChessTerm for 久棋</p>
    <p>Developed by <a href="https://www.jingbh.top/" target="_blank">JingBh</a></p>
    <p><a href="https://github.com/ChessTerm/website-jiuqi-frontend/releases" target="_blank" v-b-tooltip.hover.right title="点击查看 Changelog">Version {{ version }}</a></p>
  </div>
</template>

<script>
  import version from "~/libs/version";

  export default {
    data() {
      return {
        version
      }
    }
  }
</script>

<style lang="scss" scoped>
  #bottomInfo {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 1rem;
    max-width: 80vw;
    z-index: 0;

    p {
      margin: 0;
    }

    a {
      color: var(--secondary);
    }
  }
</style>
