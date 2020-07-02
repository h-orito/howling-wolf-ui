<template>
  <div class="site">
    <google-ads />
    <div class="navbar-background-area"></div>
    <nav-bar />
    <div class="siteContent">
      <nuxt class="has-text-centered" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import NavBar from '~/components/common/nav/navbar.vue'
import googleAds from '~/components/common/nav/google-ads.vue'

@Component({
  components: { NavBar, googleAds }
})
export default class Default extends Vue {}
</script>

<style lang="scss" scoped>
.navbar-background-area {
  width: 100%;
  height: 3.25rem;
  background-color: $black;
}
</style>
