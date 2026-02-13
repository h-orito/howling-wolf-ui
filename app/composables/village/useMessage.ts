import type { MessagesView } from '~/lib/api/types'
import {
  ALL_MESSAGE_TYPE_GROUPS,
  type MessageTypeGroup
} from '~/lib/api/message-constants'
import { useVillage } from './useVillage'
import { useUserSettings } from './useUserSettings'
import { useVillageMessageFilter } from './useVillageMessageFilter'

/**
 * 発言の取得・管理
 */
export const useMessage = () => {
  const messageStore = useVillageMessageStore()
  const { villageId, currentVillageDay, village } = useVillage()
  const { paging } = useUserSettings()
  const { messageTypeGroups, messageTypes, participantIds, keyword } =
    useVillageMessageFilter()
  const { apiCall } = useApi()

  /**
   * 発言を取得
   */
  const loadMessages = async () => {
    if (!villageId.value || !currentVillageDay.value) return

    messageStore.setLoading(true)
    messageStore.setError(null)

    try {
      const pagingSettings = paging.value
      const params: Record<
        string,
        string | number | string[] | number[] | boolean
      > = {}

      // フィルタ条件
      if (
        messageTypes.value &&
        messageTypes.value.length > 0 &&
        messageTypeGroups.value.length < ALL_MESSAGE_TYPE_GROUPS.length
      ) {
        params.message_type_list = [...messageTypes.value]
      }

      const allParticipantCount = village.value
        ? village.value.participant.member_list.length +
          village.value.spectator.member_list.length
        : 0
      if (
        participantIds.value &&
        participantIds.value.length > 0 &&
        participantIds.value.length < allParticipantCount
      ) {
        params.participant_id_list = [...participantIds.value]
      }

      if (keyword.value) {
        params.keyword = keyword.value
      }

      // ページング設定
      if (pagingSettings.isPaging && pagingSettings.messagePerPage) {
        params.page_size = pagingSettings.messagePerPage
        params.page_num = messageStore.isDispLatest
          ? 10000
          : messageStore.currentPageNum
        params.is_disp_latest = messageStore.isDispLatest
      }

      // URLの構築
      const day = currentVillageDay.value
      const url = `/village/${villageId.value}/day/${day.day}/time/${day.noon_night}/message-list`
      const query = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => query.append(key, String(v)))
        } else {
          query.append(key, String(value))
        }
      })

      const fullUrl = query.toString() ? `${url}?${query.toString()}` : url

      const data = await apiCall<MessagesView>(fullUrl)
      messageStore.saveMessages(data)

      if (data.current_page_num != null) {
        messageStore.setCurrentPageNum(data.current_page_num)
      }
    } catch (err) {
      messageStore.setError(
        err instanceof Error
          ? err
          : new Error(`発言の取得に失敗しました (村ID: ${villageId.value})`)
      )
      console.error(`発言の取得に失敗しました (村ID: ${villageId.value}):`, err)
    } finally {
      messageStore.setLoading(false)
    }
  }

  /**
   * フィルタ条件を設定
   */
  const setFilter = (filter: {
    messageTypeGroups?: MessageTypeGroup[] | null
    participantIdList?: number[] | null
    keyword?: string | null
  }) => {
    const { applyFilter } = useVillageMessageFilter()
    applyFilter(
      filter.messageTypeGroups ?? null,
      filter.participantIdList ?? null,
      filter.keyword ?? null
    )
  }

  const resetFilter = () => {
    const { resetFilter: filterReset } = useVillageMessageFilter()
    filterReset()
  }

  const setPageNum = (pageNum: number) => {
    messageStore.setCurrentPageNum(pageNum)
    messageStore.setIsDispLatest(false)
    loadMessages()
  }

  const setDispLatest = (disp: boolean) => {
    messageStore.setIsDispLatest(disp)
    loadMessages()
  }

  const resetPaging = (isLatestDay: boolean = false) => {
    messageStore.setCurrentPageNum(1)
    messageStore.setIsDispLatest(isLatestDay)
    loadMessages()
  }

  const isViewingLatestMessages = computed(() => {
    return (
      messageStore.isDispLatest ||
      messageStore.messages?.current_page_num ===
        messageStore.messages?.all_page_count
    )
  })

  return {
    messages: computed(() => messageStore.messages),
    loading: computed(() => messageStore.loading),
    error: computed(() => messageStore.error),
    currentPageNum: computed(() => messageStore.currentPageNum),
    isDispLatest: computed(() => messageStore.isDispLatest),

    isViewingLatestMessages,

    loadMessages,
    setFilter,
    resetFilter,
    setPageNum,
    setDispLatest,
    resetPaging
  }
}
