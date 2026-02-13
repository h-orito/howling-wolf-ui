<template>
  <div class="site min-h-screen">
    <!-- スキップリンク（アクセシビリティ向上） -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-100 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:shadow-lg"
    >
      メインコンテンツへスキップ
    </a>

    <!-- Google Ads -->
    <GoogleAds />

    <!-- Navbar background area -->
    <div class="h-14 w-full bg-black" aria-hidden="true" />

    <!-- Navigation Bar -->
    <NavBar />

    <!-- Site Content -->
    <main id="main-content" class="siteContent text-center" role="main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Dynamic imports for components
const GoogleAds = defineAsyncComponent(
  () => import('../components/layout/GoogleAds.vue')
)
const NavBar = defineAsyncComponent(
  () => import('../components/layout/NavBar.vue')
)
</script>
