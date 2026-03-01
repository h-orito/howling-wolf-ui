import type { DebugVillageView } from '~/lib/api/types'
import { useVillage } from '~/composables/village/useVillage'

/**
 * デバッグ操作のAPI呼び出しロジック
 */
export const useDebug = () => {
  const { apiCall } = useApi()
  const { villageId } = useVillage()

  // State
  const submitting = ref(false)
  const error = ref<string | null>(null)

  /**
   * デバッグ用村情報取得
   * GET /admin/village/{villageId}
   */
  const fetchDebugVillage = async (): Promise<DebugVillageView | null> => {
    try {
      return await apiCall<DebugVillageView>(
        `/admin/village/${villageId.value}`
      )
    } catch (err) {
      handleApiError(err)
      return null
    }
  }

  /**
   * N名参加させる
   * POST /admin/village/{villageId}/participate
   */
  const debugParticipate = async (
    participateCount: number
  ): Promise<boolean> => {
    submitting.value = true
    error.value = null

    try {
      await apiCall(`/admin/village/${villageId.value}/participate`, {
        method: 'POST',
        body: { participate_count: participateCount }
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
   * ダミーログイン
   * POST /admin/village/{villageId}/dummy-login
   */
  const dummyLogin = async (targetId: number): Promise<boolean> => {
    submitting.value = true
    error.value = null

    try {
      await apiCall(`/admin/village/${villageId.value}/dummy-login`, {
        method: 'POST',
        body: { target_id: targetId }
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
   * 突然死なしにする
   * POST /admin/village/{villageId}/no-suddenly-death
   */
  const setNoSuddenlyDeath = async (): Promise<boolean> => {
    submitting.value = true
    error.value = null

    try {
      await apiCall(`/admin/village/${villageId.value}/no-suddenly-death`, {
        method: 'POST'
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
   * 日付を進める
   * POST /admin/village/{villageId}/change-day
   */
  const changeDay = async (): Promise<boolean> => {
    submitting.value = true
    error.value = null

    try {
      await apiCall(`/admin/village/${villageId.value}/change-day`, {
        method: 'POST'
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
   * 100回発言する
   * POST /admin/village/{villageId}/multiple-say
   */
  const multipleSay = async (): Promise<boolean> => {
    submitting.value = true
    error.value = null

    try {
      await apiCall(`/admin/village/${villageId.value}/multiple-say`, {
        method: 'POST'
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
      const fetchError = err as Error & {
        data?: { message?: string; status?: number }
        statusCode?: number
      }

      if (fetchError.statusCode === 499 || fetchError.data?.status === 499) {
        error.value = fetchError.data?.message ?? 'エラーが発生しました'
      } else {
        error.value = err.message
      }
    } else {
      error.value = 'エラーが発生しました'
    }
    console.error('Debug API error:', err)
  }

  /**
   * エラーをクリア
   */
  const clearError = () => {
    error.value = null
  }

  return {
    submitting: readonly(submitting),
    error: readonly(error),
    fetchDebugVillage,
    debugParticipate,
    dummyLogin,
    setNoSuddenlyDeath,
    changeDay,
    multipleSay,
    clearError
  }
}
