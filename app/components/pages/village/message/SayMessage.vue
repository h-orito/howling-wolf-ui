<template>
  <div class="say-message">
    <!-- 1段目: アンカー、名前、発言時間 -->
    <div class="mb-1 flex flex-wrap items-start gap-x-2 text-xs">
      <!-- 左側: アンカー、名前、CO、プレイヤー名 -->
      <div class="flex min-w-0 items-center gap-1">
        <!-- アンカー -->
        <span v-if="shouldDispAnchor && anchorString">
          <a
            href="javascript:void(0);"
            class="cursor-pointer text-blue-600 hover:underline"
            @click="handleCopyAnchor"
          >
            {{ anchorString }} </a
          >.
        </span>

        <!-- キャラクター名 -->
        <span class="font-bold whitespace-nowrap">
          {{ characterName }}
          <span v-if="targetCharacterName">→ {{ targetCharacterName }}</span>
        </span>

        <!-- カミングアウト -->
        <span
          v-if="comingOutString"
          class="rounded border border-gray-300 px-1 py-0.5 text-xs"
        >
          {{ comingOutString }}
        </span>

        <!-- プレイヤー名 -->
        <span v-if="twitterUserName" class="text-xs">
          [<a
            :href="`https://twitter.com/${twitterUserName}`"
            target="_blank"
            class="text-blue-600 hover:underline"
          >
            {{ twitterUserName }} </a
          >]
        </span>
        <span v-else-if="nickname" class="text-xs"> [{{ nickname }}] </span>
      </div>

      <!-- 右側: 発言回数と時間 -->
      <div class="ml-auto text-right text-xs text-gray-400">
        <span v-if="isAnchorMessage"> {{ message.time.day }}d </span>
        <span v-if="message.content.count && maxCount">
          ({{ message.content.count }}/{{ maxCount }})
        </span>
        <span>{{ displayTime }}</span>
      </div>
    </div>

    <!-- 2段目: キャラクター画像と発言内容 -->
    <div class="flex gap-2">
      <!-- 左側: キャラクター画像 -->
      <div class="shrink-0">
        <CharaImage
          v-if="message.from?.chara"
          :chara="message.from.chara"
          :face-type="message.content.face_code || 'NORMAL'"
          :is-large="isImgLarge"
        />
      </div>

      <!-- 右側: 発言内容とアクションボタン -->
      <div class="flex-1">
        <!-- 発言内容（装飾・アンカー含む） -->
        <div
          class="message-text rounded border p-2 text-left whitespace-pre-wrap"
          :class="[
            messageClass,
            isLargeText ? 'text-sm leading-5.5' : 'text-xs leading-4.5'
          ]"
          :style="{ minHeight: `${imageHeight}px`, wordBreak: 'break-word' }"
          @click="handleMessageClick"
          v-html="formattedMessageText"
        />

        <!-- 3段目: 返信と秘話ボタン -->
        <div class="mt-1 flex justify-end gap-3">
          <a
            v-if="canReply && shouldDispAnchor"
            href="javascript:void(0);"
            class="cursor-pointer text-xs text-blue-600 hover:underline"
            @click="handleReply"
          >
            >>返信
          </a>
          <a
            v-if="canSecret"
            href="javascript:void(0);"
            class="cursor-pointer text-xs text-blue-600 hover:underline"
            @click="handleSecret"
          >
            >>秘話
          </a>
        </div>
      </div>
    </div>

    <!-- アンカーメッセージ表示 -->
    <div
      v-if="anchorMessages.length > 0"
      :class="['mt-2 space-y-2', isAnchorMessage ? '' : 'ml-6']"
    >
      <MessageCard
        v-for="mes in anchorMessages"
        :key="mes.time.unix_time_milli"
        :message="mes"
        :is-anchor-message="true"
        :is-progress="isProgress"
        :is-disp-date="true"
        :is-img-large="isImgLarge"
        :is-large-text="isLargeText"
        :can-reply="false"
        :can-secret="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { MessageView } from '~/lib/api/types'
import CharaImage from '../CharaImage.vue'
import {
  createAnchorString,
  createAnchorCopyString,
  convertToMessageText,
  isDispAnchor,
  getComingOutString,
  getAnchorType,
  getAnchorNum
} from './message-converter'
import { useSayInput } from '~/composables/village/useSayInput'
import { useUserSettings } from '~/composables/village/useUserSettings'
import { useAnchorMessage } from '~/composables/village/useAnchorMessage'
import { useVillageStore } from '~/stores/village'

// 循環参照対策: defineAsyncComponentでMessageCardをインポート
const MessageCard = defineAsyncComponent(() => import('./MessageCard.vue'))

interface Props {
  message: DeepReadonly<MessageView> | MessageView
  isImgLarge?: boolean
  isLargeText?: boolean
  isProgress?: boolean
  isAnchorMessage?: boolean
  isDispDate?: boolean
  canReply?: boolean
  canSecret?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isImgLarge: false,
  isLargeText: false,
  isProgress: false,
  isAnchorMessage: false,
  isDispDate: false,
  canReply: true,
  canSecret: true
})

// Composables
const sayInput = useSayInput()
const toast = useToast()
const { loadAnchorMessage } = useAnchorMessage()
const villageStore = useVillageStore()
const { operation } = useUserSettings()

// 村設定から取得した発言種別ごとの最大回数
const maxCount = computed(() => {
  const typeCode = props.message.content.type.code
  return villageStore.restrictCountMap?.get(typeCode) ?? null
})

// アンカーメッセージの状態管理
const anchorMessages = ref<MessageView[]>([])

// 画像の高さ（メッセージ欄の最小高さ用）
const imageHeight = computed(() => {
  const baseHeight = props.message.from?.chara?.display?.height || 80
  return props.isImgLarge ? Math.floor(baseHeight * 1.5) : baseHeight
})

// アンカー表示判定
const shouldDispAnchor = computed(() =>
  isDispAnchor(props.isProgress, props.message.content.type.code)
)

// アンカー文字列
const anchorString = computed(() => {
  if (!props.message.content.num) return ''
  return createAnchorString(
    props.message.content.type.code,
    props.message.content.num
  )
})

// アンカーコピー文字列
const anchorCopyString = computed(() => {
  const shortName = props.message.from?.chara?.chara_name?.short_name || ''
  return createAnchorCopyString(
    props.message.content.type.code,
    anchorString.value,
    shortName
  )
})

// キャラクター名
const characterName = computed(() => {
  const shortName = props.message.from?.chara?.chara_name?.short_name || ''
  const name = props.message.from?.chara?.chara_name?.name || ''

  if (shortName && name) {
    return `[${shortName}] ${name}`
  }
  return name
})

// 秘話の宛先キャラクター名
const targetCharacterName = computed(() => {
  const shortName = props.message.to?.chara?.chara_name?.short_name || ''
  const name = props.message.to?.chara?.chara_name?.name || ''

  if (!name) return null
  if (shortName) {
    return `[${shortName}] ${name}`
  }
  return name
})

// カミングアウト文字列
const comingOutString = computed(() => getComingOutString(props.message))

// プレイヤー情報
const twitterUserName = computed(
  () => props.message.from?.player?.twitter_user_name
)
const nickname = computed(() => props.message.from?.player?.nickname)

// 表示時刻
const displayTime = computed(() => {
  const datetime = props.message.time.datetime
  if (!datetime) return ''

  // datetimeが既に適切なフォーマット（YYYY/MM/DD HH:mm:ss）の場合
  if (datetime.includes('/')) {
    if (props.isDispDate) {
      return datetime
    }
    // 時刻部分のみ表示
    const timePart = datetime.split(' ')[1]
    return timePart || ''
  }

  // ISO形式の場合の処理（後方互換）
  if (props.isDispDate) {
    return datetime
  }
  return datetime.substring(11, 19)
})

// フォーマット済みメッセージテキスト
const formattedMessageText = computed(() =>
  convertToMessageText(props.message.content.text)
)

// メッセージクラス（背景色と文字色用）
const messageClass = computed(() => {
  const typeCode = props.message.content.type.code
  switch (typeCode) {
    case 'NORMAL_SAY':
      return 'bg-white text-[#0a0a0a] border-gray-300'
    case 'WEREWOLF_SAY':
      return 'bg-[#f2cece] text-[#0a0a0a] border-gray-300'
    case 'MASON_SAY':
      return 'bg-[#cef2ce] text-[#0a0a0a] border-gray-300'
    case 'MONOLOGUE_SAY':
      return 'bg-[#dddddd] text-[#0a0a0a] border-gray-300'
    case 'GRAVE_SAY':
      return 'bg-[#ceedf2] text-[#0a0a0a] border-gray-300'
    case 'SPECTATE_SAY':
      return 'bg-[#f2f2ce] text-[#0a0a0a] border-gray-300'
    case 'SECRET_SAY':
      return 'bg-[#cecef2] text-[#0a0a0a] border-gray-300'
    case 'CREATOR_SAY':
      return 'bg-[#fef] text-[#0a0a0a] border-gray-300'
    default:
      return 'bg-white text-[#0a0a0a] border-gray-300'
  }
})

// アンカー文字列をコピーまたは発言欄に挿入
const handleCopyAnchor = () => {
  if (operation.value.isPasteAnchor) {
    sayInput?.insertAnchor(anchorCopyString.value)
    toast.add({ message: '発言欄に挿入しました' })
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(anchorCopyString.value)
    toast.add({ message: `${anchorCopyString.value} をコピーしました` })
  }
}

// 返信ボタンのハンドラー
const handleReply = () => {
  sayInput?.insertAnchor(anchorCopyString.value)
  sayInput?.setReplyTarget(props.message as MessageView)
}

// 秘話ボタンのハンドラー
const handleSecret = () => {
  if (props.message.from?.id) {
    sayInput?.switchToSecret(props.message.from.id)
    sayInput?.setReplyTarget(props.message as MessageView)
  }
}

// イベントデリゲーションでアンカークリックを検出
const handleMessageClick = async (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.classList.contains('anchor')) return

  event.preventDefault()
  const clickedAnchorString = target.textContent || ''
  await clickAnchorMessage(clickedAnchorString)
}

// アンカーメッセージのトグル処理
const clickAnchorMessage = async (
  clickedAnchorString: string
): Promise<void> => {
  const typeCode = getAnchorType(clickedAnchorString)
  if (!typeCode) return

  const number = getAnchorNum(clickedAnchorString)

  // 既に表示中ならトグルで非表示に
  const existingIndex = anchorMessages.value.findIndex(
    (mes) => mes.content.type.code === typeCode && mes.content.num === number
  )
  if (existingIndex >= 0) {
    anchorMessages.value.splice(existingIndex, 1)
    return
  }

  // APIからメッセージ取得して追加
  const message = await loadAnchorMessage(typeCode, number)
  if (message) {
    anchorMessages.value.unshift(message)
  }
}
</script>

<style scoped>
/* ネタバレ用スタイル */
:deep(.netabare) {
  background-color: #333;
  color: #333;
  cursor: pointer;
}

:deep(.netabare:hover) {
  background-color: #444;
}

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
