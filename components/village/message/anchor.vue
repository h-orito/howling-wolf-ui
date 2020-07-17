<template>
  <a
    v-if="mes.isAnchor"
    @click="clickAnchor(mes)"
    v-html="mes.text"
    href="javascript:void(0);"
  ></a>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import MesParts from '~/components/village/message/message-parts'
import AnchorType from '~/components/village/message/anchor-type'
import anchorTypeToMessageType from '~/components/village/message/anchor-message-type'
// type
import { MESSAGE_TYPE } from '~/components/const/consts'

@Component({})
export default class MessageAnchor extends Vue {
  @Prop({ type: Object })
  private mes!: MesParts

  /** リアクティブである必要がないので初期値で入れてしまう */
  private text: string = this.mes.text
  private isAnchor: boolean = this.mes.isAnchor
  private messageTypeCode: string = anchorTypeToMessageType(
    this.mes.anchorType!
  )

  private messageNumber: number | null = this.mes.messageNum

  private clickAnchor(mes: MesParts) {
    this.$emit('click-anchor', {
      messageTypeCode: this.messageTypeCode,
      messageNumber: this.messageNumber
    })
  }
}
</script>
