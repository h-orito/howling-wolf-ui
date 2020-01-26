<template>
  <div class="w4b-message-card">
    <div class="w4b-message-name-area">
      <a href="javascript:void(0);">{{ $parent.anchorString }}</a
      >.&nbsp;
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
      <div class="w4b-message-text-area">
        <message-text :messageText="message.content.text" />
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
export default class MessageNormal extends Vue {
  @Prop({ type: Object })
  private message!: Message

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
}
</script>
