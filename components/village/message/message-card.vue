<template>
  <div>
    <div v-if="message != null" class="card">
      <message-say
        v-if="isSayType"
        :message="message"
        :is-progress="isProgress"
        :is-anchor-message="isAnchorMessage"
        @click-anchor="clickAnchorMessage($event)"
      />
      <message-system v-if="isSystemType" :message="message" />
      <!-- アンカーメッセージ -->
      <message-card
        v-for="mes in anchorMessages"
        :key="mes.id"
        :message="mes"
        :is-progress="isProgress"
        :is-anchor-message="isAnchorTrue"
        @click-anchor="clickAnchorMessage($event)"
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
import messageText from '~/components/village/message/message-text.vue'
import messageCard from '~/components/village/message/message-card.vue'
// type
import Village from '~/components/type/village'
import Message from '~/components/type/message'
import VillageAnchorMessage from '~/components/type/village-anchor-message'
import { MESSAGE_TYPE } from '~/components/const/consts'

@Component({
  name: 'message-card',
  components: {
    messageText,
    messageSay,
    messageSystem,
    messageCard
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

  private anchorMessages: Message[] = []

  private get village(): Village {
    return this.$store.getters.getVillage!
  }

  private get isAnchorTrue(): boolean {
    return true
  }

  private get isSayType(): boolean {
    return [
      MESSAGE_TYPE.NORMAL_SAY,
      MESSAGE_TYPE.WEREWOLF_SAY,
      MESSAGE_TYPE.GRAVE_SAY,
      MESSAGE_TYPE.MONOLOGUE_SAY,
      MESSAGE_TYPE.MASON_SAY,
      MESSAGE_TYPE.SPECTATE_SAY
    ].some(code => this.message.content.type.code === code)
  }

  private get isSystemType(): boolean {
    return [
      MESSAGE_TYPE.PUBLIC_SYSTEM,
      MESSAGE_TYPE.PRIVATE_SYSTEM,
      MESSAGE_TYPE.PRIVATE_SEER,
      MESSAGE_TYPE.PRIVATE_PSYCHIC,
      MESSAGE_TYPE.PRIVATE_WEREWOLF,
      MESSAGE_TYPE.PRIVATE_MASON,
      MESSAGE_TYPE.PARTICIPANTS
    ].some(code => this.message.content.type.code === code)
  }

  private async clickAnchorMessage({
    messageTypeCode,
    messageNumber
  }): Promise<void> {
    const villageAnchorMessage: VillageAnchorMessage | null = await this.loadAnchorMessage(
      messageTypeCode,
      messageNumber
    )
    if (villageAnchorMessage == null || villageAnchorMessage.message == null) {
      return
    }
    const message = villageAnchorMessage.message
    if (this.anchorMessages.some(mes => this.isSameMessage(mes, message))) {
      this.anchorMessages = this.anchorMessages.filter(
        mes => !this.isSameMessage(mes, message)
      )
    } else {
      this.anchorMessages.unshift(message)
    }
  }

  private async loadAnchorMessage(
    messageTypeCode: string,
    messageNumber: number
  ): Promise<VillageAnchorMessage | null> {
    try {
      return await this.$axios.$get(
        `/village/${
          this.village!.id
        }/message/type/${messageTypeCode}/number/${messageNumber}`
      )
    } catch (error) {
      return null
    }
  }

  private isSameMessage(message1: Message, message2: Message): boolean {
    return (
      message1.content.type.code === message2.content.type.code &&
      message1.content.num === message2.content.num
    )
  }

  private clearAnchorMessages(): void {
    this.anchorMessages = []
  }
}
</script>
