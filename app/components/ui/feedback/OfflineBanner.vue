<template>
  <Transition name="slide-down">
    <div
      v-if="!isOnline"
      class="fixed top-0 right-0 left-0 z-50 flex items-center justify-center bg-amber-600 px-4 py-2 text-white shadow-md"
    >
      <Icon name="wifi-off" class="mr-2 h-5 w-5" />
      <span class="text-sm font-medium"
        >オフラインです。一部の機能が制限される場合があります。</span
      >
    </div>
  </Transition>
</template>

<script setup lang="ts">
import Icon from '~/components/ui/icon/Icon.vue'

const { isOnline } = useOnlineStatus()
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
