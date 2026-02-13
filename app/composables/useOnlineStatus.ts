/**
 * オンライン/オフライン状態を監視するcomposable
 *
 * 複数コンポーネントで使用可能。
 * リスナーは参照カウントで管理され、最後のコンポーネントがアンマウントされた時にのみ削除される。
 */

const isOnline = ref(true)
let listenerCount = 0

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}

export const useOnlineStatus = () => {
  onMounted(() => {
    // 初期状態を設定
    updateOnlineStatus()

    // 最初のコンポーネントがマウントされた時のみリスナーを追加
    if (listenerCount === 0) {
      window.addEventListener('online', updateOnlineStatus)
      window.addEventListener('offline', updateOnlineStatus)
    }
    listenerCount++
  })

  onUnmounted(() => {
    listenerCount--
    // 最後のコンポーネントがアンマウントされた時のみリスナーを削除
    if (listenerCount === 0) {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  })

  return {
    isOnline: readonly(isOnline)
  }
}
