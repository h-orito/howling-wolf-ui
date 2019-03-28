<template>
  <div class="site">
    <nav-bar />
    <div class="siteContent">
      <nuxt class="has-text-centered" />
    </div>
  </div>
</template>

<script>
import NavBar from '~/components/navbar.vue'

export default {
  components: {
    NavBar
  }
}
</script>
