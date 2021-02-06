<template>
  <b-modal
    :active="isOpen"
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
        <message-card :message="confirmMessage" :is-progress="true" />
        <div class="m-t-20" v-if="isNotFinished">
          <p style="font-weight: 700; margin-bottom: 6px;">誤爆防止確認</p>
          <p>発言しようとしている種別を選択してください</p>
          <b-field class="m-b-5">
            <b-radio-button
              v-for="type in messageTypes"
              :key="type.code"
              v-model="confirmType"
              :native-value="type.code"
              type="is-primary"
              size="is-small"
            >
              <span>{{ type.label }}</span>
            </b-radio-button>
          </b-field>
        </div>
      </section>
      <footer
        class="modal-card-foot"
        style="justify-content: flex-end !important;"
      >
        <b-button type="is-secondary" size="is-small" @click="close">
          キャンセル
        </b-button>
        <b-button
          :disabled="!canSubmit"
          type="is-primary"
          size="is-small"
          @click="say"
          >発言する</b-button
        >
      </footer>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import messageCard from '~/components/village/message/message-card.vue'
import Village from '~/components/type/village'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import Message from '~/components/type/message'
import { VILLAGE_STATUS, MESSAGE_TYPE } from '~/components/const/consts'

@Component({
  components: { messageCard }
})
export default class ModalSay extends Vue {
  // ----------------------------------------------------------------
  // props
  // ----------------------------------------------------------------
  @Prop({ type: Boolean })
  private isOpen!: boolean

  @Prop({ type: Object })
  private confirmMessage!: Message | null

  // ----------------------------------------------------------------
  // data
  // ----------------------------------------------------------------
  private submitting: boolean = false
  private confirmType: string = ''

  // ----------------------------------------------------------------
  // computed
  // ----------------------------------------------------------------
  private get village(): Village {
    return this.$store.getters.getVillage!
  }

  private get situation(): SituationAsParticipant {
    return this.$store.getters.getSituation!
  }

  private get isNotFinished(): boolean {
    const status = this.village.status.code
    return (
      status === VILLAGE_STATUS.PROLOGUE || status === VILLAGE_STATUS.PROGRESS
    )
  }

  private get messageTypes(): any[] {
    return [
      {
        label: '通常発言',
        code: MESSAGE_TYPE.NORMAL_SAY
      },
      {
        label: '人狼の囁き',
        code: MESSAGE_TYPE.WEREWOLF_SAY
      },
      {
        label: '死者の呻き',
        code: MESSAGE_TYPE.GRAVE_SAY
      },
      {
        label: '独り言',
        code: MESSAGE_TYPE.MONOLOGUE_SAY
      },
      {
        label: '見学発言',
        code: MESSAGE_TYPE.SPECTATE_SAY
      },
      {
        label: '村建て発言',
        code: MESSAGE_TYPE.CREATOR_SAY
      }
    ].filter(type => this.availableMessageTypes.includes(type.code))
  }

  private get availableMessageTypes(): string[] {
    return this.situation.say.selectable_message_type_list.map(
      type => type.message_type.code
    )
  }

  private get canSubmit(): boolean {
    return (
      !!this.confirmMessage &&
      (!this.isNotFinished ||
        this.confirmType === this.confirmMessage.content.type.code) &&
      !this.submitting
    )
  }

  // ----------------------------------------------------------------
  // method
  // ----------------------------------------------------------------
  private close(): void {
    this.$emit('close')
  }

  private async say(): Promise<void> {
    this.submitting = true
    await this.$emit('say')
    this.submitting = false
    this.confirmType = ''
    this.close()
  }
}
</script>

<style lang="scss" scoped>
.dark-theme {
  .modal-card-body {
    background-image: url('~static/image/top-bg.jpg');
    background-repeat: repeat-y;
    background-size: contain;
    background-position: left top;
  }
}
</style>
