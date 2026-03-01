<template>
  <Modal v-model="isOpen" title="入村確認">
    <!-- 発言プレビュー -->
    <div v-if="confirmMessage" class="mb-4">
      <MessageCard :message="confirmMessage" />
    </div>

    <!-- 確認チェックボックス -->
    <div class="flex flex-col space-y-3">
      <FormCheckbox v-model="confirm1">
        <span>
          <a
            class="cursor-pointer text-(--ui-primary) hover:underline"
            @click.stop.prevent="openTermModal"
          >
            利用規約
          </a>
          および
          <NuxtLink
            to="/rule"
            target="_blank"
            class="text-(--ui-primary) hover:underline"
            @click.stop
          >
            ルール
          </NuxtLink>
          を確認し、禁止事項について理解しました。
        </span>
      </FormCheckbox>

      <FormCheckbox v-model="confirm2">
        他者への礼節を欠いたり、正常な運営を妨げるような行為を行なった場合、管理人の裁量により処罰される可能性があることについて理解しました。
      </FormCheckbox>

      <FormCheckbox v-model="confirm3">
        発言可能時間および突然死の設定を確認し、進行中該当の時間に発言しなければ突然死してしまう可能性があることを理解しました。
      </FormCheckbox>
    </div>

    <template #footer>
      <UiButton color="secondary" variant="outline" @click="close">
        キャンセル
      </UiButton>
      <UiButton
        :disabled="!canParticipate || submitting"
        :loading="submitting"
        @click="handleParticipate"
      >
        入村する
      </UiButton>
    </template>

    <!-- 利用規約モーダル -->
    <TermModal v-model:open="isTermModalOpen" />
  </Modal>
</template>

<script setup lang="ts">
import type { MessageView } from '~/lib/api/types'
import Modal from '~/components/ui/modal/Modal.vue'
import UiButton from '~/components/ui/button/index.vue'
import FormCheckbox from '~/components/ui/form/FormCheckbox.vue'
import MessageCard from '~/components/pages/village/message/MessageCard.vue'
import TermModal from '~/components/layout/TermModal.vue'

interface Props {
  modelValue: boolean
  confirmMessage: MessageView | null
  submitting: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  participate: []
}>()

// モーダル開閉状態
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 確認チェックボックス
const confirm1 = ref(false)
const confirm2 = ref(false)
const confirm3 = ref(false)

// 利用規約モーダル
const isTermModalOpen = ref(false)

// 全てチェック済みかどうか
const canParticipate = computed(
  () => confirm1.value && confirm2.value && confirm3.value
)

// モーダルを閉じる
const close = () => {
  isOpen.value = false
}

// 入村処理
const handleParticipate = () => {
  emit('participate')
}

// 利用規約モーダルを開く
const openTermModal = () => {
  isTermModalOpen.value = true
}

// モーダルが閉じられたときにチェック状態をリセット
watch(isOpen, (newValue) => {
  if (!newValue) {
    confirm1.value = false
    confirm2.value = false
    confirm3.value = false
  }
})
</script>
