/**
 * 村メモの管理（LocalStorage使用、最大3つまで）
 */
export const useVillageMemo = () => {
  /**
   * LocalStorageキー名を生成
   */
  const getStorageKey = (villageId: number, memoNumber: number): string => {
    return `village-memo-${villageId}-${memoNumber}`
  }

  /**
   * メモを取得
   */
  const getMemo = (villageId: number, memoNumber: number): string => {
    if (typeof window === 'undefined') return ''
    const key = getStorageKey(villageId, memoNumber)
    return localStorage.getItem(key) ?? ''
  }

  /**
   * メモを保存
   */
  const saveMemo = (
    villageId: number,
    memoNumber: number,
    text: string
  ): void => {
    if (typeof window === 'undefined') return
    const key = getStorageKey(villageId, memoNumber)
    localStorage.setItem(key, text)
  }

  /**
   * 全てのメモを取得(1-3)
   */
  const getAllMemos = (villageId: number): Record<number, string> => {
    return {
      1: getMemo(villageId, 1),
      2: getMemo(villageId, 2),
      3: getMemo(villageId, 3)
    }
  }

  return {
    getMemo,
    saveMemo,
    getAllMemos
  }
}
