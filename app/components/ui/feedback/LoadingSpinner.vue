<template>
  <div class="loading-bg" :class="{ 'loading-fixed': fixed }">
    <div class="loading-content">
      <img
        src="/image/loading.gif"
        width="80"
        height="80"
        alt="loading..."
        class="opacity-100"
        loading="eager"
      />
      <p class="mt-2 text-sm text-gray-800">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
  fixed?: boolean
}

withDefaults(defineProps<Props>(), {
  message: '読み込み中',
  fixed: false
})
</script>

<style scoped>
.loading-bg {
  z-index: 50;
  position: relative;
  background: rgba(255, 255, 255, 0.5);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
}

.loading-fixed {
  position: fixed;
  top: 3.25rem;
  left: 0;
  height: calc(100dvh - 3.25rem);
}

.loading-content {
  position: absolute;
  width: 200px;
  height: 100px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
