<template>
  <div v-if="isProduction" class="mt-4">
    <ins
      class="adsbygoogle"
      style="display: inline-block; width: 260px; height: 90px"
      data-ad-client="ca-pub-0917187897820609"
      data-ad-slot="2365194990"
    ></ins>
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
