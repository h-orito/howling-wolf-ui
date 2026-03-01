import type { FetchError } from 'ofetch'
import type { VillageSayBody, MessageView } from '~/lib/api/types'
import { useVillage } from '~/composables/village/useVillage'

/**
 * 発言処理のAPI呼び出しロジック
 */
export const useSay = () => {
  const { apiCall } = useApi()
  const { villageId } = useVillage()

  // State
  const submitting = ref(false)
  const error = ref<string | null>(null)

  /**
   * 発言実行API
   * POST /village/{villageId}/say
   * @param body 発言リクエストボディ
   * @returns 成功時true、失敗時false
   */
  const say = async (body: VillageSayBody): Promise<boolean> => {
    submitting.value = true
    error.value = null

    try {
      await apiCall(`/village/${villageId.value}/say`, {
        method: 'POST',
        body
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
   * 発言確認API（プレビュー用）
   * POST /village/{villageId}/say-confirm
   * @param body 発言リクエストボディ
   * @returns 成功時MessageView、失敗時null
   */
  const sayConfirm = async (
    body: VillageSayBody
  ): Promise<MessageView | null> => {
    submitting.value = true
    error.value = null

    try {
      const response = await apiCall<MessageView>(
        `/village/${villageId.value}/say-confirm`,
        {
          method: 'POST',
          body
        }
      )
      return response
    } catch (err) {
      handleApiError(err)
      return null
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
    console.error('Say API error:', err)
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
    say,
    sayConfirm,
    clearError
  }
}
