<template>
  <div class="hw-message-card" :class="isAnchorMessage ? 'anchor-message' : ''">
    <div class="hw-message-name-area">
      <span v-if="isDispAnchorString">
        <a href="javascript:void(0);" @click="copyAnchorString">{{
          anchorString
        }}</a
        >.&nbsp;</span
      >
      <p class="hw-message-name">
        {{ message.from.chara.chara_name.full_name }}
      </p>
      <p class="hw-message-player" v-if="message.from.player">
        [<a
          :href="'https://twitter.com/' + message.from.player.twitter_user_name"
          target="_blank"
          >{{ message.from.player.twitter_user_name }}</a
        >]
      </p>
      <p class="hw-message-datetime">
        {{ isAnchorMessage ? message.time.day + 'd' : '' }}
        {{ messageCount }}
        {{ message.time.datetime.substring(11) }}
      </p>
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
import Village from '~/components/type/village'
import Message from '~/components/type/message'
import { MESSAGE_TYPE } from '~/components/const/consts'

@Component({
  components: {
    messageText
  }
})
export default class MessageSay extends Vue {
  @Prop({ type: Object })
  private village?: Village

  @Prop({ type: Object })
  private message!: Message

  @Prop({ type: Boolean })
  private isProgress!: boolean

  @Prop({ type: Boolean, default: false })
  private isAnchorMessage?: boolean

  private messageClassMap: Map<string, string> = new Map([
    [MESSAGE_TYPE.NORMAL_SAY, 'normal-say'],
    [MESSAGE_TYPE.WEREWOLF_SAY, 'werewolf-say'],
    [MESSAGE_TYPE.MONOLOGUE_SAY, 'monologue-say'],
    [MESSAGE_TYPE.GRAVE_SAY, 'grave-say'],
    [MESSAGE_TYPE.SPECTATE_SAY, 'spectate-say']
  ])

  private anchorPrefixMap: Map<string, string> = new Map([
    [MESSAGE_TYPE.NORMAL_SAY, ''],
    [MESSAGE_TYPE.MONOLOGUE_SAY, '-'],
    [MESSAGE_TYPE.GRAVE_SAY, '+'],
    [MESSAGE_TYPE.WEREWOLF_SAY, '*'],
    [MESSAGE_TYPE.MASON_SAY, '='],
    [MESSAGE_TYPE.SPECTATE_SAY, '@'],
    [MESSAGE_TYPE.CREATOR_SAY, '#']
  ])

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
    const className = this.messageClassMap.get(this.message.content.type.code)
    if (className == null) return ''
    return className
  }

  private get messageCount(): string {
    if (this.message.content.count == null || this.village == null) return ''
    const restrict = this.village.setting.rules.message_restrict.restrict_list.find(
      restrict => {
        return restrict.type.code === this.message.content.type.code
      }
    )
    if (!restrict) return ''
    return `(${this.message.content.count}/${restrict.count})`
  }

  private get isDispAnchorString(): boolean {
    return (
      !this.isProgress ||
      this.message.content.type.code !== MESSAGE_TYPE.MONOLOGUE_SAY
    )
  }

  private get anchorString(): string {
    const prefix = this.anchorPrefixMap.get(this.message.content.type.code)
    if (prefix == null) return ''
    return `>>${prefix}${this.message.content.num}`
  }

  private async copyAnchorString(): Promise<void> {
    await (this as any).$copyText(this.anchorString)
    this.$buefy.toast.open({
      message: `クリップボードにコピーしました: ${this.anchorString}`,
      type: 'is-info',
      position: 'is-top'
    })
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
