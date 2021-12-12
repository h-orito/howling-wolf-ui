<template>
  <div>
    <action-card
      :class="isFixed ? 'fixed' : ''"
      title="発言"
      :id="id"
      :is-open="isOpen"
      :exists-footer="false"
    >
      <template v-slot:content>
        <div class="content has-text-right m-b-5">
          <a href="javascript: void(0);" @click="toggleFixed">{{
            isFixed ? '固定解除' : '固定表示'
          }}</a>
        </div>
        <div class="content has-text-left m-b-5">
          <div class="myself-area">
            <notification v-if="!isAlive" type="info" class="m-b-5">
              あなたは死亡しました。
            </notification>
            <notification v-if="myself.skill" type="default" class="m-b-5">
              <span style="white-space: pre-line;">{{ skillDescription }}</span>
            </notification>
            <div class="myself-name-area">
              <p class="myself-name">{{ charaName }}</p>
            </div>
          </div>
          <div
            class="say-area"
            :class="$store.getters.isDarkTheme ? 'dark-theme' : ''"
          >
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
                  ref="messageInput"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="action-button-area">
          <b-button
            :disabled="!canSay"
            @click="sayConfirm"
            type="is-primary"
            size="is-small"
          >
            発言する
          </b-button>
        </div>
      </template>
    </action-card>
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
import actionCard from '~/components/village/action/action-card.vue'
import messageInput from '~/components/village/action/message-input.vue'
// type
import SituationAsParticipant from '~/components/type/situation-as-participant'
import VillageParticipant from '~/components/type/village-participant'
import Message from '~/components/type/message'
import Chara from '~/components/type/chara'
import { FACE_TYPE, MESSAGE_TYPE } from '~/components/const/consts'
import api from '~/components/village/village-api'
import toast from '~/components/village/village-toast'
import villageUserSettings from '~/components/village/user-settings/village-user-settings'
// dynamic imports
const modalSay = () => import('~/components/village/action/say/modal-say.vue')
const charaImage = () => import('~/components/village/chara-image.vue')
const notification = () =>
  import('~/components/village/village-notification.vue')

@Component({
  components: { actionCard, messageInput, modalSay, charaImage, notification }
})
export default class Say extends Vue {
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
  private isFixed: boolean = villageUserSettings.getActionWindow(this).is_fixed!
  private id: string = 'say-aria-id'
  private isOpen: boolean =
    villageUserSettings.getActionWindow(this).open_map![this.id] == null
      ? true
      : villageUserSettings.getActionWindow(this).open_map![this.id]

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

  private get myself(): VillageParticipant {
    return this.situation.participate.myself!
  }

  private get isAlive(): boolean {
    return this.myself.dead == null
  }

  private get charaName(): string {
    const name = this.myself.chara.chara_name.full_name
    if (this.myself.skill) {
      return `${name} （${this.myself.skill!.name}）`
    } else {
      return name
    }
  }

  private get skillDescription(): string {
    return this.myself.skill!.description.replaceAll('。', '。\n')
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
  private created(): void {
    this.reloadStyle()
  }

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

  private pasteToMessageInput(text: string): void {
    this.message += text
  }

  private toggleFixed(): void {
    this.isFixed = !this.isFixed
    const cookie = villageUserSettings.getActionWindow(this)
    cookie.is_fixed = this.isFixed
    villageUserSettings.setActionWindow(this, cookie)
    this.reloadStyle()
  }

  private reloadStyle(): void {
    const cookie = villageUserSettings.getActionWindow(this)
    let paddingBottom = '0'
    if (!cookie.is_fixed) {
      paddingBottom = '0'
    } else if (cookie.open_map![this.id] != null || cookie.open_map![this.id]) {
      paddingBottom = '30vh'
    } else {
      paddingBottom = '48px'
    }
    this.$emit('fixed', {
      paddingBottom
    })
  }
}
</script>

<style lang="scss" scoped>
.myself-area {
  .myself-name-area {
    padding-bottom: 5px;
    display: flex;

    .myself-name {
      flex: 1;
      text-align: left;
      font-weight: bold;
    }
  }
}
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
