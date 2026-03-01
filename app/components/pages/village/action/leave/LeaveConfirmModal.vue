<template>
  <Modal v-model="isOpen" title="退村確認">
    <!-- 確認メッセージ -->
    <p class="text-sm text-gray-700 dark:text-gray-300">本当に退村しますか？</p>

    <template #footer>
      <UiButton color="secondary" variant="outline" @click="close">
        キャンセル
      </UiButton>
      <UiButton
        color="error"
        :disabled="submitting"
        :loading="submitting"
        @click="handleLeave"
      >
        退村する
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
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  leave: []
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

// 退村処理
const handleLeave = () => {
  emit('leave')
}
</script>
