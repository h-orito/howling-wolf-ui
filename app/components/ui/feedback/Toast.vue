<template>
  <Teleport to="body">
    <div class="fixed top-4 left-1/2 z-[9999] -translate-x-1/2">
      <TransitionGroup
        name="toast"
        tag="div"
        class="flex flex-col items-center gap-2"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="toastClasses(toast.type)"
          role="alert"
        >
          <Icon :name="iconName(toast.type)" class="mr-2 h-5 w-5 shrink-0" />
          <span class="flex-1 text-sm">{{ toast.message }}</span>
          <button
            type="button"
            class="ml-auto shrink-0 pl-3 opacity-70 transition-opacity hover:opacity-100"
            @click="remove(toast.id)"
          >
            <Icon name="mdi:close" class="h-4 w-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import Icon from '~/components/ui/icon/Icon.vue'

const { toasts, remove } = useToast()

const toastClasses = (type: 'info' | 'success' | 'error') => {
  const baseClasses =
    'flex items-center px-4 py-3 rounded-lg shadow-lg min-w-[280px] max-w-[400px]'

  const typeClasses = {
    info: 'bg-[#ceedf2] dark:bg-cyan-900 text-gray-800 dark:text-cyan-100',
    success: 'bg-[#cef2ce] dark:bg-green-900 text-gray-800 dark:text-green-100',
    error: 'bg-[#f2cece] dark:bg-red-900 text-gray-800 dark:text-red-100'
  }

  return `${baseClasses} ${typeClasses[type]}`
}

const iconName = (type: 'info' | 'success' | 'error') => {
  const icons = {
    info: 'mdi:information',
    success: 'mdi:check-circle',
    error: 'mdi:alert-circle'
  }
  return icons[type]
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
