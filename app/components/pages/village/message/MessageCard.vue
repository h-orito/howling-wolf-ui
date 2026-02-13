<template>
  <div
    class="my-1 border-b border-gray-200 px-1 py-1.5 text-left text-xs"
    :class="messageClass"
  >
    <!-- 通常発言 -->
    <div v-if="isSay" class="flex">
      <div class="mr-2 shrink-0">
        <CharaImage
          v-if="chara"
          :chara="chara"
          :face-type="message.content.face_code ?? 'NORMAL'"
          :is-small="!isImgLarge"
        />
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex items-baseline gap-1">
          <span class="font-bold" :class="isCharLarge ? 'text-sm' : 'text-xs'">
            {{ message.from?.chara?.chara_name?.name ?? '' }}
          </span>
          <span v-if="isDispDate" class="text-gray-400">
            {{ messageTime }}
          </span>
        </div>
        <div class="mt-0.5 break-all whitespace-pre-wrap">
          {{ message.content.text }}
        </div>
        <div class="mt-0.5 text-right text-gray-400">
          {{ message.content.type.name }}
          <span v-if="message.content.num">
            {{ message.content.num }}
          </span>
        </div>
      </div>
    </div>

    <!-- システムメッセージ / 参加者一覧 -->
    <div v-else class="text-center text-gray-500">
      <div class="whitespace-pre-wrap">{{ message.content.text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { MessageView, CharaView } from '~/lib/api/types'
import { isSayType } from '~/lib/api/message-constants'
import CharaImage from '~/components/pages/village/CharaImage.vue'
import { useVillage } from '~/composables/village/useVillage'
import { useUserSettings } from '~/composables/village/useUserSettings'

const props = defineProps<{
  message: DeepReadonly<MessageView> | MessageView
}>()

const { charachips } = useVillage()
const { messageDisplay } = useUserSettings()

const isDispDate = computed(() => messageDisplay.value.isDispDate)
const isCharLarge = computed(() => messageDisplay.value.isCharLarge)
const isImgLarge = computed(() => messageDisplay.value.isImgLarge)

const messageTypeCode = computed(() => props.message.content.type.code)

const isSay = computed(() => isSayType(messageTypeCode.value))

const messageClass = computed(() => {
  const code = messageTypeCode.value
  switch (code) {
    case 'WEREWOLF_SAY':
      return 'bg-red-50'
    case 'GRAVE_SAY':
      return 'bg-blue-50'
    case 'MONOLOGUE_SAY':
      return 'bg-gray-50'
    case 'MASON_SAY':
      return 'bg-green-50'
    case 'SPECTATE_SAY':
      return 'bg-purple-50'
    case 'SECRET_SAY':
      return 'bg-yellow-50'
    case 'CREATOR_SAY':
      return 'bg-orange-50'
    default:
      return ''
  }
})

const chara = computed((): DeepReadonly<CharaView> | CharaView | null => {
  if (!props.message.from?.chara?.id) return null
  if (!charachips.value || charachips.value.length === 0) return null
  return (
    charachips.value[0]?.chara_list.find(
      (c) => c.id === props.message.from?.chara?.id
    ) ?? null
  )
})

const messageTime = computed(() => {
  const time = props.message.time
  if (!time) return ''
  return time.datetime ?? ''
})
</script>
