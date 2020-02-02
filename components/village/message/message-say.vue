<template>
  <div class="w4b-message-card">
    <div class="w4b-message-name-area">
      <span v-if="isDispAnchorString">
        <a href="javascript:void(0);">{{ anchorString }}</a
        >.&nbsp;</span
      >
      <p class="w4b-message-name">{{ message.from.chara.chara_name.name }}</p>
      <p class="w4b-message-datetime">{{ message.time.datetime }}</p>
    </div>
    <div class="w4b-message-content-area">
      <div class="w4b-message-face-area">
        <img
          :src="imageUrl"
          :width="imageWidth"
          :height="imageHeight"
          class="w4b-message-chara-image"
        />
      </div>
      <div class="w4b-message-text-area" :class="messageClass">
        <message-text :message-text="message.content.text" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import messageText from '~/components/village/message/message-text.vue'
import Message from '~/components/type/message'

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
      case 'NORMAL_SAY':
        return 'normal-say'
      case 'WEREWOLF_SAY':
        return 'werewolf-say'
      case 'MONOLOGUE_SAY':
        return 'monologue-say'
      case 'GRAVE_SAY':
        return 'grave-say'
      case 'SPECTATE_SAY':
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
</style>
