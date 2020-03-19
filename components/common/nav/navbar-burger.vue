<template>
  <div class="navbar-menu-icon-area">
    <a
      role="button"
      aria-level="menu"
      class="navbar-burger burger navbar-menu-icon"
      :class="isMenuExpanded ? 'is-active' : ''"
      @click="$emit('toggle-menu')"
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class NavBar extends Vue {
  @Prop({ type: Boolean })
  private isMenuExpanded!: boolean
}
</script>

<style lang="scss" scoped>
.navbar-menu-icon-area {
  position: absolute;
  left: 5px;
  width: 40px;
  height: 3.25rem;

  .navbar-menu-icon {
    position: absolute;
    display: block !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
