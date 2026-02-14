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
  switch (typeCode) {
    case 'PUBLIC_SYSTEM':
      return 'text-[#0a0a0a] border-gray-300'
    case 'PRIVATE_SYSTEM':
      return 'bg-[#eee] text-[#0a0a0a] border-[#ccc]'
    case 'PRIVATE_SEER':
      return 'bg-[#efe] text-[#0a0a0a] border-[#0f0]'
    case 'PRIVATE_PSYCHIC':
      return 'bg-[#eef] text-[#0a0a0a] border-[#00f]'
    case 'PRIVATE_WEREWOLF':
      return 'bg-[#fee] text-[#0a0a0a] border-[#f00]'
    case 'PRIVATE_FANATIC':
      return 'bg-[#fee] text-[#0a0a0a] border-[#f00]'
    case 'PRIVATE_MASON':
      return 'bg-[#fec] text-[#0a0a0a] border-[#fa0]'
    case 'PRIVATE_FOX':
      return 'bg-[#ffc] text-[#0a0a0a] border-[#ff0]'
    case 'PRIVATE_SYMPATHIZER':
      return 'bg-[#fec] text-[#0a0a0a] border-[#fa0]'
    case 'CREATOR_SAY':
      return 'bg-[#fef] text-[#0a0a0a] border-[#c0f]'
    default:
      return 'text-[#0a0a0a] border-gray-300'
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
