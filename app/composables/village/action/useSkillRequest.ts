import type { FetchError } from 'ofetch'
import { useVillage } from '~/composables/village/useVillage'

/**
 * 役職希望変更処理のAPI呼び出しロジック
 */
export const useSkillRequest = () => {
  const { apiCall } = useApi()
  const { villageId } = useVillage()

  // State
  const submitting = ref(false)
  const error = ref<string | null>(null)

  /**
   * 役職希望変更API
   * POST /village/{villageId}/change-skill
   * @param firstRequestSkillCode 第1希望役職コード
   * @param secondRequestSkillCode 第2希望役職コード
   * @returns 成功時true、失敗時false
   */
  const requestSkill = async (
    firstRequestSkillCode: string,
    secondRequestSkillCode: string
  ): Promise<boolean> => {
    submitting.value = true
    error.value = null

    try {
      await apiCall(`/village/${villageId.value}/change-skill`, {
        method: 'POST',
        body: {
          first_request_skill: firstRequestSkillCode,
          second_request_skill: secondRequestSkillCode
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
    console.error('Skill request API error:', err)
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
    requestSkill,
    clearError
  }
}
