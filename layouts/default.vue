<template>
  <div>
    <github-banner />
    <nuxt />
    <bottom-info />
  </div>
</template>

<script>
  import GithubBanner from "~/components/GithubBanner";
  import BottomInfo from "~/components/BottomInfo";

  export default {
    components: {
      GithubBanner,
      BottomInfo,
    }
  }
</script>
