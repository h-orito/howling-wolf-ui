<template>
  <b-modal
    :active="isOpen"
    has-modal-card
    trap-focus
    aria-role="dialog"
    aria-modal
    :on-cancel="close"
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title has-text-left">発言抽出</p>
      </header>
      <section class="modal-card-body has-text-left" v-if="village">
        <section>
          <p style="font-weight: 700; margin-bottom: 6px;">発言種別</p>
          <b-field>
            <a @click="allMessageTypeOn">全てON</a>
            &nbsp;/&nbsp;
            <a @click="allMessageTypeOff">全てOFF</a>
            &nbsp;/&nbsp;
            <a @click="reverseMessageType">反転</a>
          </b-field>
          <b-field>
            <b-checkbox-button
              v-model="messageTypeCodeGroup"
              native-value="NORMAL_SAY"
              type="is-primary"
              size="is-small"
            >
              通常
            </b-checkbox-button>
            <b-checkbox-button
              v-model="messageTypeCodeGroup"
              native-value="WEREWOLF_SAY"
              type="is-primary"
              size="is-small"
            >
              囁き
            </b-checkbox-button>
            <b-checkbox-button
              v-model="messageTypeCodeGroup"
              native-value="GRAVE_SAY"
              type="is-primary"
              size="is-small"
            >
              墓下見学
            </b-checkbox-button>
            <b-checkbox-button
              v-model="messageTypeCodeGroup"
              native-value="MONOLOGUE_SAY"
              type="is-primary"
              size="is-small"
            >
              独り言
            </b-checkbox-button>
            <b-checkbox-button
              v-model="messageTypeCodeGroup"
              native-value="SYSTEM"
              type="is-primary"
              size="is-small"
            >
              システム
            </b-checkbox-button>
          </b-field>
        </section>
        <section class="m-t-10">
          <p style="font-weight: 700; margin-bottom: 6px;">キャラ</p>
          <b-field>
            <a @click="allParticipantOn">全てON</a>
            &nbsp;/&nbsp;
            <a @click="allParticipantOff">全てOFF</a>
            &nbsp;/&nbsp;
            <a @click="reverseParticipant">反転</a>
          </b-field>
          <div
            class="field"
            v-for="participant in participantList"
            :key="participant.id"
          >
            <b-checkbox
              v-model="participantIdGroup"
              :native-value="participant.id"
              size="is-small"
            >
              {{ participant.chara.chara_name.full_name }}
            </b-checkbox>
          </div>
        </section>
      </section>
      <footer
        class="modal-card-foot"
        style="justify-content: flex-end !important;"
      >
        <b-button type="is-secondary" size="is-small" @click="close">
          キャンセル
        </b-button>
        <b-button
          type="is-primary"
          size="is-small"
          @click="filter"
          :disabled="
            messageTypeCodeGroup.length === 0 || participantIdGroup.length === 0
          "
          >抽出する</b-button
        >
      </footer>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// component
// type
import Village from '~/components/type/village'
import VillageParticipant from '~/components/type/village-participant'
import Chara from '~/components/type/chara'
import { MESSAGE_TYPE } from '~/components/const/consts'

@Component({
  components: {}
})
export default class ModalFilter extends Vue {
  // ----------------------------------------------------------------
  // prop
  // ----------------------------------------------------------------
  @Prop({ type: Object })
  private village?: Village | null

  @Prop({ type: Boolean })
  private isOpen!: boolean

  // ----------------------------------------------------------------
  // const
  // ----------------------------------------------------------------
  private messageTypeGroupMap: Map<string, string[]> = new Map([
    [
      'SYSTEM',
      [
        MESSAGE_TYPE.PUBLIC_SYSTEM,
        MESSAGE_TYPE.PRIVATE_SYSTEM,
        MESSAGE_TYPE.PRIVATE_SEER,
        MESSAGE_TYPE.PRIVATE_PSYCHIC,
        MESSAGE_TYPE.PRIVATE_WEREWOLF,
        MESSAGE_TYPE.PARTICIPANTS
      ]
    ],
    [MESSAGE_TYPE.NORMAL_SAY, [MESSAGE_TYPE.NORMAL_SAY]],
    [MESSAGE_TYPE.WEREWOLF_SAY, [MESSAGE_TYPE.WEREWOLF_SAY]],
    [MESSAGE_TYPE.MONOLOGUE_SAY, [MESSAGE_TYPE.MONOLOGUE_SAY]],
    [
      MESSAGE_TYPE.GRAVE_SAY,
      [MESSAGE_TYPE.GRAVE_SAY, MESSAGE_TYPE.SPECTATE_SAY]
    ]
  ])

  private allMessageTypeGroup: string[] = [
    'SYSTEM',
    MESSAGE_TYPE.NORMAL_SAY,
    MESSAGE_TYPE.WEREWOLF_SAY,
    MESSAGE_TYPE.MONOLOGUE_SAY,
    MESSAGE_TYPE.GRAVE_SAY
  ]

  // ----------------------------------------------------------------
  // data
  // ----------------------------------------------------------------
  private messageTypeCodeGroup: string[] = this.allMessageTypeGroup

  private participantIdGroup: number[] = []

  // ----------------------------------------------------------------
  // computed
  // ----------------------------------------------------------------
  private get messageTypeList(): string[] {
    const list: string[] = []
    this.messageTypeCodeGroup.forEach(group => {
      list.push(...this.messageTypeGroupMap.get(group)!)
    })
    return list
  }

  private get participantList(): VillageParticipant[] {
    return this.village!.participant.member_list
  }

  private get allParticipantIdList(): number[] {
    return this.village!.participant.member_list.map(member => member.id)
  }

  private get isFiltering(): boolean {
    return (
      this.messageTypeCodeGroup.length !== this.allMessageTypeGroup.length ||
      this.participantIdGroup.length !== this.village!.participant.count
    )
  }

  // ----------------------------------------------------------------
  // method
  // ----------------------------------------------------------------
  private async filter(): Promise<void> {
    let messageTypeList: string[] = this.messageTypeList
    if (this.messageTypeCodeGroup.length === this.allMessageTypeGroup.length) {
      messageTypeList = []
    }
    let participantIdList = this.participantIdGroup
    if (participantIdList.length === this.allParticipantIdList.length) {
      participantIdList = []
    }
    await this.$emit('filter', {
      messageTypeList,
      participantIdList
    })
  }

  private refresh(): void {
    this.messageTypeCodeGroup = this.allMessageTypeGroup
    this.participantIdGroup = this.allParticipantIdList
    this.filter()
  }

  private close(): void {
    this.$emit('close-modal')
  }

  private allMessageTypeOn(): void {
    this.messageTypeCodeGroup = this.allMessageTypeGroup
  }

  private allMessageTypeOff(): void {
    this.messageTypeCodeGroup = []
  }

  private reverseMessageType(): void {
    this.messageTypeCodeGroup = this.allMessageTypeGroup.filter(type => {
      return !this.messageTypeCodeGroup.includes(type)
    })
  }

  private allParticipantOn(): void {
    this.participantIdGroup = this.allParticipantIdList
  }

  private allParticipantOff(): void {
    this.participantIdGroup = []
  }

  private reverseParticipant(): void {
    this.participantIdGroup = this.allParticipantIdList.filter(id => {
      return !this.participantIdGroup.includes(id)
    })
  }
}
</script>

<style lang="scss"></style>
