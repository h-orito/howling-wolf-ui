/**
 * アクションコンポーネントのリセット処理を管理するcomposable
 *
 * - 各コンポーネントがonResetでリセット処理を登録
 * - triggerResetで全登録済みリセット処理を一括実行
 */
const resetCallbacks = ref<Set<() => void>>(new Set())

export const useActionReset = () => {
  /**
   * リセット処理を登録
   * コンポーネントがアンマウントされると自動的に解除される
   */
  const onReset = (callback: () => void) => {
    resetCallbacks.value.add(callback)
    onUnmounted(() => resetCallbacks.value.delete(callback))
  }

  /**
   * 全登録済みリセット処理を実行
   * ActionContainerのhandleActionComplete内で呼び出す
   */
  const triggerReset = () => {
    resetCallbacks.value.forEach((cb) => cb())
  }

  return { onReset, triggerReset }
}
