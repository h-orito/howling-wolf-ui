<template>
  <div class="relative mx-auto max-w-160">
    <!-- エラー表示 -->
    <div
      v-if="error"
      class="mx-2 my-4 rounded border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600"
      :class="{ 'border-red-700 bg-red-900/20 text-red-400': isDarkTheme }"
    >
      発言の取得に失敗しました
    </div>

    <!-- メッセージコンテンツ（loading中も表示を維持） -->
    <template v-else>
      <!-- ローディングオーバーレイ -->
      <div
        v-if="loading"
        class="absolute inset-0 z-10 flex items-center justify-center"
        :class="isDarkTheme ? 'bg-gray-900/60' : 'bg-white/60'"
      >
        <div
          class="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"
        />
      </div>

      <!-- ページネーション（上部） -->
      <MessagePagination v-if="showPagination" />

      <!-- 発言リスト -->
      <div v-if="messageList.length > 0">
        <MessageCard
          v-for="message in messageList"
          :key="message.time.unix_time_milli"
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

      <!-- 状況メッセージ -->
      <VillageSituationMessage />

      <!-- ページネーション（下部） -->
      <MessagePagination v-if="showPagination" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from '~/composables/village/useMessage'
import { useUserSettings } from '~/composables/village/useUserSettings'
import { useVillage } from '~/composables/village/useVillage'
import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'
import MessageCard from './MessageCard.vue'
import MessagePagination from './MessagePagination.vue'
import VillageSituationMessage from './VillageSituationMessage.vue'

const { messages, loading, error } = useMessage()
const { paging, messageDisplay, theme } = useUserSettings()
const { village } = useVillage()

const isDarkTheme = computed(() => theme.value.isDark)

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
