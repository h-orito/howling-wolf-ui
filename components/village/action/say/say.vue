<template>
  <action-card :title="'発言する'">
    <template v-slot:content>
      <div class="content has-text-left">
        <div class="say-area">
          <b-field>
            <b-radio-button
              v-for="messageTypeSituation in situation.say
                .selectable_message_type_list"
              :key="messageTypeSituation.message_type.code"
              v-model="messageType"
              :native-value="messageTypeSituation.message_type.code"
              type="is-primary"
              size="is-small"
            >
              <span>{{ messageTypeSituation.message_type.name }}</span>
            </b-radio-button>
          </b-field>

          <div class="say-content-area">
            <div class="say-face-area">
              <img
                :src="imageUrl"
                :width="imageWidth"
                :height="imageHeight"
                class="say-chara-image"
              />
            </div>
            <div class="say-input-area">
              <message-input
                v-model="message"
                :message-type="messageType"
                :situation="situation.say"
                ref="messageInput"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <b-button
        :disabled="!canSay"
        @click="sayConfirm"
        type="is-primary"
        size="is-small"
      >
        発言する
      </b-button>
      <b-modal
        :active.sync="isSayModalOpen"
        has-modal-card
        trap-focus
        aria-role="dialog"
        aria-modal
      >
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title has-text-left">発言確認</p>
          </header>
          <section class="modal-card-body has-text-left">
            <p>この内容で発言しますか？</p>
            <message-card
              :message="confirmMessage"
              :village="village"
              :is-progress="isProgress"
            />
          </section>
          <footer
            class="modal-card-foot"
            style="justify-content: flex-end !important;"
          >
            <b-button type="is-secondary" size="is-small" @click="close">
              キャンセル
            </b-button>
            <b-button
              :disabled="submitting"
              type="is-primary"
              size="is-small"
              @click="say"
              >発言する</b-button
            >
          </footer>
        </div>
      </b-modal>
    </template>
  </action-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import actionCard from '~/components/village/action/action-card.vue'
import messageCard from '~/components/village/message/message-card.vue'
import messageInput from '~/components/village/action/message-input.vue'
// type
import SituationAsParticipant from '~/components/type/situation-as-participant'
import Village from '~/components/type/village'
import Message from '~/components/type/message'
import { FACE_TYPE, MESSAGE_TYPE } from '~/components/const/consts'

@Component({
  components: { actionCard, messageInput, messageCard }
})
export default class Say extends Vue {
  @Prop({ type: Object })
  private situation!: SituationAsParticipant

  @Prop({ type: Object })
  private village!: Village

  private messageTypeFaceTypeMap: Map<string, string> = new Map([
    [MESSAGE_TYPE.NORMAL_SAY, FACE_TYPE.NORMAL],
    [MESSAGE_TYPE.WEREWOLF_SAY, FACE_TYPE.WEREWOLF],
    [MESSAGE_TYPE.SPECTATE_SAY, FACE_TYPE.NORMAL],
    [MESSAGE_TYPE.SECRET_SAY, FACE_TYPE.SECRET],
    [MESSAGE_TYPE.MONOLOGUE_SAY, FACE_TYPE.MONOLOGUE],
    [MESSAGE_TYPE.GRAVE_SAY, FACE_TYPE.GRAVE]
  ])

  private messageType: string = this.situation.say.default_message_type!.code
  private message: string = ''
  private isSayModalOpen: boolean = false
  private submitting: boolean = false
  // 発言確認で返ってきた発言内容
  private confirmMessage: Message | null = null

  // 発言確認用なので常にtrue
  private get isProgress(): boolean {
    return true
  }

  private get myself(): string {
    const self = this.situation.participate.myself!
    const charaName = self.chara.chara_name.name
    const skill = self.skill == null ? null : self.skill.name
    if (skill == null) {
      return charaName
    } else {
      return `${charaName}（${skill}）`
    }
  }

  private get faceTypeCode(): string {
    const expectedFaceType = this.messageTypeFaceTypeMap.get(this.messageType)
    if (expectedFaceType == null) return FACE_TYPE.NORMAL
    if (
      this.situation.participate.myself!.chara.face_list.some(
        face => face.type === expectedFaceType
      )
    ) {
      return expectedFaceType
    }
    return FACE_TYPE.NORMAL
  }

  private get imageUrl(): string {
    return this.situation.participate.myself!.chara.face_list.find(
      face => face.type === this.faceTypeCode
    )!.image_url
  }

  private get imageWidth(): number {
    return this.situation.participate.myself!.chara.display.width
  }

  private get imageHeight(): number {
    return this.situation.participate.myself!.chara.display.height
  }

  private get canSay(): boolean {
    if (this.message == null || this.message.trim() === '') return false
    if (this.messageType == null) return false
    if (this.isOver) return false
    return true
  }

  private get isOver(): boolean {
    // veturがrefsで定義した子コンポーネントのプロパティを認識できないので回避
    return (this.$refs as any).messageInput.existsOver
  }

  private get isInputting(): boolean {
    return (this.$refs as any).messageInput.isInputting
  }

  private async sayConfirm(): Promise<void> {
    try {
      this.confirmMessage = await this.$axios.$post(
        `/village/${this.village!.id}/say-confirm`,
        {
          message: this.message,
          message_type: this.messageType,
          face_type: this.faceTypeCode
        }
      )
      this.isSayModalOpen = true
    } catch (error) {}
  }

  private close(): void {
    this.isSayModalOpen = false
  }

  private async say(): Promise<void> {
    this.submitting = true
    try {
      await this.$axios.$post(`/village/${this.village!.id}/say`, {
        message: this.message,
        message_type: this.messageType,
        face_type: this.faceTypeCode
      })
    } catch (error) {}
    this.submitting = false
    this.message = ''
    this.close()
    await this.$emit('reload')
  }
}
</script>

<style lang="scss">
.say-area {
  .say-content-area {
    display: flex;

    .say-face-area {
      padding-right: 5px;

      .say-chara-image {
        border-radius: 5px;
      }
    }

    .say-input-area {
      flex: 1;
    }
  }
}
</style>
