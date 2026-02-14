/**
 * Toast通知のユーティリティ
 *
 * 使用例:
 * - showInfoToast('情報メッセージ')
 * - showSuccessToast('成功メッセージ')
 * - showErrorToast('エラーメッセージ')
 */

export const showInfoToast = (message: string) => {
  const { add } = useToast()
  add({ message, type: 'info' })
}

export const showSuccessToast = (message: string) => {
  const { add } = useToast()
  add({ message, type: 'success' })
}

export const showErrorToast = (message: string) => {
  const { add } = useToast()
  add({ message, type: 'error' })
}

/**
 * 旧村Toast互換インターフェース
 *
 * 旧コードでの村Toast使用パターンを継続使用するための
 * 互換性レイヤー。段階的にnewインターフェースに移行することを推奨。
 */
export const villageToast = {
  info: (message: string) => showInfoToast(message),
  success: (message: string) => showSuccessToast(message),
  danger: (message: string) => showErrorToast(message)
}
