<template>
  <div
    :id="`mc-${message.time.unix_time_milli}`"
    class="my-1 px-1 py-1.5 text-left text-xs"
  >
    <SayMessage
      v-if="isSay"
      :message="message"
      :is-img-large="isImgLarge"
      :is-large-text="isLargeText"
      :is-progress="isProgress"
      :is-anchor-message="isAnchorMessage"
      :is-disp-date="isDispDate"
      :can-reply="canReply"
      :can-secret="computedCanSecret"
    />
    <SystemMessage
      v-else-if="isSystem"
      :message="message"
      :is-large-text="isLargeText"
    />
    <ParticipantsMessage
      v-else-if="isParticipants"
      :message="message"
      :is-large-text="isLargeText"
    />
  </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { MessageView } from '~/lib/api/types'
import {
  isSayType,
  isSystemType,
  isParticipantsType
} from '~/lib/api/message-constants'
import { useSituation } from '~/composables/village/useSituation'
import SayMessage from './SayMessage.vue'
import SystemMessage from './SystemMessage.vue'
import ParticipantsMessage from './ParticipantsMessage.vue'

interface Props {
  message: DeepReadonly<MessageView> | MessageView
  isImgLarge?: boolean
  isDispDate?: boolean
  isLargeText?: boolean
  isAnchorMessage?: boolean
  isProgress?: boolean
  canReply?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isImgLarge: false,
  isDispDate: false,
  isLargeText: false,
  isAnchorMessage: false,
  isProgress: false,
  canReply: true
})

const { situation } = useSituation()

const messageTypeCode = computed(() => props.message.content.type.code)

const isSay = computed(() => isSayType(messageTypeCode.value))
const isSystem = computed(() => isSystemType(messageTypeCode.value))
const isParticipants = computed(() => isParticipantsType(messageTypeCode.value))

// 秘話ボタン表示条件:
// - アンカーメッセージの場合は非表示
// - 参加者である場合かつ SECRET_SAY が selectable_message_type_list に含まれる場合
const computedCanSecret = computed(() => {
  if (props.isAnchorMessage) return false
  const myself = situation.value?.participate.myself
  if (!myself) return false
  const selectableTypes =
    situation.value?.say.selectable_message_type_list ?? []
  return selectableTypes.some((t) => t.message_type.code === 'SECRET_SAY')
})
</script>
