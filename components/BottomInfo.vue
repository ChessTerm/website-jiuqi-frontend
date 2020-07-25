<template>
  <div class="text-secondary small" id="bottomInfo">
    <p>ChessTerm for 久棋</p>
    <p>Developed by JingBh</p>
    <p>Version {{ version }}</p>
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
  }
</style>
