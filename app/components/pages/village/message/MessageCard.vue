<template>
  <div class="my-1 border-b border-gray-200 px-1 py-1.5 text-left text-xs">
    <SayMessage
      v-if="isSay"
      :message="message"
      :is-img-large="isImgLarge"
      :is-large-text="isLargeText"
      :is-progress="isProgress"
      :is-anchor-message="isAnchorMessage"
      :is-disp-date="isDispDate"
      :can-reply="canReply"
      :can-secret="canSecret"
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
  canSecret?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isImgLarge: false,
  isDispDate: false,
  isLargeText: false,
  isAnchorMessage: false,
  isProgress: false,
  canReply: true,
  canSecret: true
})

const messageTypeCode = computed(() => props.message.content.type.code)

const isSay = computed(() => isSayType(messageTypeCode.value))
const isSystem = computed(() => isSystemType(messageTypeCode.value))
const isParticipants = computed(() => isParticipantsType(messageTypeCode.value))
</script>
