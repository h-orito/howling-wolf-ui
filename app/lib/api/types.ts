// API型定義のラッパー - 自動生成されたschema.tsを使用
// `pnpm generate:api-types` で schema.ts を再生成可能
import type { components } from './schema'

// キャラクター関連型
export type CharaFace = components['schemas']['CharaFace']
export type CharaSize = components['schemas']['CharaSize']
export type CharaName = components['schemas']['CharaName']
export type CharaNameView = components['schemas']['CharaNameView']
export type CharaDefaultMessage = components['schemas']['CharaDefaultMessage']
export type CharaView = components['schemas']['CharaView']
export type Chara = components['schemas']['Chara']

// キャラチップ関連型
export type Designer = components['schemas']['Designer']
export type CharachipView = components['schemas']['CharachipView']
export type CharachipsView = components['schemas']['CharachipsView']

// メッセージ関連型
export type MessageType = components['schemas']['MessageType']
export type MessageTimeView = components['schemas']['MessageTimeView']
export type MessageContent = components['schemas']['MessageContent']
export type MessageView = components['schemas']['MessageView']
export type MessagesView = components['schemas']['MessagesView']

// 参加者関連型
export type VillageParticipantView =
  components['schemas']['VillageParticipantView']
export type VillageParticipantsView =
  components['schemas']['VillageParticipantsView']

// スキル関連型
export type Skill = components['schemas']['Skill']
export type SkillRequest = components['schemas']['SkillRequest']
export type SkillsView = components['schemas']['SkillsView']
export type ComingOut = components['schemas']['ComingOut']
export type ComingOuts = components['schemas']['ComingOuts']
export type DeadView = components['schemas']['DeadView']
export type AbilityType = components['schemas']['AbilityType']

// /skill/list API レスポンス用（Skill自体に詳細情報が含まれている）
export type SkillDetailView = components['schemas']['Skill']
export type SkillDetailListView = components['schemas']['SkillsView']

// 村関連型
export type VillageStatus = components['schemas']['VillageStatus']
export type VillageDayView = components['schemas']['VillageDayView']
export type VillageDaysView = components['schemas']['VillageDaysView']
export type VillageTimeView = components['schemas']['VillageTimeView']
export type VillageMessageRestrict =
  components['schemas']['VillageMessageRestrict']
export type VillageMessageRestricts =
  components['schemas']['VillageMessageRestricts']
export type VillageRules = components['schemas']['VillageRules']
export type VillageOrganizations = components['schemas']['VillageOrganizations']
export type VillageCharachip = components['schemas']['VillageCharachip']
export type PersonCapacity = components['schemas']['PersonCapacity']
export type VillageSettingsView = components['schemas']['VillageSettingsView']
export type Camp = components['schemas']['Camp']
export type VillageView = components['schemas']['VillageView']
export type SimpleVillageView = components['schemas']['SimpleVillageView']
export type VillagesView = components['schemas']['VillagesView']

// HW固有: 予約村
export type ReservedVillageView = components['schemas']['ReservedVillageView']
export type ReservedVillagesView = components['schemas']['ReservedVillagesView']

// プレイヤー関連型
export type PlayerView = components['schemas']['PlayerView']
export type MyselfPlayerView = components['schemas']['MyselfPlayerView']

// 戦績関連型
export type CampRecord = components['schemas']['CampRecord']
export type SkillRecord = components['schemas']['SkillRecord']
export type PlayerRecord = components['schemas']['Record']
export type ParticipateVillageView =
  components['schemas']['ParticipateVillageView']
export type PlayerRecordsView = components['schemas']['PlayerRecordsView']

// 参加状況関連型
export type VillageParticipateSituation =
  components['schemas']['VillageParticipateSituationView']
export type VillageSkillRequestSituation =
  components['schemas']['VillageSkillRequestSituation']
export type VillageCommitSituation =
  components['schemas']['VillageCommitSituation']
export type VillageComingOutSituation =
  components['schemas']['VillageComingOutSituation']
export type VillageSayRestrictSituation =
  components['schemas']['VillageSayRestrictSituation']
export type VillageSayMessageTypeSituation =
  components['schemas']['VillageSayMessageTypeSituationView']
export type VillageSaySituation =
  components['schemas']['VillageSaySituationView']
export type VillageAbilitySituation =
  components['schemas']['VillageAbilitySituationView']
export type VillageAbilitySituations =
  components['schemas']['VillageAbilitySituationsView']
export type VillageVoteSituation =
  components['schemas']['VillageVoteSituationView']
export type VillageAdminSituation =
  components['schemas']['VillageAdminSituation']
export type SituationAsParticipantView =
  components['schemas']['SituationAsParticipantView']

// 最新情報関連型
export type VillageLatestView = components['schemas']['VillageLatestView']

// アンカーメッセージ
export type VillageAnchorMessageView =
  components['schemas']['VillageAnchorMessageView']

// リクエストボディ型
export type VillageSayBody = components['schemas']['VillageSayBody']
export type VillageParticipateBody =
  components['schemas']['VillageParticipateBody']
export type VillageComingOutBody = components['schemas']['VillageComingOutBody']
export type VillageChangeSkillBody =
  components['schemas']['VillageChangeSkillBody']

// HW固有: 自動生成村
export type AutoGeneratedVillageRegisterBody =
  components['schemas']['AutoGeneratedVillageRegisterBody']

// デバッグ用
export type DebugVillageView = components['schemas']['DebugVillageView']

// バージョン
export type Version = components['schemas']['Version']
