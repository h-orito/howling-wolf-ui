<template>
  <ActionPanel title="退村" panel-key="leave" :default-open="false">
    <!-- エラーメッセージ -->
    <div
      v-if="leaveError"
      class="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ leaveError }}
    </div>

    <!-- 退村ボタン -->
    <div class="flex justify-end">
      <UiButton color="error" @click="openConfirmModal"> 退村する </UiButton>
    </div>

    <!-- 確認モーダル -->
    <LeaveConfirmModal
      v-model="isConfirmModalOpen"
      :submitting="submitting"
      @leave="handleLeave"
    />
  </ActionPanel>
</template>

<script setup lang="ts">
import ActionPanel from './ActionPanel.vue'
import UiButton from '~/components/ui/button/index.vue'
import { useLeave } from '~/composables/village/action/useLeave'

// 遅延ローディング: 確認モーダルはボタンクリック時まで不要
const LeaveConfirmModal = defineAsyncComponent(
  () => import('./leave/LeaveConfirmModal.vue')
)

const emit = defineEmits<{
  complete: []
}>()

// Composables
const { submitting, error: leaveError, leave } = useLeave()

// UI状態
const isConfirmModalOpen = ref(false)

// 確認モーダルを開く
const openConfirmModal = () => {
  isConfirmModalOpen.value = true
}

// 退村実行
const handleLeave = async () => {
  const success = await leave()
  if (success) {
    isConfirmModalOpen.value = false
    emit('complete')
  }
}
</script>
