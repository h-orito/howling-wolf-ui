import type { FetchError } from 'ofetch'
import { useVillage } from '~/composables/village/useVillage'

/**
 * コミット（時短希望）処理のAPI呼び出しロジック
 */
export const useCommit = () => {
  const { apiCall } = useApi()
  const { villageId } = useVillage()

  // State
  const submitting = ref(false)
  const error = ref<string | null>(null)

  /**
   * コミット実行API
   * POST /village/{villageId}/commit
   * @param commit 時短希望するかどうか
   * @returns 成功時true、失敗時false
   */
  const commitRequest = async (commit: boolean): Promise<boolean> => {
    submitting.value = true
    error.value = null

    try {
      await apiCall(`/village/${villageId.value}/commit`, {
        method: 'POST',
        body: {
          commit
        }
      })
      return true
    } catch (err) {
      handleApiError(err)
      return false
    } finally {
      submitting.value = false
    }
  }

  /**
   * APIエラーをハンドリング
   */
  const handleApiError = (err: unknown) => {
    if (err instanceof Error) {
      const fetchError = err as FetchError<{
        message?: string
        status?: number
      }>

      // ビジネスエラー (499) の場合
      if (fetchError.statusCode === 499 || fetchError.data?.status === 499) {
        error.value = fetchError.data?.message ?? 'エラーが発生しました'
      } else {
        error.value = err.message
      }
    } else {
      error.value = 'エラーが発生しました'
    }
    console.error('Commit API error:', err)
  }

  /**
   * エラーをクリア
   */
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    submitting: readonly(submitting),
    error: readonly(error),

    // Methods
    commitRequest,
    clearError
  }
}
