<template>
  <div class="site">
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

@Component({
  components: { NavBar }
})
export default class Default extends Vue {
  private get isProduction(): boolean {
    return (process.env as any).ENV === 'production'
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
