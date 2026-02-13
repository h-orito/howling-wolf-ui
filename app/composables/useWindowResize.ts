import { useWindowSize } from '@vueuse/core'

/**
 * ウィンドウサイズを監視し、モバイル/デスクトップ判定を提供
 */
export const useWindowResize = () => {
  // ウィンドウサイズを取得（リアクティブ）
  const { width, height } = useWindowSize()

  // モバイル判定（768px未満）
  const isMobile = computed(() => width.value < 768)

  // デスクトップ判定（1024px以上）
  const isDesktop = computed(() => width.value >= 1024)

  return {
    width: readonly(width),
    height: readonly(height),
    isMobile: readonly(isMobile),
    isDesktop: readonly(isDesktop)
  }
}
