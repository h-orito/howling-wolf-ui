import type { VillageLatestView } from '~/lib/api/types'
import { useVillageRefresh } from './useVillageRefresh'

/**
 * 村の最新情報を定期的にポーリング
 */
export const useVillagePolling = () => {
  const villageStore = useVillageStore()
  const { handleDayChange, handleNewMessage } = useVillageRefresh()
  const { apiCall } = useApi()

  const pollingInterval = ref<ReturnType<typeof setInterval> | null>(null)

  onUnmounted(() => {
    stopPolling()
  })

  const startPolling = () => {
    stopPolling()
    pollingInterval.value = setInterval(async () => {
      await checkLatest()
    }, 30 * 1000)
  }

  const stopPolling = () => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value)
      pollingInterval.value = null
    }
  }

  /**
   * 最新情報をチェック（スキーマ版：village_day_idとunix_time_milliで判定）
   */
  const checkLatest = async () => {
    try {
      const currentLatest = villageStore.villageLatest
      const latest = await loadVillageLatest()

      if (!currentLatest) {
        villageStore.saveVillageLatest(latest)
        return
      }

      // 日付変更をチェック（village_day_idで比較）
      if (latest.village_day_id !== currentLatest.village_day_id) {
        villageStore.saveExistsNewMessages(true)
        handleDayChange()
        villageStore.saveVillageLatest(latest)
        return
      }

      // 新着発言をチェック（unix_time_milliで比較）
      if (latest.unix_time_milli > currentLatest.unix_time_milli) {
        villageStore.saveExistsNewMessages(true)
        handleNewMessage()
        villageStore.saveVillageLatest(latest)
      }
    } catch (error) {
      console.error('最新情報の取得に失敗しました:', error)
    }
  }

  const loadVillageLatest = async (): Promise<VillageLatestView> => {
    const url = `/village/${villageStore.villageId}/latest`
    return await apiCall<VillageLatestView>(url)
  }

  return {
    villageLatest: computed(() => villageStore.villageLatest),
    existsNewMessages: computed(() => villageStore.existsNewMessages),
    startPolling,
    stopPolling,
    checkLatest
  }
}
