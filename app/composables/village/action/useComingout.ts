import type { FetchError } from 'ofetch'
import type { VillageComingOutBody } from '~/lib/api/types'
import { useVillage } from '~/composables/village/useVillage'

/**
 * カミングアウト処理のAPI呼び出しロジック
 */
export const useComingout = () => {
  const { apiCall } = useApi()
  const { villageId } = useVillage()

  // State
  const submitting = ref(false)
  const error = ref<string | null>(null)

  /**
   * カミングアウト実行API
   * POST /village/{villageId}/comingout
   * @param skillCodes 役職コードの配列（最大2つ、空配列の場合は取り消し）
   * @returns 成功時true、失敗時false
   */
  const comingout = async (skillCodes: string[]): Promise<boolean> => {
    submitting.value = true
    error.value = null

    try {
      const body: VillageComingOutBody = {
        skill_code: skillCodes.length > 0 ? skillCodes : undefined
      }
      await apiCall(`/village/${villageId.value}/comingout`, {
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
    console.error('Comingout API error:', err)
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
    comingout,
    clearError
  }
}
