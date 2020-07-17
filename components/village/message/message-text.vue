<template>
  <p class="hw-message-text">
    <span
      v-for="escapedMessageLine in escapeAndSplitMessage(messageText)"
      :key="escapedMessageLine.id"
      ><span v-for="mes in splitAnchor(escapedMessageLine)" :key="mes.id">
        <span v-if="!mes.isAnchor" v-html="mes.text"></span>
        <anchor :mes="mes" @click-anchor="clickAnchor($event)" />
      </span>
      <br />
    </span>
  </p>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import MesParts from '~/components/village/message/message-parts'
import AnchorType from '~/components/village/message/anchor-type'
// type
import Message from '~/components/type/message'
import VillageAnchorMessage from '~/components/type/village-anchor-message'
import { MESSAGE_TYPE } from '~/components/const/consts'
// component
const anchor = () => import('~/components/village/message/anchor.vue')

@Component({
  components: {
    anchor
  }
})
export default class MessageText extends Vue {
  @Prop({ type: String })
  private messageText!: string

  private get anchorTypeMessageTypeMap(): Map<AnchorType, string> {
    const map = new Map<AnchorType, string>()
    map.set(AnchorType.Normal, MESSAGE_TYPE.NORMAL_SAY)
    map.set(AnchorType.Grave, MESSAGE_TYPE.GRAVE_SAY)
    map.set(AnchorType.Wolf, MESSAGE_TYPE.WEREWOLF_SAY)
    map.set(AnchorType.Mason, MESSAGE_TYPE.MASON_SAY)
    map.set(AnchorType.Spectate, MESSAGE_TYPE.SPECTATE_SAY)
    map.set(AnchorType.Monologue, MESSAGE_TYPE.MONOLOGUE_SAY)
    map.set(AnchorType.Creator, MESSAGE_TYPE.CREATOR_SAY)
    return map
  }

  // html escape and line separate
  private escapeAndSplitMessage = (message: string): string[] => {
    return message
      .replace(/(\r\n|\n|\r)/gm, '<br>')
      .split('<br>')
      .map(item => {
        item = item
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')
        return item
      })
  }

  private clickAnchor({ messageTypeCode, messageNumber }) {
    this.$emit('click-anchor', {
      messageTypeCode,
      messageNumber
    })
  }

  // アンカーとそれ以外で分割
  private splitAnchor = (message: string): MesParts[] => {
    let splitedMessages = message.split(/(&gt;&gt;\d{1,5})/)
    splitedMessages = this.appendSplit(splitedMessages, /(&gt;&gt;\+\d{1,5})/)
    splitedMessages = this.appendSplit(splitedMessages, /(&gt;&gt;=\d{1,5})/)
    splitedMessages = this.appendSplit(splitedMessages, /(&gt;&gt;@\d{1,5})/)
    splitedMessages = this.appendSplit(splitedMessages, /(&gt;&gt;-\d{1,5})/)
    splitedMessages = this.appendSplit(splitedMessages, /(&gt;&gt;\*\d{1,5})/)
    splitedMessages = this.appendSplit(splitedMessages, /(&gt;&gt;#\d{1,5})/)
    splitedMessages = splitedMessages.filter(mes => mes !== '')

    return splitedMessages.map(splitedMessage => {
      const anchorType: AnchorType | null = this.getAnchorType(splitedMessage)
      const mes: MesParts = new MesParts()
      mes.text = splitedMessage
      mes.anchorType = anchorType
      mes.isAnchor = anchorType != null
      if (anchorType != null) {
        mes.messageNum = parseInt(RegExp(/\d{1,5}/).exec(splitedMessage)![0])
      }
      return mes
    })
  }

  private appendSplit = (array: string[], regex: RegExp): string[] => {
    let splitedMessages: string[] = []
    array.slice().forEach(mes => {
      splitedMessages = splitedMessages.concat(mes.split(regex))
    })
    return splitedMessages
  }

  private getAnchorType = (mes: string): AnchorType | null => {
    if (mes.match(/(&gt;&gt;\d{1,5})/)) {
      return AnchorType.Normal
    } else if (mes.match(/(&gt;&gt;\+\d{1,5})/)) {
      return AnchorType.Grave
    } else if (mes.match(/(&gt;&gt;=\d{1,5})/)) {
      return AnchorType.Mason
    } else if (mes.match(/(&gt;&gt;@\d{1,5})/)) {
      return AnchorType.Spectate
    } else if (mes.match(/(&gt;&gt;-\d{1,5})/)) {
      return AnchorType.Monologue
    } else if (mes.match(/(&gt;&gt;\*\d{1,5})/)) {
      return AnchorType.Wolf
    } else if (mes.match(/(&gt;&gt;#\d{1,5})/)) {
      return AnchorType.Creator
    }
    return null
  }
}
</script>
