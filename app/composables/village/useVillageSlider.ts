import { storeToRefs } from 'pinia'

/**
 * 村ページのスライダー（サイドバー）の開閉を管理
 */
export const useVillageSlider = () => {
  const sliderStore = useVillageSliderStore()
  const { isOpen } = storeToRefs(sliderStore)

  return {
    isOpen,
    toggle: sliderStore.toggle,
    open: sliderStore.open,
    close: sliderStore.close,
    reset: sliderStore.reset
  }
}
