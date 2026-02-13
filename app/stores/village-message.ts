import { defineStore } from 'pinia'
import type { MessagesView } from '~/lib/api/types'

/**
 * 発言の状態管理Store
 */
export const useVillageMessageStore = defineStore('village-message', () => {
  // State
  const messages = ref<MessagesView | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const currentPageNum = ref<number>(1)
  const isDispLatest = ref<boolean>(true)

  // Actions
  /**
   * 初期化
   */
  const init = () => {
    messages.value = null
    loading.value = false
    error.value = null
    currentPageNum.value = 1
    isDispLatest.value = true
  }

  /**
   * 発言を保存
   */
  const saveMessages = (m: MessagesView) => {
    messages.value = m
  }

  /**
   * ローディング状態を設定
   */
  const setLoading = (l: boolean) => {
    loading.value = l
  }

  /**
   * エラーを設定
   */
  const setError = (e: Error | null) => {
    error.value = e
  }

  /**
   * 現在のページ番号を設定
   */
  const setCurrentPageNum = (pageNum: number) => {
    currentPageNum.value = pageNum
  }

  /**
   * 最新表示フラグを設定
   */
  const setIsDispLatest = (disp: boolean) => {
    isDispLatest.value = disp
  }

  return {
    // State
    messages: readonly(messages),
    loading: readonly(loading),
    error: readonly(error),
    currentPageNum: readonly(currentPageNum),
    isDispLatest: readonly(isDispLatest),

    // Actions
    init,
    saveMessages,
    setLoading,
    setError,
    setCurrentPageNum,
    setIsDispLatest
  }
})
