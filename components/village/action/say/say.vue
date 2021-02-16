<template>
  <div>
    <div class="content has-text-left m-b-5">
      <div class="say-area" :class="$store.getters.isDarkTheme ? 'dark-theme' : ''">
        <b-field class="m-b-5">
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
            <chara-image :chara="chara" :face-type="faceTypeCode" />
          </div>
          <div class="say-input-area">
            <message-input
              v-model="message"
              :message-type="messageType"
              :row-size="rowSize"
              ref="messageInput"
            />
          </div>
        </div>
      </div>
    </div>
    <b-button
      :disabled="!canSay"
      @click="sayConfirm"
      type="is-primary"
      size="is-small"
      expanded
    >
      発言する
    </b-button>
    <modal-say
      :is-open="isSayModalOpen"
      :confirm-message="confirmMessage"
      @close="closeSayModal"
      @say="say"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import messageInput from '~/components/village/action/message-input.vue'
// type
import SituationAsParticipant from '~/components/type/situation-as-participant'
import Message from '~/components/type/message'
import Chara from '~/components/type/chara'
import { FACE_TYPE, MESSAGE_TYPE } from '~/components/const/consts'
import api from '~/components/village/village-api'
import toast from '~/components/village/village-toast'
import { VillageUserSettings } from '~/components/village/user-settings/village-user-settings'
const modalSay = () => import('~/components/village/action/say/modal-say.vue')
const charaImage = () => import('~/components/village/chara-image.vue')

@Component({
  components: { messageInput, modalSay, charaImage }
})
export default class Say extends Vue {
  // ----------------------------------------------------------------
  // props
  // ----------------------------------------------------------------
  @Prop({ type: Number })
  private windowSize!: number

  // ----------------------------------------------------------------
  // data
  // ----------------------------------------------------------------
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

  // 発言確認で返ってきた発言内容
  private confirmMessage: Message | null = null

  // ----------------------------------------------------------------
  // computed
  // ----------------------------------------------------------------
  private get villageId(): number {
    return this.$store.getters.getVillageId!
  }

  private get situation(): SituationAsParticipant {
    return this.$store.getters.getSituation!
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

  // 縦幅に合わせる
  private get rowSize(): number {
    if (this.windowSize < 2) return 3
    return 9
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

  private get chara(): Chara {
    return this.situation.participate.myself!.chara
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

  // ----------------------------------------------------------------
  // method
  // ----------------------------------------------------------------
  private async sayConfirm(): Promise<void> {
    try {
      this.confirmMessage = await api.postConfirmSay(
        this,
        this.villageId,
        this.message,
        this.messageType,
        this.faceTypeCode
      )
      this.isSayModalOpen = true
    } catch (error) {
      toast.danger(this, '発言確認失敗しました。')
    }
  }

  private async say(): Promise<void> {
    try {
      await api.postSay(
        this,
        this.villageId,
        this.message,
        this.messageType,
        this.faceTypeCode
      )
      this.message = ''
    } catch (error) {
      toast.danger(this, '発言失敗しました。')
    }
    await this.$emit('reload')
  }

  private closeSayModal(): void {
    this.isSayModalOpen = false
  }
}
</script>

<style lang="scss" scoped>
.say-area {
  .say-content-area {
    display: flex;

    .say-face-area {
      padding-right: 5px;
    }

    .say-input-area {
      flex: 1;
    }
  }
}
</style>

<style lang="scss">
.dark-theme {
  .b-radio.button {
    border: 1px solid $primary-dark;
    background-color: transparent;
    color: $primary-dark;

    &.is-primary {
      background-color: $primary-dark;
      color: $white;
    }
  }
}
</style>
