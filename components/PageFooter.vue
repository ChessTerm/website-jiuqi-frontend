<template>
  <footer id="footer" class="bg-dark text-secondary m-0">
    <b-container class="p-4" fluid="true">
      <b-row align-h="center">
        <b-col cols="12" md="5" lg="4"
               class="text-center text-md-right">
          <p class="mt-2 mb-3">
            <img src="/images/thhs_logo.png" alt="清华附中 Logo" style="height:3rem;">
            <img src="/images/lab_logo.png" alt="高研实验室 Logo" style="height:3rem;">
          </p>
          <h5 class="font-weight-light">
            A 清华附中高研实验室 project.
          </h5>
        </b-col>
        <b-col cols="12" offset-md="1" md="4"
               class="text-center text-md-left">
          <hr class="d-md-none">
          <p class="mb-1">
            Developed by <a href="https://github.com/JingBh" target="_blank">JingBh</a> and <a href="https://github.com/zhc7" target="_blank">ZHC</a>.
          </p>
          <p class="mb-1">
            ChessTerm is open source, <br>
            View source at <a href="https://github.com/ChessTerm" target="_blank">
              <img src="/images/github_logo.png" alt="GitHub Logo" style="height:1rem;"> GitHub</a>.
          </p>
          <p class="mb-0">
            Version {{ version }} / <a href="https://github.com/ChessTerm/website-jiuqi-frontend/releases" target="_blank">Changelogs</a>
          </p>
        </b-col>
      </b-row>
    </b-container>
  </footer>
</template>

<script lang="ts">
import Vue from "vue"

import version from "../libs/version"

export default Vue.extend({
  computed: {
    version() {
      return version
    },
  },
})
</script>

<style scoped>
  #footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }
</style>
