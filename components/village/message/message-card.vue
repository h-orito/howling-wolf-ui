<template>
  <div>
    <div class="card" :class="isDarkTheme ? 'dark-theme' : ''">
      <message-say
        v-if="isSayType"
        :message="sayMessage"
        :is-dark-theme="isDarkTheme"
        :is-disp-date="isDispDate"
        :is-img-large="isImgLarge"
        @click-anchor="clickAnchorMessage($event)"
        @copy-anchor-string="copyAnchorString"
      />
      <message-system
        v-if="isSystemType"
        :message="systemMessage"
        :is-dark-theme="isDarkTheme"
      />
      <message-participant-list
        v-if="message.content.type.code === 'PARTICIPANTS'"
      />
      <!-- アンカーメッセージ -->
      <message-card
        v-for="mes in anchorMessages"
        :key="mes.id"
        :message="mes"
        :is-progress="isProgress"
        :is-anchor-message="true"
        :is-dark-theme="isDarkTheme"
        :is-disp-date="isDispDate"
        :is-img-large="isImgLarge"
      ></message-card>
    </div>
    <div v-if="index == 19 || index == 39">
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      ></script>
      <ins
        class="adsbygoogle"
        style="display:block"
        data-ad-format="fluid"
        data-ad-layout-key="-hm-c+2i-1u-38"
        data-ad-client="ca-pub-0917187897820609"
        data-ad-slot="5122687444"
      ></ins>
      <script>
        ;(adsbygoogle = window.adsbygoogle || []).push({})
      </script>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import messageSay from '~/components/village/message/message-say.vue'
import messageSystem from '~/components/village/message/message-system.vue'
import messageCard from '~/components/village/message/message-card.vue'
// type
import Message from '~/components/type/message'
import VillageAnchorMessage from '~/components/type/village-anchor-message'
import { MESSAGE_TYPE } from '~/components/const/consts'
import {
  convertToSayMessage,
  convertToSystemMessage,
  getAnchorType,
  getAnchorNum,
  SayMessage,
  SystemMessage
} from '~/components/village/message/message-converter'
const messageParticipantList = () =>
  import('~/components/village/message/message-participant-list.vue')

@Component({
  name: 'message-card',
  components: {
    messageSay,
    messageSystem,
    messageCard,
    messageParticipantList
  }
})
export default class MessageCard extends Vue {
  @Prop({ type: Object })
  private message!: Message

  @Prop({ type: Boolean })
  private isProgress!: boolean

  @Prop({ type: Boolean, default: false })
  private isAnchorMessage?: boolean

  @Prop({ type: Number, default: null })
  private index?: number

  @Prop({ type: Boolean })
  private isDarkTheme!: boolean

  @Prop({ type: Boolean })
  private isDispDate!: boolean

  @Prop({ type: Boolean })
  private isImgLarge!: boolean

  private anchorMessages: Message[] = []

  private get maxCount(): number | null {
    if (!this.$store.getters.getRestrictCountMap) return null
    return (
      this.$store.getters.getRestrictCountMap.get(
        this.message.content.type.code
      ) || null
    )
  }

  private get sayMessage(): SayMessage | null {
    if (!this.isSayType) return null
    return convertToSayMessage(
      this.message,
      this.isAnchorMessage || false,
      this.isProgress,
      this.maxCount!,
      this.isDispDate
    )
  }

  private get systemMessage(): SystemMessage | null {
    if (!this.isSystemType) return null
    return convertToSystemMessage(this.message)
  }

  private get isSayType(): boolean {
    const type = messageTypeMap.get(this.message.content.type.code)
    return type === 'say'
  }

  private get isSystemType(): boolean {
    const type = messageTypeMap.get(this.message.content.type.code)
    return type === 'system'
  }

  private copyAnchorString(): void {
    const text: string = this.sayMessage!.anchor_copy_string
    // @ts-ignore
    this.$copyText(text)
    this.$buefy.toast.open({
      message: `クリップボードにコピーしました: ${text}`,
      type: 'is-info',
      position: 'is-top'
    })
  }

  private async clickAnchorMessage(anchorString: string): Promise<void> {
    const typeCode: string = getAnchorType(anchorString) || ''
    const number: number = getAnchorNum(anchorString)
    if (this.anchorMessages.some(mes => isSameMessage(mes, typeCode, number))) {
      this.anchorMessages = this.anchorMessages.filter(
        mes => !isSameMessage(mes, typeCode, number)
      )
      return
    }
    const anchorMessage: VillageAnchorMessage | null = await this.loadAnchorMessage(
      typeCode,
      number
    )
    if (anchorMessage?.message == null) return
    this.anchorMessages.unshift(anchorMessage.message)
  }

  private async loadAnchorMessage(
    typeCode: string,
    number: number
  ): Promise<VillageAnchorMessage | null> {
    try {
      return await this.$axios.$get(
        `/village/${this.$store.getters
          .getVillageId!}/message/type/${typeCode}/number/${number}`
      )
    } catch (error) {
      return null
    }
  }

  private clearAnchorMessages(): void {
    this.anchorMessages = []
  }
}

const isSameMessage = (
  message: Message,
  typeCode: string,
  num: number
): boolean => {
  return message.content.type.code === typeCode && message.content.num === num
}

const messageTypeMap = new Map<string, string>([
  [MESSAGE_TYPE.NORMAL_SAY, 'say'],
  [MESSAGE_TYPE.WEREWOLF_SAY, 'say'],
  [MESSAGE_TYPE.GRAVE_SAY, 'say'],
  [MESSAGE_TYPE.MONOLOGUE_SAY, 'say'],
  [MESSAGE_TYPE.MASON_SAY, 'say'],
  [MESSAGE_TYPE.SPECTATE_SAY, 'say'],
  [MESSAGE_TYPE.PUBLIC_SYSTEM, 'system'],
  [MESSAGE_TYPE.PRIVATE_SYSTEM, 'system'],
  [MESSAGE_TYPE.PRIVATE_SEER, 'system'],
  [MESSAGE_TYPE.PRIVATE_PSYCHIC, 'system'],
  [MESSAGE_TYPE.PRIVATE_WEREWOLF, 'system'],
  [MESSAGE_TYPE.PRIVATE_SYMPATHIZER, 'system'],
  [MESSAGE_TYPE.PARTICIPANTS, 'participants']
])
</script>

<style lang="scss" scoped>
.card {
  border: none;
  box-shadow: none;
  padding: 5px;

  &.dark-theme {
    background-color: transparent !important;
    color: #eee;
  }
}
</style>
