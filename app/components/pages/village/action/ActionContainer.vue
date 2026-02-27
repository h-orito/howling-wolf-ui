<template>
  <div
    v-if="existsAction"
    class="action-container mx-auto flex max-w-160 flex-col gap-4 py-4"
  >
    <!-- 発言 -->
    <Say v-if="isDispSay" @complete="handleSayComplete" />

    <!-- 入村 -->
    <Participate
      v-if="isDispParticipate"
      @complete="handleParticipateComplete"
    />

    <!-- 役職希望 -->
    <SkillRequest
      v-if="isDispSkillRequest"
      @complete="handleSkillRequestComplete"
    />

    <!-- 退村 -->
    <Leave v-if="isDispLeave" @complete="handleLeaveComplete" />

    <!-- 能力行使 -->
    <Ability
      v-for="ability in usableAbilities"
      :key="ability.type.code"
      :ability="ability"
      @complete="handleAbilityComplete"
    />

    <!-- 投票 -->
    <Vote v-if="isDispVote" @complete="handleVoteComplete" />

    <!-- CO -->
    <Comingout v-if="isDispComingout" @complete="handleComingoutComplete" />

    <!-- 時短 -->
    <Commit v-if="isDispCommit" @complete="handleCommitComplete" />

    <!-- 管理者メニュー -->
    <Admin v-if="isDispAdminMenu" @complete="handleActionComplete" />

    <!-- デバッグメニュー（ローカル環境のみ） -->
    <Debug v-if="isDispDebugMenu" @complete="handleActionComplete" />
  </div>
</template>

<script setup lang="ts">
import Ability from './Ability.vue'
import Admin from './admin/Admin.vue'
import Debug from './admin/Debug.vue'
import Comingout from './Comingout.vue'
import Commit from './Commit.vue'
import Leave from './Leave.vue'
import Participate from './Participate.vue'
import Say from './Say.vue'
import SkillRequest from './SkillRequest.vue'
import Vote from './Vote.vue'
import { useMessage } from '~/composables/village/useMessage'
import { useSituation } from '~/composables/village/useSituation'
import { useVillageNavigation } from '~/composables/village/useVillageNavigation'
import { useVillageRefresh } from '~/composables/village/useVillageRefresh'
import { showSuccessToast } from '~/utils/toast'

// Composables
const { situation } = useSituation()
const { loadMessages } = useMessage()
const { scrollToBottom } = useVillageNavigation()
const { refresh } = useVillageRefresh()

// 表示判定
const isDispSay = computed(() => situation.value?.say.available_say ?? false)

const isDispParticipate = computed(
  () =>
    (situation.value?.participate.available_participate ||
      situation.value?.participate.available_spectate) ??
    false
)

const isDispSkillRequest = computed(
  () =>
    (situation.value?.participate.participating ?? false) &&
    (situation.value?.skill_request.available_skill_request ?? false)
)

const isDispLeave = computed(
  () => situation.value?.participate.available_leave ?? false
)

const isDispVote = computed(() => situation.value?.vote.available_vote ?? false)

const isDispComingout = computed(
  () => situation.value?.coming_out.available_coming_out ?? false
)

const isDispCommit = computed(
  () => situation.value?.commit.available_commit ?? false
)

const isDispAdminMenu = computed(() => situation.value?.admin.admin ?? false)

// デバッグメニュー表示判定（ローカル環境のみ）
const isDispDebugMenu = computed(() => {
  return process.env.NODE_ENV !== 'production'
})

// 使用可能な能力一覧
const usableAbilities = computed(
  () => situation.value?.ability.list.filter((ab) => ab.usable) ?? []
)

// アクションが存在するかどうか
const existsAction = computed(() => {
  return (
    isDispSay.value ||
    isDispParticipate.value ||
    isDispSkillRequest.value ||
    isDispLeave.value ||
    isDispVote.value ||
    isDispComingout.value ||
    isDispCommit.value ||
    isDispAdminMenu.value ||
    isDispDebugMenu.value ||
    usableAbilities.value.length > 0
  )
})

/**
 * アクション完了時の基本ハンドラ
 * refresh内でtriggerResetが呼ばれるため、ここでは呼び出し不要
 */
const handleActionComplete = async () => {
  await refresh()
}

/**
 * 発言完了時のハンドラ
 * 発言は成功時にもトースト不要（Nuxt2版と同様）
 */
const handleSayComplete = async () => {
  await refresh()
  // refresh内のloadMessagesはawaitされないため、明示的にawaitしてからスクロール
  await loadMessages()
  scrollToBottom()
}

/**
 * 入村完了時のハンドラ
 */
const handleParticipateComplete = async () => {
  await refresh()
  showSuccessToast('入村しました')
}

/**
 * 役職希望変更完了時のハンドラ
 */
const handleSkillRequestComplete = async () => {
  await refresh()
  showSuccessToast('役職希望を変更しました')
}

/**
 * 退村完了時のハンドラ
 */
const handleLeaveComplete = async () => {
  await refresh()
  showSuccessToast('退村しました')
}

/**
 * 能力セット完了時のハンドラ
 */
const handleAbilityComplete = async (abilityName: string) => {
  await refresh()
  showSuccessToast(`${abilityName}セットしました`)
}

/**
 * 投票セット完了時のハンドラ
 */
const handleVoteComplete = async () => {
  await refresh()
  showSuccessToast('投票セットしました')
}

/**
 * カミングアウト完了時のハンドラ
 */
const handleComingoutComplete = async (isCancel: boolean) => {
  await refresh()
  if (isCancel) {
    showSuccessToast('カミングアウトを取り消しました')
  } else {
    showSuccessToast('カミングアウトしました')
  }
}

/**
 * 時短希望完了時のハンドラ
 */
const handleCommitComplete = async (willCommit: boolean) => {
  await refresh()
  if (willCommit) {
    showSuccessToast('時短希望しました')
  } else {
    showSuccessToast('時短希望を取り消しました')
  }
}

// 後続タスクで使用するため、exposeで公開
defineExpose({
  handleActionComplete
})
</script>
