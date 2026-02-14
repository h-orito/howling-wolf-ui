<template>
  <ActionPanel title="時短希望" panel-key="commit">
    <!-- 現在の状態 -->
    <p class="text-sm text-gray-700 dark:text-gray-300">
      {{
        isCommitting
          ? 'あなたは時短希望しています。'
          : 'あなたは時短希望していません。'
      }}
    </p>

    <!-- エラーメッセージ -->
    <div
      v-if="commitError"
      class="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ commitError }}
    </div>

    <!-- コミットボタン -->
    <div class="flex justify-end">
      <UiButton
        :disabled="submitting"
        :loading="submitting"
        @click="handleCommit"
      >
        {{ isCommitting ? '時短希望を取り消す' : '時短希望する' }}
      </UiButton>
    </div>
  </ActionPanel>
</template>

<script setup lang="ts">
import ActionPanel from './ActionPanel.vue'
import UiButton from '~/components/ui/button/index.vue'
import { useCommit } from '~/composables/village/action/useCommit'
import { useActionReset } from '~/composables/village/action/useActionReset'
import { useSituation } from '~/composables/village/useSituation'

const emit = defineEmits<{
  complete: [willCommit: boolean]
}>()

// Composables
const {
  submitting,
  error: commitError,
  commitRequest,
  clearError
} = useCommit()
const { onReset } = useActionReset()
const { situation } = useSituation()

// コミット状況を取得
const commitSituation = computed(() => situation.value?.commit ?? null)

// 現在時短希望中かどうか
const isCommitting = computed(() => commitSituation.value?.committing ?? false)

// コミット実行
const handleCommit = async () => {
  clearError()
  // 現在の状態と逆の値を送信（希望中なら取り消し、していなければ希望）
  const willCommit = !isCommitting.value
  const success = await commitRequest(willCommit)
  if (success) {
    emit('complete', willCommit)
  }
}

// リセット処理を登録
onReset(() => {
  clearError()
})
</script>
