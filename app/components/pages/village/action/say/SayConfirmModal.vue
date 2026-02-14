<template>
  <Modal
    :model-value="modelValue"
    title="発言確認"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="previewMessage" class="space-y-4">
      <!-- 発言プレビュー -->
      <p class="mb-2 text-xs">この内容で発言しますか？</p>
      <MessageCard
        :message="previewMessage"
        :is-img-large="false"
        :is-large-text="false"
        :can-reply="false"
        :can-secret="false"
      />

      <!-- 誤爆防止: 発言種別の確認選択（エピローグ以外で表示） -->
      <div v-if="!skipConfirmation">
        <p class="mb-1 text-xs font-bold">誤爆防止</p>
        <p class="mb-2 text-xs">発言しようとしている種別を選択してください</p>
        <FormRadioGroup
          v-model="confirmMessageType"
          :options="messageTypeOptions"
        />
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UiButton
          color="secondary"
          variant="outline"
          @click="$emit('update:modelValue', false)"
        >
          キャンセル
        </UiButton>
        <UiButton
          color="primary"
          :loading="submitting"
          :disabled="!canConfirm"
          @click="$emit('confirm')"
        >
          発言する
        </UiButton>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import type { MessageView } from '~/lib/api/types'
import Modal from '~/components/ui/modal/Modal.vue'
import UiButton from '~/components/ui/button/index.vue'
import FormRadioGroup from '~/components/ui/form/FormRadioGroup.vue'
import MessageCard from '../../message/MessageCard.vue'

interface Props {
  modelValue: boolean
  previewMessage: MessageView | null
  submitting: boolean
  selectedMessageType: string
  messageTypeOptions: { value: string; label: string }[]
  /** 誤爆防止確認をスキップするか（エピローグ時にtrue） */
  skipConfirmation?: boolean
}

const props = defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

// 確認用の発言種別選択
const confirmMessageType = ref('')

// 選択した種別と確認用種別が一致しているかチェック
// skipConfirmationがtrueの場合は常に発言可能
const canConfirm = computed(() => {
  if (props.skipConfirmation) {
    return true
  }
  return confirmMessageType.value === props.selectedMessageType
})

// モーダルが開いた時に確認用選択をリセット
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      confirmMessageType.value = '' // リセットして再選択を強制
    }
  }
)
</script>
