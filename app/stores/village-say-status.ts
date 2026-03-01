import { defineStore } from 'pinia'

/**
 * 発言入力の状態を管理するストア
 * 自動更新の制御などに使用
 */
export const useVillageSayStatusStore = defineStore(
  'village-say-status',
  () => {
    // State
    const hasInputText = ref(false)
    const isConfirmModalOpen = ref(false)
    const isSubmitting = ref(false)

    // Computed
    /**
     * 入力中かどうか（自動更新を抑制すべきか）
     */
    const isInputting = computed(() => {
      return (
        hasInputText.value || isConfirmModalOpen.value || isSubmitting.value
      )
    })

    // Actions
    const setHasInputText = (value: boolean) => {
      hasInputText.value = value
    }

    const setConfirmModalOpen = (value: boolean) => {
      isConfirmModalOpen.value = value
    }

    const setSubmitting = (value: boolean) => {
      isSubmitting.value = value
    }

    /**
     * 状態をリセット（コンポーネントアンマウント時など）
     */
    const reset = () => {
      hasInputText.value = false
      isConfirmModalOpen.value = false
      isSubmitting.value = false
    }

    return {
      // State (readonly)
      hasInputText: readonly(hasInputText),
      isConfirmModalOpen: readonly(isConfirmModalOpen),
      isSubmitting: readonly(isSubmitting),

      // Computed
      isInputting,

      // Actions
      setHasInputText,
      setConfirmModalOpen,
      setSubmitting,
      reset
    }
  }
)
