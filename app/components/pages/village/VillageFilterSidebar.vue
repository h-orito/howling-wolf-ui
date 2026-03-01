<template>
  <div
    class="dark flex h-dvh w-[280px] flex-col overflow-hidden bg-[#363636] text-white"
  >
    <!-- ヘッダー -->
    <div class="shrink-0 border-b border-gray-600 p-2.5">
      <h2 class="text-base font-bold">発言抽出</h2>
    </div>

    <!-- コンテンツ -->
    <div class="flex-1 overflow-y-auto p-2.5">
      <FilterContent
        v-if="village"
        v-model:selected-message-type-groups="selectedMessageTypeGroups"
        v-model:selected-participant-ids="selectedParticipantIds"
        v-model:selected-to-participant-ids="selectedToParticipantIds"
        v-model:keyword="keyword"
        :participant-columns="1"
      />
    </div>

    <!-- フッター -->
    <div
      class="flex shrink-0 justify-end gap-2 border-t border-gray-600 p-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]"
    >
      <UiButton
        color="secondary"
        variant="solid"
        size="sm"
        @click="handleReset"
      >
        リセット
      </UiButton>
      <UiButton
        color="primary"
        size="sm"
        :disabled="!canFilter"
        @click="handleFilter"
      >
        抽出する
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ALL_MESSAGE_TYPE_GROUPS,
  type MessageTypeGroup
} from '~/lib/api/message-constants'
import { useVillageMessageFilter } from '~/composables/village/useVillageMessageFilter'
import { useVillage } from '~/composables/village/useVillage'
import { useMessage } from '~/composables/village/useMessage'
import UiButton from '~/components/ui/button/index.vue'
import FilterContent from '~/components/pages/village/filter/FilterContent.vue'

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

// 初期化 - コンポーネントマウント時とストア変更時にフィルタ状態を同期
const initializeFilter = () => {
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

// 初期化
onMounted(() => {
  initializeFilter()
})

// allParticipantIdsが変更された場合（村情報の読み込み完了時）に再初期化
watch(allParticipantIds, () => {
  initializeFilter()
})

// ストアのフィルタ状態が外部から変更された場合（個人抽出など）に同期
watch(
  [
    storeMessageTypeGroups,
    storeParticipantIds,
    storeToParticipantIds,
    storeKeyword
  ],
  () => {
    initializeFilter()
  }
)

// Methods
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
}

const handleReset = () => {
  // フィルタをリセット
  resetFilter()

  // ローカル状態も初期化
  initializeFilter()

  // メッセージを再読み込み
  loadMessages()
}
</script>
