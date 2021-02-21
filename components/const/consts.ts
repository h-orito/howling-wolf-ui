export const VILLAGE_STATUS: {
  PROLOGUE: string
  PROGRESS: string
  EPILOGUE: string
  COMPLETE: string
  CANCEL: string
} = {
  PROLOGUE: 'PROLOGUE',
  PROGRESS: 'IN_PROGRESS',
  EPILOGUE: 'EPILOGUE',
  COMPLETE: 'COMPLETED',
  CANCEL: 'CANCEL'
}

export const MESSAGE_TYPE: {
  PUBLIC_SYSTEM: string
  PRIVATE_SYSTEM: string
  PRIVATE_SEER: string
  PRIVATE_PSYCHIC: string
  PRIVATE_WEREWOLF: string
  PRIVATE_MASON: string
  PRIVATE_SYMPATHIZER: string
  NORMAL_SAY: string
  MONOLOGUE_SAY: string
  GRAVE_SAY: string
  WEREWOLF_SAY: string
  MASON_SAY: string
  SPECTATE_SAY: string
  CREATOR_SAY: string
  SECRET_SAY: string
  PARTICIPANTS: string
} = {
  PUBLIC_SYSTEM: 'PUBLIC_SYSTEM',
  PRIVATE_SYSTEM: 'PRIVATE_SYSTEM',
  PRIVATE_SEER: 'PRIVATE_SEER',
  PRIVATE_PSYCHIC: 'PRIVATE_PSYCHIC',
  PRIVATE_WEREWOLF: 'PRIVATE_WEREWOLF',
  PRIVATE_MASON: 'PRIVATE_MASON',
  PRIVATE_SYMPATHIZER: 'PRIVATE_SYMPATHIZER',
  NORMAL_SAY: 'NORMAL_SAY',
  MONOLOGUE_SAY: 'MONOLOGUE_SAY',
  GRAVE_SAY: 'GRAVE_SAY',
  WEREWOLF_SAY: 'WEREWOLF_SAY',
  MASON_SAY: 'MASON_SAY',
  SPECTATE_SAY: 'SPECTATE_SAY',
  CREATOR_SAY: 'CREATOR_SAY',
  SECRET_SAY: 'SECRET_SAY',
  PARTICIPANTS: 'PARTICIPANTS'
}

export const FACE_TYPE: {
  NORMAL: string
  WEREWOLF: string
  GRAVE: string
  MONOLOGUE: string
  MASON: string
  SECRET: string
} = {
  NORMAL: 'NORMAL',
  WEREWOLF: 'WEREWOLF',
  GRAVE: 'GRAVE',
  MONOLOGUE: 'MONOLOGUE',
  MASON: 'MASON',
  SECRET: 'SECRET'
}

export const ORGANIZATION_TEMPLATE: Map<string, string> = new Map([
  ['狼狼占村村村村村', '8人'],
  ['狼狼占村村村村村村', '9人'],
  ['狼狼狂占霊狩村村村村', '10人'],
  ['狼狼狂占霊狩村村村村村', 'G11'],
  ['狼狼Ｃ占霊狩村村村村村村', 'C12'],
  ['狼狼狂占霊狩狐村村村村村', '12B'],
  ['狼狼狼狂占霊狩村村村村村村', 'G13'],
  ['狼狼狼狂占霊狩村村村村村村村', 'G14'],
  ['狼狼狼狂占霊狩村村村村村村村村', 'G15'],
  ['狼狼狼狂占霊狩村村村村村村村村村', 'G16'],
  ['狼狼狼狂占霊狩狐共共村村村村村村', '汝'],
  ['狼狼狼Ｃ占霊狩村村村村村村村村村', 'C16'],
  ['狼狼狼狂占霊狩狐共共村村村村村村村', '17A']
])
