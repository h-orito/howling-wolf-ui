import { useVillageSayStatusStore } from '~/stores/village-say-status'

/**
 * 発言入力状態を管理するcomposable
 */
export const useVillageSayStatus = () => {
  const store = useVillageSayStatusStore()

  return {
    isInputting: computed(() => store.isInputting),
    setHasInputText: store.setHasInputText,
    setConfirmModalOpen: store.setConfirmModalOpen,
    setSubmitting: store.setSubmitting,
    reset: store.reset
  }
}
