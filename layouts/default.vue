<template>
  <div class="site">
    <div class="navbar-background-area"></div>
    <nav-bar />
    <div class="siteContent">
      <nuxt class="has-text-centered" />
    </div>
  </div>
</template>

<script>
import NavBar from '~/components/common/nav/navbar.vue'

export default {
  components: {
    NavBar
  }
}
</script>

<style lang="scss" scoped>
.navbar-background-area {
  width: 100%;
  height: 3.25rem;
  background-color: $black;
}
</style>
