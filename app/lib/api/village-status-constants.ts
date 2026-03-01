// 村ステータス定数
export const VILLAGE_STATUS = {
  /** 廃村 */
  CANCEL: 'CANCEL',
  /** 終了 */
  COMPLETED: 'COMPLETED',
  /** エピローグ */
  EPILOGUE: 'EPILOGUE',
  /** 進行中 */
  IN_PROGRESS: 'IN_PROGRESS',
  /** プロローグ */
  PROLOGUE: 'PROLOGUE'
} as const

export type VillageStatusCode =
  (typeof VILLAGE_STATUS)[keyof typeof VILLAGE_STATUS]

// 村ステータス名称
export const VILLAGE_STATUS_NAME: Record<VillageStatusCode, string> = {
  [VILLAGE_STATUS.CANCEL]: '廃村',
  [VILLAGE_STATUS.COMPLETED]: '終了',
  [VILLAGE_STATUS.EPILOGUE]: 'エピローグ',
  [VILLAGE_STATUS.IN_PROGRESS]: '進行中',
  [VILLAGE_STATUS.PROLOGUE]: 'プロローグ'
}
