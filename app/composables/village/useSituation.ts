import type { SituationAsParticipantView } from '~/lib/api/types'

/**
 * 参加状況の取得・管理
 */
export const useSituation = () => {
  const villageStore = useVillageStore()
  const { apiCall } = useApi()

  const loading = ref(false)
  const error = ref<Error | null>(null)

  const loadSituation = async () => {
    loading.value = true
    error.value = null
    const villageId = villageStore.villageId

    try {
      const data = await apiCall<SituationAsParticipantView>(
        `/village/${villageId}/situation`
      )
      villageStore.saveSituation(data)
    } catch (err) {
      error.value =
        err instanceof Error
          ? err
          : new Error(`参加状況の取得に失敗しました (村ID: ${villageId})`)
      console.error(`参加状況の取得に失敗しました (村ID: ${villageId}):`, err)
    } finally {
      loading.value = false
    }
  }

  return {
    situation: computed(() => villageStore.situation),
    loading: readonly(loading),
    error: readonly(error),
    loadSituation
  }
}
