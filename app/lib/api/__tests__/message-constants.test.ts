import { describe, it, expect } from 'vitest'
import {
  MESSAGE_TYPE,
  MESSAGE_TYPE_GROUP,
  ALL_MESSAGE_TYPE_GROUPS,
  MESSAGE_TYPE_MAP,
  isSayType,
  isSystemType,
  isParticipantsType
} from '../message-constants'

describe('message-constants', () => {
  describe('MESSAGE_TYPE', () => {
    it('全てのメッセージタイプが定義されている', () => {
      expect(Object.keys(MESSAGE_TYPE)).toHaveLength(18)
    })

    it('発言系タイプが含まれる', () => {
      expect(MESSAGE_TYPE.NORMAL_SAY).toBe('NORMAL_SAY')
      expect(MESSAGE_TYPE.WEREWOLF_SAY).toBe('WEREWOLF_SAY')
      expect(MESSAGE_TYPE.GRAVE_SAY).toBe('GRAVE_SAY')
      expect(MESSAGE_TYPE.MONOLOGUE_SAY).toBe('MONOLOGUE_SAY')
      expect(MESSAGE_TYPE.MASON_SAY).toBe('MASON_SAY')
      expect(MESSAGE_TYPE.SPECTATE_SAY).toBe('SPECTATE_SAY')
      expect(MESSAGE_TYPE.SECRET_SAY).toBe('SECRET_SAY')
    })

    it('システム系タイプが含まれる', () => {
      expect(MESSAGE_TYPE.PUBLIC_SYSTEM).toBe('PUBLIC_SYSTEM')
      expect(MESSAGE_TYPE.PRIVATE_SYSTEM).toBe('PRIVATE_SYSTEM')
      expect(MESSAGE_TYPE.PRIVATE_SEER).toBe('PRIVATE_SEER')
      expect(MESSAGE_TYPE.PRIVATE_PSYCHIC).toBe('PRIVATE_PSYCHIC')
    })
  })

  describe('MESSAGE_TYPE_GROUP', () => {
    it('全てのグループが定義されている', () => {
      expect(Object.keys(MESSAGE_TYPE_GROUP)).toHaveLength(9)
    })
  })

  describe('ALL_MESSAGE_TYPE_GROUPS', () => {
    it('全グループが配列に含まれる', () => {
      expect(ALL_MESSAGE_TYPE_GROUPS).toHaveLength(9)
      expect(ALL_MESSAGE_TYPE_GROUPS).toContain(MESSAGE_TYPE_GROUP.SYSTEM)
      expect(ALL_MESSAGE_TYPE_GROUPS).toContain(MESSAGE_TYPE_GROUP.NORMAL_SAY)
      expect(ALL_MESSAGE_TYPE_GROUPS).toContain(MESSAGE_TYPE_GROUP.WEREWOLF_SAY)
    })
  })

  describe('MESSAGE_TYPE_MAP', () => {
    it('全てのメッセージタイプがマッピングされている', () => {
      expect(MESSAGE_TYPE_MAP.size).toBe(18)
    })

    it('発言系タイプは say にマッピングされる', () => {
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.NORMAL_SAY)).toBe('say')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.WEREWOLF_SAY)).toBe('say')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.GRAVE_SAY)).toBe('say')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.MASON_SAY)).toBe('say')
    })

    it('システム系タイプは system にマッピングされる', () => {
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.PUBLIC_SYSTEM)).toBe('system')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.PRIVATE_SYSTEM)).toBe('system')
    })

    it('参加者タイプは participants にマッピングされる', () => {
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.PARTICIPANTS)).toBe(
        'participants'
      )
    })
  })

  describe('isSayType', () => {
    it('発言系タイプの場合 true を返す', () => {
      expect(isSayType('NORMAL_SAY')).toBe(true)
      expect(isSayType('WEREWOLF_SAY')).toBe(true)
      expect(isSayType('GRAVE_SAY')).toBe(true)
      expect(isSayType('MONOLOGUE_SAY')).toBe(true)
      expect(isSayType('MASON_SAY')).toBe(true)
      expect(isSayType('SPECTATE_SAY')).toBe(true)
      expect(isSayType('SECRET_SAY')).toBe(true)
    })

    it('システム系タイプの場合 false を返す', () => {
      expect(isSayType('PUBLIC_SYSTEM')).toBe(false)
      expect(isSayType('PRIVATE_SYSTEM')).toBe(false)
    })

    it('不明なタイプの場合 false を返す', () => {
      expect(isSayType('UNKNOWN')).toBe(false)
    })
  })

  describe('isSystemType', () => {
    it('システム系タイプの場合 true を返す', () => {
      expect(isSystemType('PUBLIC_SYSTEM')).toBe(true)
      expect(isSystemType('PRIVATE_SYSTEM')).toBe(true)
      expect(isSystemType('PRIVATE_SEER')).toBe(true)
      expect(isSystemType('PRIVATE_PSYCHIC')).toBe(true)
      expect(isSystemType('CREATOR_SAY')).toBe(true)
    })

    it('発言系タイプの場合 false を返す', () => {
      expect(isSystemType('NORMAL_SAY')).toBe(false)
    })
  })

  describe('isParticipantsType', () => {
    it('参加者タイプの場合 true を返す', () => {
      expect(isParticipantsType('PARTICIPANTS')).toBe(true)
    })

    it('その他のタイプの場合 false を返す', () => {
      expect(isParticipantsType('NORMAL_SAY')).toBe(false)
      expect(isParticipantsType('PUBLIC_SYSTEM')).toBe(false)
    })
  })
})
