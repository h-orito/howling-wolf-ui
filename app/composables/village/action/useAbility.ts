import type { FetchError } from 'ofetch'
import { useVillage } from '~/composables/village/useVillage'

/**
 * 能力行使処理のAPI呼び出しロジック
 */
export const useAbility = () => {
  const { apiCall } = useApi()
  const { villageId } = useVillage()

  // State
  const submitting = ref(false)
  const error = ref<string | null>(null)

  /**
   * 能力行使API
   * POST /village/{villageId}/ability
   * @param abilityType 能力タイプコード
   * @param targetId ターゲットの参加者ID（省略可能）
   * @param myselfId 行使者の参加者ID（襲撃担当者選択時のみ使用）
   * @returns 成功時true、失敗時false
   */
  const setAbility = async (
    abilityType: string,
    targetId: number | null,
    myselfId?: number | null
  ): Promise<boolean> => {
    submitting.value = true
    error.value = null

    try {
      await apiCall(`/village/${villageId.value}/ability`, {
        method: 'POST',
        body: {
          ability_type: abilityType,
          target_id: targetId ?? undefined,
          myself_id: myselfId ?? undefined
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
    console.error('Ability API error:', err)
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
    setAbility,
    clearError
  }
}
