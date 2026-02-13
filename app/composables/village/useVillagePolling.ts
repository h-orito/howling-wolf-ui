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
   * 最新情報をチェック（HW版：day_change_datetimeとメッセージ日時で判定）
   */
  const checkLatest = async () => {
    try {
      const currentLatest = villageStore.villageLatest
      const latest = await loadVillageLatest()

      if (!currentLatest) {
        villageStore.saveVillageLatest(latest)
        return
      }

      // 日付変更をチェック
      if (latest.day_change_datetime !== currentLatest.day_change_datetime) {
        villageStore.saveExistsNewMessages(true)
        handleDayChange()
        villageStore.saveVillageLatest(latest)
        return
      }

      // 新着発言をチェック（最新メッセージのunix_time_milliを比較）
      const currentMaxTime = getMaxUnixTime(
        currentLatest.latest_day_message_datetime_list
      )
      const latestMaxTime = getMaxUnixTime(
        latest.latest_day_message_datetime_list
      )

      if (latestMaxTime > currentMaxTime) {
        villageStore.saveExistsNewMessages(true)
        handleNewMessage()
        villageStore.saveVillageLatest(latest)
      }
    } catch (error) {
      console.error('最新情報の取得に失敗しました:', error)
    }
  }

  const getMaxUnixTime = (
    list: readonly { readonly unix_time_milli: number }[] | undefined
  ): number => {
    if (!list || list.length === 0) return 0
    return Math.max(...list.map((m) => m.unix_time_milli))
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
