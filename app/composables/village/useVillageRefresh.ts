import type { VillageLatestView } from '~/lib/api/types'
import { useVillage } from './useVillage'
import { useMessage } from './useMessage'
import { useSituation } from './useSituation'
import { useVillageMessageFilter } from './useVillageMessageFilter'
import { useVillageSayStatus } from './useVillageSayStatus'
import { useActionReset } from './action/useActionReset'

/**
 * 村ページの更新処理を統合管理
 */
export const useVillageRefresh = () => {
  const villageStore = useVillageStore()
  const {
    loadVillage,
    villageId,
    latestDay,
    isCurrentVillageDayLatest,
    changeCurrentVillageDay
  } = useVillage()
  const { loadMessages, isDispLatest, isViewingLatestMessages, setDispLatest } =
    useMessage()
  const { loadSituation } = useSituation()
  const { isFiltering } = useVillageMessageFilter()
  const { isInputting } = useVillageSayStatus()
  const { triggerReset } = useActionReset()
  const { apiCall } = useApi()

  /**
   * 村情報、発言、参加状況を一括更新
   */
  const refresh = async () => {
    if (!villageId) return
    const currentVillageDay = latestDay.value
    const currentIsDispLatest = isDispLatest.value

    await loadVillage()

    if (latestDay.value) {
      changeCurrentVillageDay(latestDay.value)
    }

    setDispLatest(true)

    if (currentIsDispLatest && currentVillageDay === latestDay.value) {
      loadMessages()
    }

    loadSituation()
    updateVillageLatest()
    villageStore.saveExistsNewMessages(false)
    triggerReset()
  }

  const handleNewMessage = async () => {
    if (!shouldAutoRefresh.value) return
    await loadMessages()
    villageStore.saveExistsNewMessages(false)
  }

  const handleDayChange = async () => {
    if (!shouldAutoRefresh.value) return
    await refresh()
  }

  const shouldAutoRefresh = computed(() => {
    if (!isCurrentVillageDayLatest.value) return false
    if (!isViewingLatestMessages.value) return false
    if (isInputting.value) return false
    if (isFiltering.value) return false
    return true
  })

  const updateVillageLatest = async () => {
    const latest = await loadVillageLatest()
    villageStore.saveVillageLatest(latest)
  }

  const loadVillageLatest = async (): Promise<VillageLatestView> => {
    const url = `/village/${villageStore.villageId}/latest`
    return await apiCall<VillageLatestView>(url)
  }

  return {
    refresh,
    handleDayChange,
    handleNewMessage,
    loadVillageLatest,
    updateVillageLatest
  }
}
