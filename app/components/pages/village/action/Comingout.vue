<template>
  <ActionPanel title="カミングアウト" panel-key="comingout">
    <!-- 現在のCO状態 -->
    <p class="text-sm text-gray-700 dark:text-gray-300">
      現在のカミングアウト: {{ currentComingoutText }}
    </p>

    <!-- エラーメッセージ -->
    <div
      v-if="comingoutError"
      class="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ comingoutError }}
    </div>

    <!-- CO対象選択（2つまで） -->
    <p class="text-sm font-bold text-gray-700 dark:text-gray-300">
      CO対象（2つまで）
    </p>

    <!-- 1つ目のCO -->
    <div class="flex items-center gap-2">
      <FormSelect
        v-model="co1"
        :options="selectableSkillOptions1"
        :disabled="!canComingout"
        placeholder="COを取り消す"
        size="sm"
        class="flex-1"
      />
      <UiButton
        size="sm"
        color="secondary"
        variant="outline"
        :disabled="!canComingout || !co1"
        @click="cancelFirst"
      >
        消す
      </UiButton>
    </div>

    <!-- 2つ目のCO -->
    <div class="flex items-center gap-2">
      <FormSelect
        v-model="co2"
        :options="selectableSkillOptions2"
        :disabled="!canComingout || !co1"
        placeholder="選択してください"
        size="sm"
        class="flex-1"
      />
      <UiButton
        size="sm"
        color="secondary"
        variant="outline"
        :disabled="!canComingout || !co2"
        @click="cancelSecond"
      >
        消す
      </UiButton>
    </div>

    <!-- COボタン -->
    <div class="flex justify-end">
      <UiButton
        :disabled="!canSubmit"
        :loading="submitting"
        @click="handleComingout"
      >
        カミングアウトする
      </UiButton>
    </div>
  </ActionPanel>

  <!-- 確認モーダル -->
  <ComingoutConfirmModal
    v-model="showConfirmModal"
    :submitting="submitting"
    :is-cancel="isCancel"
    @confirm="executeComingout"
  />
</template>

<script setup lang="ts">
import ActionPanel from './ActionPanel.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import UiButton from '~/components/ui/button/index.vue'
import { useComingout } from '~/composables/village/action/useComingout'
import { useActionReset } from '~/composables/village/action/useActionReset'
import { useSituation } from '~/composables/village/useSituation'

// 遅延ローディング: 確認モーダルはボタンクリック時まで不要
const ComingoutConfirmModal = defineAsyncComponent(
  () => import('./comingout/ComingoutConfirmModal.vue')
)

const emit = defineEmits<{
  complete: [isCancel: boolean]
}>()

// Composables
const {
  submitting,
  error: comingoutError,
  comingout,
  clearError
} = useComingout()
const { onReset } = useActionReset()
const { situation } = useSituation()

// カミングアウト状況を取得
const comingoutSituation = computed(() => situation.value?.coming_out ?? null)

// カミングアウト可能かどうか
const canComingout = computed(
  () => comingoutSituation.value?.available_coming_out ?? false
)

// 現在のカミングアウトのテキスト
const currentComingoutText = computed(() => {
  const coList = comingoutSituation.value?.current_coming_outs.list ?? []
  if (coList.length === 0) return 'なし'
  return coList.map((co) => co.skill.name).join('と')
})

// 選択可能な役職リスト
const selectableSkills = computed(
  () => comingoutSituation.value?.selectable_skill_list ?? []
)

// セレクトボックス用オプション（1つ目）
const selectableSkillOptions1 = computed(() =>
  selectableSkills.value.map((skill) => ({
    label: skill.name,
    value: skill.code
  }))
)

// セレクトボックス用オプション（2つ目：1つ目と同じものを除外）
const selectableSkillOptions2 = computed(() => {
  const skills = selectableSkills.value
  if (!skills) return []
  return skills
    .filter((skill) => skill.code !== co1.value)
    .map((skill) => ({
      label: skill.name,
      value: skill.code
    }))
})

// 選択状態（初期値は現在のCO）
const co1 = ref<string | null>(null)
const co2 = ref<string | null>(null)

// 初期化
const initializeSelection = () => {
  const coList = comingoutSituation.value?.current_coming_outs.list ?? []
  co1.value = coList[0]?.skill.code ?? null
  co2.value = coList[1]?.skill.code ?? null
}

// 初回読み込み時に初期化
watch(
  () => comingoutSituation.value?.current_coming_outs.list,
  () => {
    initializeSelection()
  },
  { immediate: true }
)

// 1つ目のCOを消す
const cancelFirst = () => {
  co1.value = co2.value
  co2.value = null
}

// 2つ目のCOを消す
const cancelSecond = () => {
  co2.value = null
}

// 現在の選択と同じかどうか判定
const isSameAsCurrentComingout = computed(() => {
  const currentList = comingoutSituation.value?.current_coming_outs.list ?? []
  const selectedCodes: string[] = []
  if (co1.value) selectedCodes.push(co1.value)
  if (co2.value && co2.value !== co1.value) selectedCodes.push(co2.value)

  if (selectedCodes.length !== currentList.length) return false
  return !selectedCodes.some(
    (code) => !currentList.some((current) => current.skill.code === code)
  )
})

// 送信可能かどうか
const canSubmit = computed(() => {
  if (submitting.value) return false
  if (!canComingout.value) return false
  if (isSameAsCurrentComingout.value) return false
  return true
})

// 取り消しかどうか
const isCancel = computed(() => !co1.value)

// 確認モーダル表示
const showConfirmModal = ref(false)

// カミングアウトボタン押下
const handleComingout = () => {
  clearError()
  showConfirmModal.value = true
}

// カミングアウト実行
const executeComingout = async () => {
  const skillCodes: string[] = []
  if (co1.value) {
    skillCodes.push(co1.value)
    if (co2.value && co2.value !== co1.value) {
      skillCodes.push(co2.value)
    }
  }

  const success = await comingout(skillCodes)
  if (success) {
    showConfirmModal.value = false
    emit('complete', isCancel.value)
  }
}

// リセット処理を登録
onReset(() => {
  clearError()
  initializeSelection()
})
</script>
