<template>
  <ActionPanel title="デバッグメニュー" panel-key="debug">
    <!-- エラーメッセージ -->
    <div
      v-if="error"
      class="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <!-- 参加させる -->
    <div class="mb-4">
      <p class="mb-2 text-sm font-bold text-gray-700">参加させる</p>
      <div class="flex gap-2">
        <FormSelect
          v-model="participateCharaNum"
          :options="participateMemberNumOptions"
          :disabled="!isPrologue"
          size="sm"
          class="flex-1"
        />
        <UiButton
          :disabled="!isPrologue || submitting"
          :loading="submitting"
          color="primary"
          size="sm"
          @click="handleParticipate"
        >
          参加させる
        </UiButton>
      </div>
    </div>

    <!-- ダミーログイン -->
    <div class="mb-4">
      <p class="mb-2 text-sm font-bold text-gray-700">ダミーログイン</p>
      <div class="flex gap-2">
        <FormSelect
          v-model="playerId"
          :options="playerList"
          size="sm"
          class="flex-1"
        />
        <UiButton
          :disabled="submitting"
          :loading="submitting"
          color="primary"
          size="sm"
          @click="handleDummyLogin"
        >
          でログインする
        </UiButton>
      </div>
    </div>

    <!-- 突然死なしにする -->
    <div class="mb-4">
      <p class="mb-2 text-sm font-bold text-gray-700">突然死なしにする</p>
      <div class="flex justify-end">
        <UiButton
          :disabled="submitting"
          :loading="submitting"
          color="primary"
          size="sm"
          @click="handleSetNoSuddenlyDeath"
        >
          突然死なしにする
        </UiButton>
      </div>
    </div>

    <!-- 日付を進める -->
    <div class="mb-4">
      <p class="mb-2 text-sm font-bold text-gray-700">日付を進める</p>
      <div class="flex justify-end">
        <UiButton
          :disabled="submitting"
          :loading="submitting"
          color="primary"
          size="sm"
          @click="handleChangeDay"
        >
          日付を進める
        </UiButton>
      </div>
    </div>

    <!-- 100回発言する -->
    <div>
      <p class="mb-2 text-sm font-bold text-gray-700">100回発言する</p>
      <div class="flex justify-end">
        <UiButton
          :disabled="submitting"
          :loading="submitting"
          color="primary"
          size="sm"
          @click="handleMultipleSay"
        >
          100回発言する
        </UiButton>
      </div>
    </div>
  </ActionPanel>
</template>

<script setup lang="ts">
import ActionPanel from '../ActionPanel.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import UiButton from '~/components/ui/button/index.vue'
import { useDebug } from '~/composables/village/action/useDebug'
import { useVillage } from '~/composables/village/useVillage'
import { useVillageRefresh } from '~/composables/village/useVillageRefresh'
import { useActionReset } from '~/composables/village/action/useActionReset'
import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'
import type { DebugVillageView, VillageParticipantView } from '~/lib/api/types'

interface PlayerOption {
  label: string
  value: number
}

const emit = defineEmits<{
  complete: []
}>()

// Composables
const { village } = useVillage()
const { refresh } = useVillageRefresh()
const { onReset } = useActionReset()
const {
  submitting,
  error,
  fetchDebugVillage,
  debugParticipate,
  dummyLogin,
  setNoSuddenlyDeath,
  changeDay,
  multipleSay,
  clearError
} = useDebug()

// デバッグ用村情報
const debugVillage = ref<DebugVillageView | null>(null)

// フォーム状態
const participateCharaNum = ref<number>(1)
const playerId = ref<number>(1)

// プロローグかどうか
const isPrologue = computed(() => {
  return village.value?.status.code === VILLAGE_STATUS.PROLOGUE
})

// 参加可能人数リスト
const participateMemberNumList = computed(() => {
  if (!debugVillage.value) return []
  const min = debugVillage.value.setting.capacity.min - 1
  const max = debugVillage.value.setting.capacity.max - 1
  const list: number[] = []
  for (let i = min; i <= max; i++) {
    list.push(i)
  }
  return list
})

// FormSelect用のオプション
const participateMemberNumOptions = computed(() => {
  return participateMemberNumList.value.map((num) => ({
    label: `${num}人`,
    value: num
  }))
})

// プレイヤーリスト（ダミーログイン用）
const playerList = computed((): PlayerOption[] => {
  if (!debugVillage.value) return []
  const list: PlayerOption[] = []
  for (let i = 1; i <= 18; i++) {
    const participant = debugVillage.value.participant.member_list.find(
      (p) => p.player?.id === i
    )
    if (participant) {
      list.push({
        label: dummyLoginCharaName(participant),
        value: i
      })
      continue
    }
    const spectator = debugVillage.value.spectator.member_list.find(
      (p) => p.player?.id === i
    )
    if (spectator) {
      list.push({
        label: `（見学）${dummyLoginCharaName(spectator)}`,
        value: i
      })
      continue
    }
    list.push({
      label: `未参加: player_id: ${i}`,
      value: i
    })
  }
  return list
})

// キャラ名と、開始後は役職名
const dummyLoginCharaName = (participant: VillageParticipantView): string => {
  const name = participant.chara.chara_name.name
  if (!participant.skill) {
    return name
  } else {
    return `${name}: ${participant.skill.name}`
  }
}

// 初期データ読み込み
const loadDebugVillage = async () => {
  debugVillage.value = await fetchDebugVillage()
  const firstNum = participateMemberNumList.value[0]
  if (firstNum !== undefined) {
    participateCharaNum.value = firstNum
  }
  const firstPlayer = playerList.value[0]
  if (firstPlayer !== undefined) {
    playerId.value = firstPlayer.value
  }
}

// マウント時にデバッグ情報を読み込み
onMounted(() => {
  loadDebugVillage()
})

// 参加させる
const handleParticipate = async () => {
  const success = await debugParticipate(participateCharaNum.value)
  if (success) {
    await refresh()
    await loadDebugVillage()
    emit('complete')
  }
}

// ダミーログイン
const handleDummyLogin = async () => {
  const success = await dummyLogin(playerId.value)
  if (success) {
    await refresh()
    emit('complete')
  }
}

// 突然死なしにする
const handleSetNoSuddenlyDeath = async () => {
  const success = await setNoSuddenlyDeath()
  if (success) {
    await refresh()
    emit('complete')
  }
}

// 日付を進める
const handleChangeDay = async () => {
  const success = await changeDay()
  if (success) {
    await refresh()
    await loadDebugVillage()
    emit('complete')
  }
}

// 100回発言する
const handleMultipleSay = async () => {
  const success = await multipleSay()
  if (success) {
    await refresh()
    emit('complete')
  }
}

// リセット処理を登録
onReset(() => {
  clearError()
})
</script>
