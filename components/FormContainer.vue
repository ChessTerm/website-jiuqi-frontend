<template>
  <b-container class="mt-3 mb-5 mt-md-5" fluid="md">
    <b-jumbotron class="pt-sm-4 pb-sm-5">
      <h1 class="display-4">
        ChessTerm <small id="version" class="d-none d-sm-inline text-muted">for 久棋 ({{ version }})</small>
      </h1>
      <p class="lead mb-0">
        An online checkerboard dedicated to 久棋.
      </p>
    </b-jumbotron>

    <div id="form-container">
      <slot />
    </div>
  </b-container>
</template>

<script lang="ts">
import Vue from "vue"

import version from "~/libs/version"

export default Vue.extend({
  computed: {
    version() {
      return version
    },
  },
})
</script>

<style scoped>
  #version {
    font-size: 1.5rem;
  }

  #form-container {
    max-width: 25rem;
    margin: 3rem auto;
  }
</style>
