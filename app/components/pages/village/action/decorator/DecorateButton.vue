<template>
  <button
    type="button"
    class="inline-flex h-7 min-w-7 items-center justify-center rounded border border-gray-300 bg-white px-1.5 text-xs transition-colors hover:border-[var(--ui-primary)] hover:bg-gray-50 focus:ring-2 focus:ring-[var(--ui-primary)]/20 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  click: []
}>()
</script>
