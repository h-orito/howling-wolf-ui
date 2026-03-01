<template>
  <ActionPanel title="投票" panel-key="vote">
    <!-- 現在のセット先 -->
    <p class="text-sm text-gray-700 dark:text-gray-300">
      現在のセット先: {{ currentTargetName }}
    </p>

    <!-- エラーメッセージ -->
    <div
      v-if="voteError"
      class="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ voteError }}
    </div>

    <!-- 投票対象選択 -->
    <FormGroup label="対象">
      <FormSelect
        v-model="selectedTargetId"
        :options="targetOptions"
        :disabled="!canVote"
        placeholder="選択してください"
        size="sm"
      />
    </FormGroup>

    <!-- 投票ボタン -->
    <div class="flex justify-end">
      <UiButton
        :disabled="!canSubmit"
        :loading="submitting"
        @click="handleVote"
      >
        投票する
      </UiButton>
    </div>
  </ActionPanel>
</template>

<script setup lang="ts">
import ActionPanel from './ActionPanel.vue'
import FormGroup from '~/components/ui/form/FormGroup.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import UiButton from '~/components/ui/button/index.vue'
import { useVote } from '~/composables/village/action/useVote'
import { useActionReset } from '~/composables/village/action/useActionReset'
import { useSituation } from '~/composables/village/useSituation'

const emit = defineEmits<{
  complete: []
}>()

// Composables
const { submitting, error: voteError, vote, clearError } = useVote()
const { onReset } = useActionReset()
const { situation } = useSituation()

// 投票状況を取得
const voteSituation = computed(() => situation.value?.vote ?? null)

// 投票可能かどうか
const canVote = computed(() => voteSituation.value?.available_vote ?? false)

// 現在のセット先の名前
const currentTargetName = computed(() => {
  if (!voteSituation.value?.target) return 'なし'
  return voteSituation.value.target.chara.chara_name.name
})

// 投票対象リスト（セレクトボックス用）
const targetOptions = computed(() => {
  if (!voteSituation.value?.target_list) return []
  return voteSituation.value.target_list.map((p) => ({
    label: p.chara.chara_name.name,
    value: p.id
  }))
})

// 選択された投票対象ID（初期値は現在のセット先）
const selectedTargetId = ref<number | null>(
  voteSituation.value?.target?.id ?? null
)

// 投票状況が変わったら選択をリセット
watch(
  () => voteSituation.value?.target?.id,
  (newTargetId) => {
    selectedTargetId.value = newTargetId ?? null
  }
)

// 送信可能かどうか
const canSubmit = computed(() => {
  if (submitting.value) return false
  if (!canVote.value) return false
  if (selectedTargetId.value == null) return false
  return true
})

// 投票実行
const handleVote = async () => {
  if (!canSubmit.value || selectedTargetId.value == null) return

  clearError()
  const success = await vote(selectedTargetId.value)
  if (success) {
    emit('complete')
  }
}

// リセット処理を登録
onReset(() => {
  clearError()
  selectedTargetId.value = voteSituation.value?.target?.id ?? null
})
</script>
