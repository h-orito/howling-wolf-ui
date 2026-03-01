import type {
  VillageView,
  VillageDayView,
  CharachipView
} from '~/lib/api/types'

/**
 * 村情報の取得・管理
 */
export const useVillage = () => {
  const villageStore = useVillageStore()
  const { apiCall } = useApi()

  const loading = ref(false)
  const error = ref<Error | null>(null)

  /**
   * 村を初期化（村IDの設定、村情報の読み込み、最新日の設定、キャラチップ情報の取得）
   */
  const initVillage = async (id: number) => {
    villageStore.init(id)
    await loadVillage()

    if (villageStore.latestDay) {
      villageStore.saveCurrentVillageDay(villageStore.latestDay)
    }

    if (villageStore.village) {
      const charachips = await fetchCharachips()
      villageStore.saveCharachips(charachips)
    }
  }

  /**
   * キャラチップ情報を取得（HW: 単一キャラチップ）
   */
  const fetchCharachips = async (): Promise<CharachipView[]> => {
    try {
      if (!villageStore.village) return []
      const charachipId = villageStore.village.setting.charachip.charachip_id
      const response = await apiCall<CharachipView>(`/charachip/${charachipId}`)
      return [response]
    } catch (err) {
      console.error('キャラチップ情報の取得に失敗しました:', err)
      return []
    }
  }

  /**
   * 村情報を取得
   */
  const loadVillage = async () => {
    if (!villageStore.villageId) {
      error.value = new Error('村IDが設定されていません')
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await apiCall<VillageView>(
        `/village/${villageStore.villageId}`
      )
      villageStore.saveVillage(data)
    } catch (err) {
      error.value =
        err instanceof Error
          ? err
          : new Error(
              `村情報の取得に失敗しました (村ID: ${villageStore.villageId})`
            )
      console.error(
        `村情報の取得に失敗しました (村ID: ${villageStore.villageId}):`,
        err
      )
    } finally {
      loading.value = false
    }
  }

  const changeCurrentVillageDay = (day: VillageDayView | null) => {
    villageStore.saveCurrentVillageDay(day)
  }

  const changeCurrentVillageDayById = (villageDayId: number) => {
    if (!villageStore.village) return
    const day = villageStore.village.day.day_list.find(
      (d) => d.id === villageDayId
    )
    if (day) {
      villageStore.saveCurrentVillageDay(day)
    }
  }

  const allParticipants = computed(() => {
    if (!villageStore.village) return []
    return [
      ...villageStore.village.participant.member_list,
      ...villageStore.village.spectator.member_list
    ]
  })

  const allParticipantIds = computed(() => {
    return allParticipants.value.map((p) => p.id)
  })

  const currentVillageDayIndex = computed(() => {
    if (!villageStore.village || !villageStore.currentVillageDay) return -1
    return villageStore.village.day.day_list.findIndex(
      (day) => day.id === villageStore.currentVillageDay?.id
    )
  })

  const existPrevDay = computed(() => {
    if (!villageStore.village || !villageStore.currentVillageDay) return false
    return currentVillageDayIndex.value !== 0
  })

  const existNextDay = computed(() => {
    if (!villageStore.village || !villageStore.currentVillageDay) return false
    return (
      currentVillageDayIndex.value !==
      villageStore.village.day.day_list.length - 1
    )
  })

  const prevDayId = computed(() => {
    if (!existPrevDay.value || !villageStore.village) return null
    return (
      villageStore.village.day.day_list[currentVillageDayIndex.value - 1]?.id ??
      null
    )
  })

  const nextDayId = computed(() => {
    if (!existNextDay.value || !villageStore.village) return null
    return (
      villageStore.village.day.day_list[currentVillageDayIndex.value + 1]?.id ??
      null
    )
  })

  const toPrevDay = () => {
    if (prevDayId.value === null) return
    changeCurrentVillageDayById(prevDayId.value)
  }

  const toNextDay = () => {
    if (nextDayId.value === null) return
    changeCurrentVillageDayById(nextDayId.value)
  }

  const isCurrentVillageDayLatest = computed(() => {
    if (!villageStore.latestDay || !villageStore.currentVillageDay) return false
    return villageStore.currentVillageDay.id === villageStore.latestDay.id
  })

  return {
    village: computed(() => villageStore.village),
    villageId: computed(() => villageStore.villageId),
    currentVillageDay: computed(() => villageStore.currentVillageDay),
    latestDay: computed(() => villageStore.latestDay),
    charachips: computed(() => villageStore.charachips),

    allParticipantIds,
    allParticipants,
    existPrevDay,
    existNextDay,
    prevDayId,
    nextDayId,
    isCurrentVillageDayLatest,

    loading: readonly(loading),
    error: readonly(error),

    initVillage,
    loadVillage,
    changeCurrentVillageDay,
    changeCurrentVillageDayById,
    toPrevDay,
    toNextDay
  }
}
