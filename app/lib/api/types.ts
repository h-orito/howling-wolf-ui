// API型定義
// TODO: APIサーバーが利用可能になったら `pnpm generate:api-types` で schema.ts を生成し、
// import type { components } from './schema' 方式に切り替える

// キャラクター関連型
export interface CharaFace {
  type: string
  image_url: string
}

export interface CharaSize {
  width: number
  height: number
}

export interface CharaName {
  name: string
  short_name: string
}

export interface CharaDefaultMessage {
  join_message: string | null
}

export interface CharaView {
  id: number
  chara_name: CharaName
  charachip_id: number
  default_message: CharaDefaultMessage
  display: CharaSize
  face_list: CharaFace[]
}

export interface Charas {
  list: CharaView[]
}

// キャラチップ関連型
export interface Designer {
  id: number
  name: string
}

export interface CharachipView {
  id: number
  name: string
  designer: Designer
  chara_list: CharaView[]
}

export interface CharachipsView {
  list: CharachipView[]
}

// メッセージ関連型
export interface MessageType {
  code: string
  name: string
}

export interface MessageTimeView {
  datetime: string
  unix_time_milli: number
}

export interface MessageContent {
  type: MessageType
  num: number
  count: number | null
  text: string
  face_code: string | null
}

export interface MessageView {
  from: VillageParticipantView | null
  to: VillageParticipantView | null
  time: MessageTimeView
  content: MessageContent
}

export interface MessagesView {
  list: MessageView[]
  all_record_count: number
  all_page_count: number
  is_exist_pre_page: boolean
  is_exist_next_page: boolean
  current_page_num: number | null
}

// 参加者関連型
export interface VillageParticipantView {
  id: number
  chara: CharaView
  player: PlayerView | null
  dead: DeadView | null
  spectator: boolean
  skill: Skill | null
  skill_request: SkillRequest | null
  win: boolean | null
  coming_outs: ComingOut[]
}

export interface VillageParticipantsView {
  count: number
  member_list: VillageParticipantView[]
}

// スキル関連型
export interface Skill {
  code: string
  name: string
}

export interface SkillRequest {
  first: Skill
  second: Skill
}

export interface SkillsView {
  list: Skill[]
}

export interface ComingOut {
  skill: Skill
}

export interface DeadView {
  code: string
  reason: string
  village_day: VillageDayView
}

// 村関連型
export interface VillageStatus {
  code: string
  name: string
}

export interface VillageDayView {
  id: number
  day: number
  noon_night: string
  start_datetime: string
  end_datetime: string | null
}

export interface VillageDaysView {
  day_list: VillageDayView[]
}

export interface VillageTimeView {
  start_datetime: string
  silent_hours: number | null
}

export interface VillageMessageRestrict {
  type: MessageType
  count: number
  length: number
}

export interface VillageMessageRestricts {
  restrict_list: VillageMessageRestrict[]
}

export interface VillageRules {
  open_vote: boolean
  available_skill_request: boolean
  available_spectate: boolean
  open_skill_in_grave: boolean
  visible_grave_message: boolean
  available_suddenly_death: boolean
  available_commit: boolean
  auto_generated: boolean
  available_dummy_skill: boolean
  for_beginner: boolean
  message_restrict: VillageMessageRestricts
}

export interface VillageOrganizations {
  organization: Record<string, string>
}

export interface VillageCharachip {
  charachip_id: number
  dummy_chara_id: number
}

export interface PersonCapacity {
  min: number
  max: number
}

export interface VillagePassword {
  join_password_required: boolean
}

export interface VillageSettingsView {
  capacity: PersonCapacity
  charachip: VillageCharachip
  organizations: VillageOrganizations
  password: VillagePassword
  rules: VillageRules
  time: VillageTimeView
}

export interface Camp {
  code: string
  name: string
}

export interface Settlement {
  camp: Camp
}

export interface VillageView {
  id: number
  name: string
  creator_player_id: number
  status: VillageStatus
  setting: VillageSettingsView
  participant: VillageParticipantsView
  spectator: VillageParticipantsView
  day: VillageDaysView
  win_camp: Settlement | null
}

export interface SimpleVillageView {
  village_id: number
  village_name: string
  participant_count: number
  status: VillageStatus
}

export interface VillagesView {
  list: SimpleVillageView[]
}

// プレイヤー関連型
export interface PlayerView {
  id: number
  nickname: string
  twitter_user_name: string | null
  other_site_name: string | null
  introduction: string | null
  introduced: boolean
}

// HW固有: blacklist/introduce機能
export interface MyselfPlayerView {
  id: number
  nickname: string
  twitter_user_name: string | null
  other_site_name: string | null
  introduction: string | null
  introduced: boolean
  blacklist_players: PlayerView[]
  introduce_players: PlayerView[]
  introduced_players: PlayerView[]
  participate_progress_villages: SimpleVillageView[]
  participate_finished_villages: SimpleVillageView[]
  create_progress_villages: SimpleVillageView[]
  create_finished_villages: SimpleVillageView[]
}

// 戦績関連型
export interface CampRecord {
  camp: Camp
  win_count: number
  lose_count: number
  draw_count: number
}

export interface SkillRecord {
  skill: Skill
  win_count: number
  lose_count: number
  draw_count: number
  participate_count: number
}

export interface PlayerRecord {
  participate_count: number
  win_count: number
  lose_count: number
}

export interface ParticipateVillageView {
  village: SimpleVillageView
  chara_name: CharaName
  skill_name: string | null
}

export interface PlayerRecordsView {
  player: PlayerView
  whole_record: PlayerRecord
  camp_record_list: CampRecord[]
  skill_record_list: SkillRecord[]
  participate_village_list: ParticipateVillageView[]
}

// 参加状況関連型
export interface VillageParticipateSituation {
  participating: boolean
  available_participate: boolean
  available_spectate: boolean
  chara_list: CharaView[]
  skill_list: Skill[]
  available_leave: boolean
}

export interface VillageSkillRequestSituation {
  available_skill_request: boolean
  skill_list: Skill[]
}

export interface VillageCommitSituation {
  available_commit: boolean
  committing: boolean
}

export interface VillageComingOutSituation {
  available_coming_out: boolean
  current_coming_outs: ComingOut[]
  skill_list: Skill[]
}

export interface VillageSayRestrictSituation {
  restricted: boolean
  max_count: number
  remaining_count: number
  max_length: number
}

export interface VillageSayMessageTypeSituation {
  message_type: MessageType
  restrict: VillageSayRestrictSituation
  target_list: VillageParticipantView[]
}

export interface VillageSaySituation {
  available_say: boolean
  selectable_message_type_list: VillageSayMessageTypeSituation[]
  default_message_type: MessageType | null
  selectable_face_type_list: CharaFace[]
}

export interface VillageAbilitySituation {
  type: Skill
  target_list: VillageParticipantView[]
  usable: boolean
}

export interface VillageAbilitySituations {
  list: VillageAbilitySituation[]
}

export interface VillageVoteSituation {
  available_vote: boolean
  target_list: VillageParticipantView[]
}

// HW固有: admin situation
export interface VillageAdminSituation {
  admin: boolean
  available_kick: boolean
  participant_list: VillageParticipantView[]
}

export interface SituationAsParticipantView {
  participate: VillageParticipateSituation
  skill_request: VillageSkillRequestSituation
  commit: VillageCommitSituation
  coming_out: VillageComingOutSituation
  say: VillageSaySituation
  ability: VillageAbilitySituations
  vote: VillageVoteSituation
  admin: VillageAdminSituation
}

// 最新情報関連型
export interface VillageLatestView {
  village_status_code: string
  village_participant_count: number
  village_spectator_count: number
  day_change_datetime: string
  latest_day_message_datetime_list: MessageTimeView[]
}

export interface VillageLatestForm {
  village_id: number
}

// アンカーメッセージ
export interface VillageAnchorMessageView {
  message: MessageView | null
}

// リクエストボディ型
export interface VillageSayBody {
  message: string
  message_type: string
  face_type: string
}

export interface VillageParticipateBody {
  chara_id: number
  first_request_skill: string
  second_request_skill: string
  join_message: string
  join_password?: string
  spectator?: boolean
}

export interface VillageComingOutBody {
  skill_code: string
}

export interface VillageSkillRequestBody {
  first_request_skill: string
  second_request_skill: string
}

// HW固有: 自動生成村
export interface AutoGeneratedVillageRegisterBody {
  organization: string
  start_datetime: string
  silent_hours: number | null
  available_dummy_skill: boolean
  for_beginner: boolean
}

// デバッグ用
export interface DebugVillageView {
  participant_list: DebugVillageParticipantView[]
}

export interface DebugVillageParticipantView {
  id: number
  chara_name: string
  skill_name: string
}

// バージョン
export interface VersionView {
  client_version: string
}
