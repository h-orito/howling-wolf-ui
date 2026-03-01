<template>
  <div class="site min-h-screen">
    <!-- ぼかし背景 -->
    <div class="site-bg-blur" aria-hidden="true" />

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
    <div class="site-content-wrap">
      <div class="h-14 w-full bg-black" aria-hidden="true" />

      <!-- Navigation Bar -->
      <NavBar />

      <!-- Site Content -->
      <main id="main-content" class="siteContent text-center" role="main">
        <slot />
      </main>
    </div>
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

<style scoped>
.site-bg-blur {
  position: fixed;
  inset: 0;
  background-image: url('/image/top.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(20px) brightness(0.6);
  transform: scale(1.1);
  z-index: 0;
}

.site-content-wrap {
  position: relative;
  z-index: 1;
  max-width: 960px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: white;
}
</style>
