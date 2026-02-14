import type { FetchError } from 'ofetch'
import type { MessageView, VillageParticipateBody } from '~/lib/api/types'
import { useVillage } from '~/composables/village/useVillage'

export interface ParticipateForm {
  charaId: number
  firstRequestSkill: string
  secondRequestSkill: string
  joinMessage: string
  joinPassword: string
  spectator: boolean
}

/**
 * 入村・見学参加のAPI呼び出しロジック
 */
export const useParticipate = () => {
  const { apiCall } = useApi()
  const { villageId } = useVillage()

  // State
  const confirming = ref(false)
  const submitting = ref(false)
  const error = ref<string | null>(null)

  /**
   * フォームをAPIリクエストボディに変換
   */
  const toRequestBody = (form: ParticipateForm): VillageParticipateBody => {
    return {
      chara_id: form.charaId,
      first_request_skill: form.firstRequestSkill,
      second_request_skill: form.secondRequestSkill,
      join_message: form.joinMessage,
      join_password: form.joinPassword || undefined,
      spectator: form.spectator
    }
  }

  /**
   * 入村確認API
   * POST /village/{villageId}/participate-confirm
   * @returns 確認用メッセージ（プレビュー用）、エラー時はnull
   */
  const confirmParticipate = async (
    form: ParticipateForm
  ): Promise<MessageView | null> => {
    confirming.value = true
    error.value = null

    try {
      const response = await apiCall<MessageView>(
        `/village/${villageId.value}/participate-confirm`,
        {
          method: 'POST',
          body: toRequestBody(form)
        }
      )
      return response
    } catch (err) {
      handleApiError(err)
      return null
    } finally {
      confirming.value = false
    }
  }

  /**
   * 入村実行API
   * POST /village/{villageId}/participate
   * @returns 成功時true、失敗時false
   */
  const participate = async (form: ParticipateForm): Promise<boolean> => {
    submitting.value = true
    error.value = null

    try {
      await apiCall(`/village/${villageId.value}/participate`, {
        method: 'POST',
        body: toRequestBody(form)
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
    console.error('Participate API error:', err)
  }

  /**
   * エラーをクリア
   */
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    confirming: readonly(confirming),
    submitting: readonly(submitting),
    error: readonly(error),

    // Methods
    confirmParticipate,
    participate,
    clearError
  }
}
