<template>
  <div class="participants-message rounded border border-gray-300 p-2 sm:p-3">
    <div class="mb-2 font-bold sm:mb-3" :class="textSizeClass">参加者一覧</div>
    <!-- 参加者一覧の表示 -->
    <div class="space-y-1 sm:space-y-2">
      <div
        v-for="participant in sortedParticipants"
        :key="participant.id"
        class="flex items-start gap-2 border-t border-gray-200 pt-1 first:border-t-0 first:pt-0 sm:gap-3 sm:pt-2"
      >
        <!-- キャラクター画像 -->
        <div class="shrink-0">
          <CharaImage
            v-if="participant.chara"
            :chara="participant.chara"
            :face-type="'NORMAL'"
            :is-small="true"
          />
        </div>

        <!-- 名前・プレイヤー情報エリア -->
        <div class="flex-1" :class="textSizeClass">
          <!-- キャラクター名とプレイヤー情報 -->
          <div class="mb-1 flex flex-wrap items-center gap-1">
            <span class="font-bold">{{ getCharaName(participant) }}</span>
            <span class="text-gray-600">
              {{ participant.player?.nickname }}
            </span>
            <a
              v-if="participant.player?.twitter_user_name"
              :href="`https://twitter.com/${participant.player.twitter_user_name}`"
              target="_blank"
              class="text-blue-600 hover:underline"
            >
              @{{ participant.player.twitter_user_name }}
            </a>
            <span
              class="ml-auto text-xs"
              :class="getCharaStatusClass(participant)"
            >
              {{ getCharaStatus(participant) }}
            </span>
          </div>

          <!-- 役職・勝敗情報 -->
          <div class="flex flex-wrap items-center gap-1">
            <span class="font-medium">{{ getSkillName(participant) }}</span>
            <span class="text-gray-600">{{
              getSkillRequest(participant)
            }}</span>
            <span
              v-if="!participant.spectator"
              class="ml-auto text-xs"
              :class="getWinStatusClass(participant)"
            >
              {{ getWinStatus(participant) }}
            </span>
          </div>
        </div>

        <!-- 戦績ボタン -->
        <div v-if="participant.player" class="shrink-0">
          <UiButton
            :to="{
              path: '/player-record',
              query: { id: participant.player.id }
            }"
            target="_blank"
            size="xs"
            variant="outline"
            icon="i-heroicons-chart-bar"
            :aria-label="`${participant.player.nickname}の戦績を見る`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { MessageView, VillageParticipantView } from '~/lib/api/types'
import UiButton from '~/components/ui/button/index.vue'
import CharaImage from '../CharaImage.vue'
import { useVillage } from '~/composables/village/useVillage'

interface Props {
  message: DeepReadonly<MessageView> | MessageView
  isLargeText?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLargeText: false
})

// 文字サイズクラス
const textSizeClass = computed(() =>
  props.isLargeText ? 'text-sm leading-5.5' : 'text-xs leading-4.5'
)

const { allParticipants } = useVillage()

// 参加者の並び順
const sortedParticipants = computed(() => {
  const participantList = [...allParticipants.value]
  const members = participantList.filter((p) => !p.spectator)
  const spectators = participantList.filter((p) => p.spectator)

  // メンバーをソート（死亡者が先、同じ死亡状況なら日付順、同日なら死因順）
  members.sort((vp1, vp2) => compareParticipant(vp1, vp2))

  // メンバー + 見学者の順
  return [...members, ...spectators]
})

// 参加者の比較関数
const compareParticipant = (
  vp1: DeepReadonly<VillageParticipantView> | VillageParticipantView,
  vp2: DeepReadonly<VillageParticipantView> | VillageParticipantView
): number => {
  // 死亡している人が先
  const vp1isDead = !!vp1.dead
  const vp2isDead = !!vp2.dead
  if (vp1isDead && !vp2isDead) return -1
  if (!vp1isDead && vp2isDead) return 1
  // どちらも死亡していなければ等価
  if (!vp1isDead && !vp2isDead) return 0
  // どちらも死亡している場合は日付が早い順
  const vp1DeadDay = vp1.dead!.village_day.day
  const vp2DeadDay = vp2.dead!.village_day.day
  if (vp1DeadDay !== vp2DeadDay) return vp1DeadDay - vp2DeadDay
  // 日付も同じ場合は凸->処刑->他
  const vp1DeadReason = vp1.dead!.reason
  const vp2DeadReason = vp2.dead!.reason
  return deadReasonPriority(vp2DeadReason) - deadReasonPriority(vp1DeadReason)
}

// 死因の優先度
const deadReasonPriority = (reason: string): number => {
  if (reason === '突然') return 2
  if (reason === '処刑') return 1
  if (reason === '後追') return -1
  return 0
}

// 参加者型（読み取り専用も許容）
type ParticipantType =
  | DeepReadonly<VillageParticipantView>
  | VillageParticipantView

// キャラクター名（長い場合は省略）
const getCharaName = (participant: ParticipantType): string => {
  const fullName = participant.chara.chara_name.name
  if (fullName.length < 20) return fullName
  return fullName.substring(0, 20) + '...'
}

// キャラクターの状態（生存/死亡情報）
const getCharaStatus = (participant: ParticipantType): string => {
  if (participant.spectator) return ''
  if (!participant.dead) return '生存'
  const day = participant.dead.village_day.day
  const reason = participant.dead.reason
  return `${day}d${reason}`
}

// キャラクター状態のスタイルクラス
const getCharaStatusClass = (participant: ParticipantType): string => {
  if (participant.spectator || !participant.dead) return ''
  const reason = participant.dead.reason
  if (reason === '突然' || reason === '処刑') return 'text-blue-600'
  return 'text-red-500'
}

// 勝敗状態
const getWinStatus = (participant: ParticipantType): string => {
  if (participant.spectator) return ''
  return participant.win ? '勝利' : '敗北'
}

// 勝敗状態のスタイルクラス
const getWinStatusClass = (participant: ParticipantType): string => {
  if (participant.spectator) return ''
  return participant.win ? 'text-green-600' : 'text-red-500'
}

// 役職名
const getSkillName = (participant: ParticipantType): string => {
  if (participant.spectator) return '見物人'
  return participant.skill?.name || '不明'
}

// 希望役職
const getSkillRequest = (participant: ParticipantType): string => {
  if (participant.spectator) return ''
  if (!participant.skill_request) return ''
  const req1 = participant.skill_request.first?.name || '？'
  const req2 = participant.skill_request.second?.name || '？'
  return `（${req1}/${req2}希望）`
}
</script>
