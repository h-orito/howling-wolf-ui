<template>
  <div class="site">
    <nav-bar />
    <div class="siteContent">
      <nuxt class="has-text-centered" />
    </div>
  </div>
</template>

<script>
import NavBar from '~/components/common/nav-bar.vue'

export default {
  components: {
    NavBar
  }
}
</script>

<style lang="scss" scoped>
.siteContent {
  // nav-bar分
  margin-top: 3.25rem;
}
</style>
