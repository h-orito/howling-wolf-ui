<template>
  <div v-if="situation" class="mt-2">
    <!-- 参加フォーム -->
    <ActionParticipate
      v-if="
        situation.participate.available_participate ||
        situation.participate.available_spectate
      "
    />

    <!-- 発言フォーム -->
    <ActionSay v-if="canSay" />

    <!-- 投票 -->
    <ActionVote v-if="situation.vote.available_vote" />

    <!-- 能力行使 -->
    <ActionAbility v-if="situation.ability.list.length > 0" />

    <!-- コミット -->
    <ActionCommit v-if="situation.commit.available_commit" />

    <!-- 退出 -->
    <ActionLeave v-if="situation.participate.available_leave" />

    <!-- 役職希望 -->
    <ActionSkillRequest
      v-if="situation.skill_request.available_skill_request"
    />

    <!-- カミングアウト -->
    <ActionComingOut v-if="situation.coming_out.available_coming_out" />

    <!-- 管理者操作 -->
    <ActionAdmin v-if="situation.admin?.admin" />
  </div>
</template>

<script setup lang="ts">
import { useSituation } from '~/composables/village/useSituation'

// 遅延ローディング
const ActionParticipate = defineAsyncComponent(
  () => import('./ActionParticipate.vue')
)
const ActionSay = defineAsyncComponent(() => import('./ActionSay.vue'))
const ActionVote = defineAsyncComponent(() => import('./ActionVote.vue'))
const ActionAbility = defineAsyncComponent(() => import('./ActionAbility.vue'))
const ActionCommit = defineAsyncComponent(() => import('./ActionCommit.vue'))
const ActionLeave = defineAsyncComponent(() => import('./ActionLeave.vue'))
const ActionSkillRequest = defineAsyncComponent(
  () => import('./ActionSkillRequest.vue')
)
const ActionComingOut = defineAsyncComponent(
  () => import('./ActionComingOut.vue')
)
const ActionAdmin = defineAsyncComponent(() => import('./ActionAdmin.vue'))

const { situation } = useSituation()

const canSay = computed(() => {
  if (!situation.value?.say) return false
  return situation.value.say.available_say
})
</script>
