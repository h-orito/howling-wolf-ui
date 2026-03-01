import type { MessageView, VillageAnchorMessageView } from '~/lib/api/types'

/**
 * アンカーメッセージ取得用composable
 */
export const useAnchorMessage = () => {
  const villageStore = useVillageStore()
  const { apiCall } = useApi()

  /**
   * アンカーメッセージを取得
   * @param typeCode メッセージタイプコード
   * @param number メッセージ番号
   * @returns MessageView | null
   */
  const loadAnchorMessage = async (
    typeCode: string,
    number: number
  ): Promise<MessageView | null> => {
    if (!villageStore.villageId) return null

    try {
      const response = await apiCall<VillageAnchorMessageView>(
        `/village/${villageStore.villageId}/message/type/${typeCode}/number/${number}`
      )
      return response.message ?? null
    } catch (error) {
      console.error('アンカーメッセージの取得に失敗しました:', error)
      return null
    }
  }

  return { loadAnchorMessage }
}
