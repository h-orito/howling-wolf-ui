<template>
  <div v-if="isCurrentVillageDayLatest" class="text-xs leading-[1.125rem]">
    <!-- 村の状況メッセージ -->
    <Alert :class="charSizeClass" class="mb-1.5" type="default">
      <span :class="charSizeClass" v-html="villageSituationMessageHtml" />
    </Alert>

    <!-- 突然死警告メッセージ -->
    <Alert
      v-if="isDispSuddenlyDeathMessage"
      :class="charSizeClass"
      class="mb-1.5"
      type="warning"
    >
      <span :class="charSizeClass" v-html="suddenlyDeathMessageHtml" />
    </Alert>

    <!-- 沈黙時間メッセージ -->
    <Alert
      v-if="isSilentTime"
      :class="charSizeClass"
      class="mb-1.5"
      type="warning"
    >
      <span :class="charSizeClass" v-html="silentTimeMessageHtml" />
    </Alert>
  </div>
</template>

<script setup lang="ts">
import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'
import { useVillage } from '~/composables/village/useVillage'
import { useMessage } from '~/composables/village/useMessage'
import { useUserSettings } from '~/composables/village/useUserSettings'
import Alert from '~/components/ui/feedback/Alert.vue'

// Composables
const { village, latestDay, isCurrentVillageDayLatest } = useVillage()
const { messages } = useMessage()
const { messageDisplay } = useUserSettings()

// 村の状況メッセージ
const villageSituationMessage = computed(() => {
  if (!village.value) return ''

  const status = village.value.status.code
  switch (status) {
    case VILLAGE_STATUS.PROLOGUE:
      return prologueMessage.value
    case VILLAGE_STATUS.IN_PROGRESS:
      return progressMessage.value
    case VILLAGE_STATUS.EPILOGUE:
      return epilogueMessage.value
    case VILLAGE_STATUS.COMPLETED:
      return completeMessage.value
    case VILLAGE_STATUS.CANCEL:
      return cancelMessage.value
    default:
      return ''
  }
})

// HTML変換（改行 -> <br />）
const villageSituationMessageHtml = computed(() => {
  return villageSituationMessage.value.replace(/\n/g, '<br />')
})

// プロローグメッセージ
const prologueMessage = computed(() => {
  if (!village.value) return ''
  const minPersonCount = village.value.setting.capacity.min
  const currentParticipantCount = village.value.participant.count
  const startDatetime = village.value.setting.time.start_datetime

  return currentParticipantCount < minPersonCount
    ? `${startDatetime}時点で${minPersonCount}人集まれば村が開始されます。`
    : `${startDatetime}に村が開始されます。`
})

// 進行中メッセージ
const progressMessage = computed(() => {
  if (!village.value) return ''

  const dayList = village.value.day.day_list
  if (dayList.length === 0) return ''

  const latestDayData = dayList.at(-1)
  if (!latestDayData) return ''

  const isFirstDay = latestDayData.day === 1

  if (isFirstDay) {
    return `${daychangeDatetime.value}に日付が更新されます。\n能力者は対象を選択してセットしてください。${commitMessage.value}`
  } else {
    return `${daychangeDatetime.value}に日付が更新されます。\n処刑したい人に投票してください。\n能力者は対象を選択してセットしてください。${commitMessage.value}`
  }
})

// 時短メッセージ
const commitMessage = computed(() => {
  if (!village.value) return ''
  const isAvailableCommit = village.value.setting.rules.available_commit
  return isAvailableCommit
    ? '\n全員が時短希望すると、すぐに日付が更新されます。'
    : ''
})

// エピローグメッセージ
const epilogueMessage = computed(() => {
  if (!village.value?.win_camp) return ''
  const winCamp = village.value.win_camp.name
  return `${winCamp}の勝利です。\n全てのログとユーザー名を公開します。\n今回の感想などを話し合いましょう。\n\n${daychangeDatetime.value}に村が終了します。`
})

// 終了メッセージ
const completeMessage = computed(() => {
  return 'この村は終了しました。'
})

// 廃村メッセージ
const cancelMessage = computed(() => {
  return 'この村は廃村になりました。'
})

// 日付更新日時
const daychangeDatetime = computed(() => {
  if (!village.value) return ''
  const dayList = village.value.day.day_list
  const latestDayData = dayList.at(-1)
  if (!latestDayData) return ''
  return latestDayData.day_change_datetime
})

// 突然死警告メッセージ表示判定
const isDispSuddenlyDeathMessage = computed(() => {
  return (
    isProgress.value &&
    isAvailableSuddenlyDeath.value &&
    existsNoSayMember.value &&
    !isSilentTime.value
  )
})

// 進行中かどうか
const isProgress = computed(() => {
  if (!village.value) return false
  return village.value.status.code === VILLAGE_STATUS.IN_PROGRESS
})

// 突然死有効か
const isAvailableSuddenlyDeath = computed(() => {
  if (!village.value) return false
  return village.value.setting.rules.available_suddenly_death
})

// 沈黙時間かどうか
const isSilentTime = computed(() => {
  if (!village.value) return false
  return village.value.silent_time
})

// 突然死警告メッセージ
const suddenlyDeathMessage = computed(() => {
  const noSayMemberNames = noSayMembers.value.map(
    (member) => member.chara.chara_name.name
  )
  return `日付更新までに通常発言がない人は突然死します。\n現在まで発言していない人\n${noSayMemberNames.join('\n')}`
})

const suddenlyDeathMessageHtml = computed(() => {
  return suddenlyDeathMessage.value.replace(/\n/g, '<br />')
})

// 未発言メンバーが存在するか
const existsNoSayMember = computed(() => {
  return noSayMembers.value.length > 0
})

// 未発言メンバー
const noSayMembers = computed(() => {
  if (!village.value || !messages.value) return []

  const dummyCharaId = village.value.setting.charachip.dummy_chara_id
  return village.value.participant.member_list
    .filter((member) => !member.dead)
    .filter((member) => member.chara.id !== dummyCharaId)
    .filter((member) => getSayCount(member.id) === 0)
})

// 発言回数取得
const getSayCount = (participantId: number): number => {
  if (!messages.value) return 0
  return messages.value.today_message_count_map[participantId] ?? 0
}

// 沈黙時間メッセージ
const silentTimeMessage = computed(() => {
  return `通常発言ができない時間です。\n${sayableTime.value}から発言できます。`
})

const silentTimeMessageHtml = computed(() => {
  return silentTimeMessage.value.replace(/\n/g, '<br />')
})

// 発言可能時刻
const sayableTime = computed(() => {
  if (!latestDay.value?.sayable_start_time) return ''
  const time = latestDay.value.sayable_start_time
  // hour/minuteを使って表示
  const hour = String(time.hour ?? 0).padStart(2, '0')
  const minute = String(time.minute ?? 0).padStart(2, '0')
  return `${hour}:${minute}`
})

// 文字サイズクラス
const charSizeClass = computed(() => {
  return isCharSizeLarge.value
    ? 'text-sm leading-[1.375rem]'
    : 'text-xs leading-[1.125rem]'
})

// 文字サイズ大設定
const isCharSizeLarge = computed(() => {
  return messageDisplay.value.isCharLarge
})
</script>
