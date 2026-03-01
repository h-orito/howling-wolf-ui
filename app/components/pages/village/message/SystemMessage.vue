<template>
  <div class="system-message">
    <!-- 発言内容をborderで囲む、左揃え -->
    <div
      class="message-text rounded border text-left whitespace-pre-wrap"
      :class="[
        messageClass,
        isLargeText ? 'text-sm leading-5.5' : 'text-xs leading-4.5'
      ]"
      :style="{ padding: '10px', wordBreak: 'break-word' }"
      v-html="formattedMessageText"
    />
  </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { MessageView } from '~/lib/api/types'
import { convertToMessageText } from './message-converter'

interface Props {
  message: DeepReadonly<MessageView> | MessageView
  isLargeText?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLargeText: false
})

// フォーマット済みメッセージテキスト
const formattedMessageText = computed(() =>
  convertToMessageText(props.message.content.text)
)

// メッセージクラス（背景色とボーダー色用）
const messageClass = computed(() => {
  const typeCode = props.message.content.type.code
  const base = 'text-[#0a0a0a] dark:text-white whitespace-pre-wrap '
  switch (typeCode) {
    case 'PUBLIC_SYSTEM':
      return base + 'border-gray-300 dark:border-white'
    case 'PRIVATE_SYSTEM':
      return 'bg-[#eee] dark:bg-[#404040] border-[#ccc] dark:border-[#ccc]'
    case 'PRIVATE_SEER':
      return 'bg-[#efe] dark:bg-[#334033] border-[#0f0] dark:border-[#0f0]'
    case 'PRIVATE_PSYCHIC':
      return 'bg-[#eef] dark:bg-[#333340] border-[#00f] dark:border-[#00f]'
    case 'PRIVATE_WEREWOLF':
      return 'bg-[#fee] dark:bg-[#403333] border-[#f00] dark:border-[#f00]'
    case 'PRIVATE_FANATIC':
      return 'bg-[#fee] dark:bg-[#403333] border-[#f00] dark:border-[#f00]'
    case 'PRIVATE_MASON':
      return 'bg-[#fec] dark:bg-[#404033] border-[#fa0] dark:border-[#fa0]'
    case 'PRIVATE_FOX':
      return 'bg-[#ffc] dark:bg-[#404033] border-[#ff0] dark:border-[#ff0]'
    case 'PRIVATE_SYMPATHIZER':
      return 'bg-[#fec] dark:bg-[#404033] border-[#fa0] dark:border-[#fa0]'
    case 'CREATOR_SAY':
      return 'bg-[#fef] dark:bg-[#403340] border-[#c0f] dark:border-[#c0f]'
    default:
      return 'border-gray-300 dark:border-white'
  }
})
</script>

<style scoped>
/* 発言内容のフォント */
.message-text {
  font-family: sans-serif;
}

/* 発言内容のテキストスタイル */
:deep(p) {
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
