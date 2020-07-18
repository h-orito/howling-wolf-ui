<template>
  <span
    ><span v-for="sentence in sentences" :key="sentence.id">
      <message-anchor
        v-if="sentence.isAnchor"
        :sentence="sentence"
        @click="clickAnchor(sentence)"
      /><span v-else v-html="sentence.text"></span>
    </span>
    <br
  /></span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import MesParts from '~/components/village/message/message-parts'
import AnchorType from '~/components/village/message/anchor-type'
import anchorTypeToMessageType from '~/components/village/message/anchor-message-type'
// component
const messageAnchor = () =>
  import('~/components/village/message/message-anchor.vue')

@Component({
  components: {
    messageAnchor
  }
})
export default class MessageLine extends Vue {
  @Prop({ type: String })
  private messageLine!: string

  private clickAnchor(mes: MesParts) {
    this.$emit('click-anchor', {
      messageTypeCode: anchorTypeToMessageType(mes.anchorType!),
      messageNumber: mes.messageNum
    })
  }

  // アンカーとそれ以外で分割
  private get sentences(): MesParts[] {
    let splitedMessages = this.messageLine.split(/(&gt;&gt;\d{1,5})/)
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
    } else if (mes.match(/(&gt;&gt;-\d{1,5})/)) {
      return AnchorType.Monologue
    } else if (mes.match(/(&gt;&gt;\*\d{1,5})/)) {
      return AnchorType.Wolf
    } else if (mes.match(/(&gt;&gt;\+\d{1,5})/)) {
      return AnchorType.Grave
    } else if (mes.match(/(&gt;&gt;=\d{1,5})/)) {
      return AnchorType.Mason
    } else if (mes.match(/(&gt;&gt;@\d{1,5})/)) {
      return AnchorType.Spectate
    } else if (mes.match(/(&gt;&gt;#\d{1,5})/)) {
      return AnchorType.Creator
    }
    return null
  }
}
</script>
