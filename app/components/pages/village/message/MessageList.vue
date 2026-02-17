<template>
  <div class="relative mx-auto max-w-160">
    <!-- ローディング -->
    <div v-if="loading" class="py-4 text-center text-xs text-gray-500">
      発言を読み込み中...
    </div>

    <!-- ページネーション（上部） -->
    <MessagePagination v-if="showPagination" />

    <!-- 発言リスト -->
    <div v-if="messageList.length > 0">
      <MessageCard
        v-for="message in messageList"
        :key="message.content.num"
        :message="message"
        :is-progress="isProgress"
        :is-img-large="messageDisplay.isImgLarge"
        :is-disp-date="messageDisplay.isDispDate"
        :is-large-text="messageDisplay.isCharLarge"
      />
    </div>
    <div v-else-if="!loading" class="py-8 text-center text-xs text-gray-400">
      発言はまだありません
    </div>

    <!-- ページネーション（下部） -->
    <MessagePagination v-if="showPagination" />
  </div>
</template>

<script setup lang="ts">
import { useMessage } from '~/composables/village/useMessage'
import { useUserSettings } from '~/composables/village/useUserSettings'
import { useVillage } from '~/composables/village/useVillage'
import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'
import MessageCard from './MessageCard.vue'
import MessagePagination from './MessagePagination.vue'

const { messages, loading } = useMessage()
const { paging, messageDisplay } = useUserSettings()
const { village } = useVillage()

const messageList = computed(() => {
  return messages.value?.list ?? []
})

const showPagination = computed(() => {
  if (!paging.value.isPaging) return false
  return (messages.value?.all_page_count ?? 0) > 1
})

const isProgress = computed(() => {
  if (!village.value) return false
  const statusCode = village.value.status.code
  return (
    statusCode === VILLAGE_STATUS.PROLOGUE ||
    statusCode === VILLAGE_STATUS.IN_PROGRESS
  )
})
</script>
