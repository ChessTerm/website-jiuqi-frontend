<template>
  <div :style="{ 'margin-bottom': height + 'px' }">
    <nuxt />
    <page-footer />
  </div>
</template>

<script lang="ts">
import Vue from "vue"

import PageFooter from "~/components/PageFooter.vue"

export default Vue.extend({
  components: {
    PageFooter,
  },
  data() {
    return {
      height: 240,
    }
  },
  mounted() {
    window.addEventListener("resize", this.fitFooter)
    this.fitFooter()
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.fitFooter)
  },
  methods: {
    fitFooter() {
      const footer = document.getElementById("footer") as HTMLDivElement
      const { height } = footer.getBoundingClientRect()
      this.height = height + 80
    },
  },
})
</script>
