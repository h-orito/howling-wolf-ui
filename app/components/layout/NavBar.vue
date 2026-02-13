<template>
  <nav
    class="navbar-container fixed top-0 right-0 left-0 z-50"
    role="navigation"
    aria-label="メインナビゲーション"
  >
    <!-- Mobile menu button -->
    <div class="navbar-menu-icon-area">
      <UiButton
        variant="outline"
        color="secondary"
        class="navbar-menu-icon"
        :class="{ 'is-active': isMenuExpanded }"
        :aria-expanded="isMenuExpanded"
        aria-controls="nav-slider-menu"
        aria-label="メニューを開く"
        @click="toggleMenu"
      >
        <div class="burger-lines" aria-hidden="true">
          <span class="burger-line" :class="{ active: isMenuExpanded }" />
          <span class="burger-line" :class="{ active: isMenuExpanded }" />
          <span class="burger-line" :class="{ active: isMenuExpanded }" />
        </div>
      </UiButton>
    </div>

    <!-- Brand/Title center -->
    <div class="navbar-brand-center">
      <NuxtLink
        to="/"
        class="navbar-title text-center font-semibold text-white transition-colors hover:text-gray-200"
        aria-label="HOWLING WOLF トップページへ"
      >
        HOWLING WOLF{{ isStg ? ' テストサーバ' : '' }}
      </NuxtLink>
    </div>

    <!-- Side menu slider -->
    <NavBarSlider :is-menu-expanded="isMenuExpanded" @hide-menu="hideMenu" />
  </nav>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/button/index.vue'

// State
const isMenuExpanded = ref(false)

// Environment check
const isStg = computed(() => {
  return process.env.NODE_ENV !== 'production'
})

// Methods
const toggleMenu = () => {
  isMenuExpanded.value = !isMenuExpanded.value
}

const hideMenu = () => {
  isMenuExpanded.value = false
}

// Dynamic import for slider
const NavBarSlider = defineAsyncComponent(() => import('./NavBarSlider.vue'))
</script>

<style scoped>
.navbar-container {
  background: rgba(54, 54, 54, 0.9);
  height: 3.25rem;
  display: flex;
  align-items: center;
  backdrop-filter: blur(4px);
}

.navbar-menu-icon-area {
  position: absolute;
  left: 5px;
  width: 40px;
  height: 3.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-menu-icon {
  width: 32px;
  height: 32px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.burger-lines {
  width: 20px;
  height: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.burger-line {
  width: 100%;
  height: 2px;
  background-color: white;
  transition: all 0.3s ease;
}

.burger-line.active:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.burger-line.active:nth-child(2) {
  opacity: 0;
}

.burger-line.active:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.navbar-brand-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.navbar-title {
  text-decoration: none;
  font-size: 1rem;
  line-height: 1.5;
}
</style>
