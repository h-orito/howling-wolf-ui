import { defineStore } from 'pinia'

/**
 * 村ページのスライダー（サイドバー）の開閉状態を管理するStore
 */
export const useVillageSliderStore = defineStore('village-slider', () => {
  // State
  const isOpen = ref(false)

  // Actions
  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  const reset = () => {
    isOpen.value = false
  }

  return {
    // State
    isOpen: readonly(isOpen),

    // Actions
    toggle,
    open,
    close,
    reset
  }
})
