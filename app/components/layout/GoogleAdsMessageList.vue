<template>
  <div v-if="isProduction" class="my-4">
    <ins
      class="adsbygoogle"
      style="display: block"
      data-ad-format="fluid"
      data-ad-layout-key="-hm-c+2i-1u-38"
      data-ad-client="ca-pub-0917187897820609"
      data-ad-slot="5122687444"
    ></ins>
  </div>
  <!-- ローカル開発用ダミー広告 -->
  <div v-else class="my-4">
    <a
      href="https://www.google.com"
      class="block w-full rounded border border-gray-300 bg-gray-100 py-6 text-center text-sm text-gray-500 hover:bg-gray-200"
    >
      [ダミー広告] Google に移動
    </a>
  </div>
</template>

<script setup lang="ts">
const isProduction = computed(() => process.env.NODE_ENV === 'production')

onMounted(() => {
  if (isProduction.value && import.meta.client) {
    nextTick(() => {
      try {
        window.adsbygoogle = window.adsbygoogle ?? []
        window.adsbygoogle.push({})
      } catch (e) {
        console.error('Adsense error:', e)
      }
    })
  }
})
</script>
