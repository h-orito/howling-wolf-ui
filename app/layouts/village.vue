<template>
  <div class="site">
    <!-- スキップリンク（アクセシビリティ向上） -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-100 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:shadow-lg"
    >
      メインコンテンツへスキップ
    </a>

    <!-- Google Ads -->
    <GoogleAds />

    <!-- Site Content (no navbar in village layout) -->
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
</script>
