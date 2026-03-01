<template>
  <Modal v-model="isModalOpen" title="発言抽出">
    <!-- コンテンツ -->
    <FilterContent
      v-if="village"
      v-model:selected-message-type-groups="selectedMessageTypeGroups"
      v-model:selected-participant-ids="selectedParticipantIds"
      v-model:selected-to-participant-ids="selectedToParticipantIds"
      v-model:keyword="keyword"
    />

    <!-- フッター -->
    <template #footer>
      <div class="flex justify-end gap-2">
        <UiButton color="secondary" variant="outline" @click="handleReset">
          リセット
        </UiButton>
        <UiButton color="secondary" variant="outline" @click="handleClose">
          キャンセル
        </UiButton>
        <UiButton color="primary" :disabled="!canFilter" @click="handleFilter">
          抽出する
        </UiButton>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import {
  ALL_MESSAGE_TYPE_GROUPS,
  type MessageTypeGroup
} from '~/lib/api/message-constants'
import { useVillageMessageFilter } from '~/composables/village/useVillageMessageFilter'
import { useVillage } from '~/composables/village/useVillage'
import { useMessage } from '~/composables/village/useMessage'
import Modal from '~/components/ui/modal/Modal.vue'
import UiButton from '~/components/ui/button/index.vue'
import FilterContent from '~/components/pages/village/filter/FilterContent.vue'

// Props
interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'close'): void
}

const emit = defineEmits<Emits>()

// Composables
const {
  applyFilter,
  resetFilter,
  messageTypeGroups: storeMessageTypeGroups,
  participantIds: storeParticipantIds,
  toParticipantIds: storeToParticipantIds,
  keyword: storeKeyword
} = useVillageMessageFilter()
const { village, allParticipantIds } = useVillage()
const { loadMessages } = useMessage()

// State - モーダルの開閉状態
const isModalOpen = computed({
  get: () => props.isOpen,
  set: (value) => {
    if (!value) {
      emit('close')
    }
  }
})

// State - フィルタ条件
const selectedMessageTypeGroups = ref<MessageTypeGroup[]>([
  ...ALL_MESSAGE_TYPE_GROUPS
])
const selectedParticipantIds = ref<number[]>([])
const selectedToParticipantIds = ref<number[]>([])
const keyword = ref<string | null>(null)

// Computed
const canFilter = computed(() => {
  return (
    selectedMessageTypeGroups.value.length > 0 &&
    selectedParticipantIds.value.length > 0
  )
})

// モーダルが開かれたときにフィルタ状態を初期化
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      initializeFilter()
    }
  }
)

// Methods
const initializeFilter = () => {
  // 現在のフィルタ状態をロード
  selectedMessageTypeGroups.value = storeMessageTypeGroups.value
    ? [...storeMessageTypeGroups.value]
    : [...ALL_MESSAGE_TYPE_GROUPS]

  selectedParticipantIds.value = storeParticipantIds.value
    ? [...storeParticipantIds.value]
    : [...allParticipantIds.value]

  selectedToParticipantIds.value = storeToParticipantIds.value
    ? [...storeToParticipantIds.value]
    : [...allParticipantIds.value]

  keyword.value = storeKeyword.value ?? null
}

const handleFilter = () => {
  // 全選択の場合はnullとして扱う
  const messageTypeGroups =
    selectedMessageTypeGroups.value.length === ALL_MESSAGE_TYPE_GROUPS.length
      ? null
      : selectedMessageTypeGroups.value

  const participantIdList =
    selectedParticipantIds.value.length === allParticipantIds.value.length
      ? null
      : selectedParticipantIds.value

  const toParticipantIdList =
    selectedToParticipantIds.value.length === allParticipantIds.value.length
      ? null
      : selectedToParticipantIds.value

  applyFilter(
    messageTypeGroups,
    participantIdList,
    toParticipantIdList,
    keyword.value
  )

  // メッセージを再読み込み
  loadMessages()

  emit('close')
}

const handleReset = () => {
  // フィルタをリセット
  resetFilter()

  // メッセージを再読み込み
  loadMessages()

  emit('close')
}

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
/* モーダルカードの最大高さを調整 */
:deep(.modal-card) {
  max-height: calc(100dvh - 6.5rem);
}
</style>
