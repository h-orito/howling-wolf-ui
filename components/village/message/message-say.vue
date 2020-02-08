<template>
  <div class="hw-message-card" :class="isAnchorMessage ? 'anchor-message' : ''">
    <div class="hw-message-name-area">
      <span v-if="isDispAnchorString">
        <a href="javascript:void(0);">{{ anchorString }}</a
        >.&nbsp;</span
      >
      <p class="hw-message-name">{{ message.from.chara.chara_name.name }}</p>
      <p class="hw-message-datetime">{{ message.time.datetime }}</p>
    </div>
    <div class="hw-message-content-area">
      <div class="hw-message-face-area">
        <img
          :src="imageUrl"
          :width="imageWidth"
          :height="imageHeight"
          class="hw-message-chara-image"
        />
      </div>
      <div class="hw-message-text-area" :class="messageClass">
        <message-text
          :message-text="message.content.text"
          @click-anchor="$emit('click-anchor', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import messageText from '~/components/village/message/message-text.vue'
import Message from '~/components/type/message'
import { MESSAGE_TYPE } from '~/components/const/consts'

@Component({
  components: {
    messageText
  }
})
export default class MessageSay extends Vue {
  @Prop({ type: Object })
  private message!: Message

  @Prop({ type: Boolean })
  private isProgress!: boolean

  @Prop({ type: Boolean, default: false })
  private isAnchorMessage?: boolean

  private get imageUrl(): string {
    const typeCode = this.message.content.face_code
    return this.message.from!.chara.face_list.find(
      face => face.type === typeCode
    )!.image_url
  }

  private get imageWidth(): number {
    return this.message.from!.chara.display.width
  }

  private get imageHeight(): number {
    return this.message.from!.chara.display.height
  }

  private get messageClass(): string {
    switch (this.message.content.type.code) {
      case MESSAGE_TYPE.NORMAL_SAY:
        return 'normal-say'
      case MESSAGE_TYPE.WEREWOLF_SAY:
        return 'werewolf-say'
      case MESSAGE_TYPE.MONOLOGUE_SAY:
        return 'monologue-say'
      case MESSAGE_TYPE.GRAVE_SAY:
        return 'grave-say'
      case MESSAGE_TYPE.SPECTATE_SAY:
        return 'spectate-say'
      default:
        return ''
    }
  }

  private get isDispAnchorString(): boolean {
    return (
      !this.isProgress || this.message.content.type.code !== 'MONOLOGUE_SAY'
    )
  }

  private get anchorString(): string {
    let prefix: string = ''
    switch (this.message.content.type.code) {
      case 'NORMAL_SAY':
        prefix = ''
        break
      case 'MONOLOGUE_SAY':
        prefix = '-'
        break
      case 'GRAVE_SAY':
        prefix = '+'
        break
      case 'WEREWOLF_SAY':
        prefix = '*'
        break
      case 'MASON_SAY':
        prefix = '='
        break
      case 'SPECTATE_SAY':
        prefix = '@'
        break
      case 'CREATOR_SAY':
        prefix = '#'
        break
      default:
        prefix = ''
    }
    return `>>${prefix}${this.message.content.num}`
  }
}
</script>

<style lang="scss">
.normal-say {
  background-color: $normal-say !important;
}
.werewolf-say {
  background-color: $werewolf-say !important;
}
.monologue-say {
  background-color: $monologue-say !important;
}
.grave-say {
  background-color: $grave-say !important;
}
.spectate-say {
  background-color: $spectate-say !important;
}
.anchor-message {
  margin-left: 50px;
  margin-bottom: 5px;
}
</style>
