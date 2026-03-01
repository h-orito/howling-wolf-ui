export const FACE_TYPE = {
  NORMAL: 'NORMAL',
  WEREWOLF: 'WEREWOLF',
  GRAVE: 'GRAVE',
  MONOLOGUE: 'MONOLOGUE',
  MASON: 'MASON',
  SECRET: 'SECRET'
} as const

export type FaceTypeCode = (typeof FACE_TYPE)[keyof typeof FACE_TYPE]
