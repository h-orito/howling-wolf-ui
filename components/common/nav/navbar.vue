<template>
  <nav class="navbar is-dark-opacity is-fixed-top">
    <navbar-burger
      :is-menu-expanded="isMenuExpanded"
      @toggle-menu="toggleMenu"
    />
    <div class="navbar-brand navbar-brand-center">
      <a
        class="navbar-item has-text-center nuxt-link-exact-active nuxt-link-active"
        @click="toHead"
      >
        HOWLING WOLF
      </a>
    </div>
    <navbar-slider :is-menu-expanded="isMenuExpanded" @hide-menu="hideMenu" />
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// component
import navbarBurger from '~/components/common/nav/navbar-burger.vue'
import navbarSlider from '~/components/common/nav/navbar-slider.vue'
// type
import MyselfPlayer from '~/components/type/myself-player'

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
    if (document.scrollingElement == null) return
    if (document.scrollingElement.scrollTop < 10) {
      document.scrollingElement.scrollTop = 0
    } else {
      document.scrollingElement.scrollTop =
        document.scrollingElement.scrollTop / 1.1
      setTimeout(this.toHead, 10)
    }
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
