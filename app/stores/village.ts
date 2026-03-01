import { defineStore } from 'pinia'
import type {
  VillageView,
  SituationAsParticipantView,
  VillageLatestView,
  VillageDayView,
  CharachipView,
  DebugVillageView
} from '~/lib/api/types'

/**
 * 村の状態管理Store
 */
export const useVillageStore = defineStore('village', () => {
  // State
  const villageId = ref<number | null>(null)
  const village = ref<VillageView | null>(null)
  const situation = ref<SituationAsParticipantView | null>(null)
  const villageLatest = ref<VillageLatestView | null>(null)
  const currentVillageDay = ref<VillageDayView | null>(null)
  const charachips = ref<CharachipView[]>([])
  const existsNewMessages = ref<boolean>(false)
  const debugVillage = ref<DebugVillageView | null>(null)

  // Computed
  const latestDay = computed(() => {
    if (
      !village.value?.day.day_list ||
      village.value.day.day_list.length === 0
    ) {
      return null
    }
    return (
      village.value.day.day_list[village.value.day.day_list.length - 1] ?? null
    )
  })

  const restrictCountMap = computed(() => {
    if (!village.value?.setting.rules.message_restrict?.restrict_list) {
      return null
    }
    return new Map(
      village.value.setting.rules.message_restrict.restrict_list.map((r) => [
        r.type.code,
        r.count
      ])
    )
  })

  // Actions
  /**
   * 初期化
   */
  const init = (id: number) => {
    villageId.value = id
    village.value = null
    situation.value = null
    villageLatest.value = null
    currentVillageDay.value = null
    charachips.value = []
    existsNewMessages.value = false
    debugVillage.value = null
  }

  /**
   * 村情報を保存
   */
  const saveVillage = (v: VillageView) => {
    village.value = v
  }

  /**
   * 参加状況を保存
   */
  const saveSituation = (s: SituationAsParticipantView) => {
    situation.value = s
  }

  /**
   * 最新情報を保存
   */
  const saveVillageLatest = (latest: VillageLatestView) => {
    villageLatest.value = latest
  }

  /**
   * 現在表示中の日付を保存
   */
  const saveCurrentVillageDay = (day: VillageDayView | null) => {
    currentVillageDay.value = day
  }

  /**
   * キャラチップ情報を保存
   */
  const saveCharachips = (chips: CharachipView[]) => {
    charachips.value = chips
  }

  const saveExistsNewMessages = (exists: boolean) => {
    existsNewMessages.value = exists
  }

  const saveDebugVillage = (debug: DebugVillageView | null) => {
    debugVillage.value = debug
  }

  return {
    // State
    villageId: readonly(villageId),
    village: readonly(village),
    situation: readonly(situation),
    villageLatest: readonly(villageLatest),
    currentVillageDay: readonly(currentVillageDay),
    charachips: readonly(charachips),
    existsNewMessages: readonly(existsNewMessages),
    debugVillage: readonly(debugVillage),

    // Computed
    latestDay,
    restrictCountMap,

    // Actions
    init,
    saveVillage,
    saveSituation,
    saveVillageLatest,
    saveCurrentVillageDay,
    saveCharachips,
    saveExistsNewMessages,
    saveDebugVillage
  }
})
