<template>
  <OfflineBanner />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toast />
</template>

<script setup lang="ts">
import Toast from '~/components/ui/feedback/Toast.vue'
import OfflineBanner from '~/components/ui/feedback/OfflineBanner.vue'
</script>
