<template>
  <nav class="navbar is-dark-opacity is-fixed-top">
    <navbar-burger
      :is-menu-expanded="isMenuExpanded"
      @toggle-menu="toggleMenu"
    />
    <div class="navbar-brand navbar-brand-center">
      <nuxt-link
        class="navbar-item has-text-center nuxt-link-exact-active nuxt-link-active"
        :to="{ path: '/' }"
      >
        HOWLING WOLF
      </nuxt-link>
    </div>
    <navbar-slider :is-menu-expanded="isMenuExpanded" @hide-menu="hideMenu" />
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// component
import navbarBurger from '~/components/common/nav/navbar-burger.vue'
// type
import MyselfPlayer from '~/components/type/myself-player'
// dynamic imports
const navbarSlider = () => import('~/components/common/nav/navbar-slider.vue')

@Component({
  components: { navbarBurger, navbarSlider }
})
export default class NavBar extends Vue {
  private isMenuExpanded: boolean = false

  private toggleMenu(): void {
    this.isMenuExpanded = !this.isMenuExpanded
  }

  private hideMenu(): void {
    this.isMenuExpanded = false
  }

  private toHead(): void {
    const element = document.getElementsByClassName('site')
    if (element == null) return
    this.$scrollTo(element[0])
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  display: block !important;

  .navbar-brand-center {
    justify-content: center;
    align-items: center;
  }
}
</style>
