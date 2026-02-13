import { defineStore } from 'pinia'
import {
  MESSAGE_TYPE_GROUP,
  ALL_MESSAGE_TYPE_GROUPS,
  type MessageTypeGroup
} from '~/lib/api/message-constants'

// 発言種別のグループマッピング
const MESSAGE_TYPE_GROUP_MAP: Map<string, string[]> = new Map([
  [MESSAGE_TYPE_GROUP.SYSTEM, ['PUBLIC_SYSTEM', 'PARTICIPANTS']],
  [
    MESSAGE_TYPE_GROUP.PRIVATE_SYSTEM,
    [
      'PRIVATE_SYSTEM',
      'PRIVATE_SEER',
      'PRIVATE_PSYCHIC',
      'PRIVATE_WEREWOLF',
      'PRIVATE_FANATIC',
      'PRIVATE_MASON',
      'PRIVATE_FOX',
      'PRIVATE_SYMPATHIZER'
    ]
  ],
  [MESSAGE_TYPE_GROUP.NORMAL_SAY, ['NORMAL_SAY']],
  [MESSAGE_TYPE_GROUP.WEREWOLF_SAY, ['WEREWOLF_SAY']],
  [MESSAGE_TYPE_GROUP.MASON_SAY, ['MASON_SAY']],
  [MESSAGE_TYPE_GROUP.MONOLOGUE_SAY, ['MONOLOGUE_SAY']],
  [MESSAGE_TYPE_GROUP.GRAVE_SAY, ['GRAVE_SAY', 'SPECTATE_SAY']],
  [MESSAGE_TYPE_GROUP.SECRET_SAY, ['SECRET_SAY']],
  [MESSAGE_TYPE_GROUP.CREATOR_SAY, ['CREATOR_SAY']]
])

/**
 * 村の発言フィルタ状態管理Store
 */
export const useVillageMessageFilterStore = defineStore(
  'village-message-filter',
  () => {
    // Filter state
    const messageTypeGroups = ref<MessageTypeGroup[]>([
      ...ALL_MESSAGE_TYPE_GROUPS
    ])
    const participantIdFilter = ref<number[] | null>(null)
    const keywordFilter = ref<string | null>(null)

    // Computed
    /**
     * 発言種別グループから実際の発言種別リストに変換
     */
    const messageTypeFilter = computed((): string[] => {
      const list: string[] = []
      messageTypeGroups.value.forEach((group) => {
        const types = MESSAGE_TYPE_GROUP_MAP.get(group)
        if (types) {
          list.push(...types)
        }
      })
      return list
    })

    // Actions
    /**
     * フィルタ条件を設定
     */
    const setMessageFilter = (filter: {
      messageTypeGroups?: MessageTypeGroup[] | null
      participantIdList?: number[] | null
      keyword?: string | null
    }) => {
      if (filter.messageTypeGroups !== undefined) {
        messageTypeGroups.value = filter.messageTypeGroups ?? [
          ...ALL_MESSAGE_TYPE_GROUPS
        ]
      }
      if (filter.participantIdList !== undefined) {
        participantIdFilter.value = filter.participantIdList
      }
      if (filter.keyword !== undefined) {
        keywordFilter.value = filter.keyword
      }
    }

    /**
     * フィルタ条件をリセット
     */
    const resetMessageFilter = () => {
      messageTypeGroups.value = [...ALL_MESSAGE_TYPE_GROUPS]
      participantIdFilter.value = null
      keywordFilter.value = null
    }

    return {
      // Filter state
      messageTypeGroups: readonly(messageTypeGroups),
      participantIdFilter: readonly(participantIdFilter),
      keywordFilter: readonly(keywordFilter),

      // Computed
      messageTypeFilter,

      // Actions
      setMessageFilter,
      resetMessageFilter
    }
  }
)
