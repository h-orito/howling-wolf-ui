<template>
  <Modal v-model="isOpen" title="カミングアウト確認">
    <!-- 確認メッセージ -->
    <p class="text-sm text-gray-700 dark:text-gray-300">
      {{
        isCancel
          ? '本当にカミングアウトを取り消しますか？'
          : '本当にカミングアウトしますか？'
      }}
    </p>

    <template #footer>
      <UiButton color="secondary" variant="outline" @click="close">
        キャンセル
      </UiButton>
      <UiButton
        :disabled="submitting"
        :loading="submitting"
        @click="handleConfirm"
      >
        {{ isCancel ? 'カミングアウトを取り消す' : 'カミングアウトする' }}
      </UiButton>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/ui/modal/Modal.vue'
import UiButton from '~/components/ui/button/index.vue'

interface Props {
  modelValue: boolean
  submitting: boolean
  /** COを取り消す場合はtrue */
  isCancel: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

// モーダル開閉状態
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// モーダルを閉じる
const close = () => {
  isOpen.value = false
}

// 確認処理
const handleConfirm = () => {
  emit('confirm')
}
</script>
