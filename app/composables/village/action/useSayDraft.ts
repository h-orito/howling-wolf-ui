/**
 * 発言入力の下書き自動保存(LocalStorage使用)
 * 広告クリック等でページ離脱時に入力内容が失われることを防止する
 */

/** 下書きデータの型 */
interface SayDraft {
  messageText: string
  messageType: string
  faceType: string
  savedAt: number
}

/** 下書きの有効期限 (24時間) */
const DRAFT_TTL_MS = 24 * 60 * 60 * 1000

export const useSayDraft = () => {
  /**
   * LocalStorageキー名を生成
   */
  const getStorageKey = (villageId: number): string => {
    return `say-draft-${villageId}`
  }

  /**
   * 下書きを取得（TTL超過時はnullを返し、ストレージからも削除）
   */
  const loadDraft = (villageId: number): SayDraft | null => {
    if (import.meta.server) return null

    const key = getStorageKey(villageId)
    const stored = localStorage.getItem(key)
    if (!stored) return null

    try {
      const draft = JSON.parse(stored) as SayDraft

      if (Date.now() - draft.savedAt > DRAFT_TTL_MS) {
        localStorage.removeItem(key)
        return null
      }

      if (!draft.messageText.trim()) {
        localStorage.removeItem(key)
        return null
      }

      return draft
    } catch {
      localStorage.removeItem(key)
      return null
    }
  }

  /**
   * 下書きを保存（テキストが空の場合は削除）
   */
  const saveDraft = (
    villageId: number,
    messageText: string,
    messageType: string,
    faceType: string
  ): void => {
    if (import.meta.server) return

    const key = getStorageKey(villageId)

    if (!messageText.trim()) {
      localStorage.removeItem(key)
      return
    }

    const draft: SayDraft = {
      messageText,
      messageType,
      faceType,
      savedAt: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(draft))
  }

  /**
   * 下書きを削除
   */
  const clearDraft = (villageId: number): void => {
    if (import.meta.server) return

    const key = getStorageKey(villageId)
    localStorage.removeItem(key)
  }

  return {
    loadDraft,
    saveDraft,
    clearDraft
  }
}
