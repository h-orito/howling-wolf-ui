<template>
  <div class="w4b-message-normal-card">
    <div class="w4b-message-face-area">
      <img :src="imageUrl" />
    </div>
    <div class="w4b-message-content-area">
      <div class="w4b-message-name-area">
        <p class="w4b-message-name">{{ message.from.chara.chara_name.name }}</p>
        <p class="w4b-message-datetime">{{ message.time.datetime }}</p>
      </div>
      <div class="w4b-message-text-area">
        <p class="w4b-message-text">{{ message.content.text }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Message from '~/components/type/message'
@Component({})
export default class MessageCard extends Vue {
  @Prop({ type: Object })
  private message!: Message

  private get imageUrl(): string {
    const typeCode = this.message.content.face_code
    return this.message.from!.chara.face_list.find(
      face => face.type === typeCode
    )!.image_url
  }
}
</script>

<style lang="scss" scoped>
.w4b-message-normal-card {
  display: flex;

  .w4b-message-face-area {
    margin: 5px;
  }
  .w4b-message-content-area {
    margin-right: 5px;
    padding-top: 5px;
    padding-bottom: 5px;
    flex: 1;

    .w4b-message-name-area {
      display: flex;

      .w4b-message-name {
        flex: 1;
        text-align: left;
        font-weight: bold;
      }
      .w4b-message-datetime {
        flex: 1;
        text-align: right;
        color: #aaaaaa;
      }
    }

    .w4b-message-text-area {
      .w4b-message-text {
        text-align: left;
      }
    }
  }
}
</style>
