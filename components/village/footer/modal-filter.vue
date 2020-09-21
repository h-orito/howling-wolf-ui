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
          <b-field class="message-type-checkbox-area">
            <b-checkbox-button
              v-model="messageTypeCodeGroup"
              class="message-type-checkbox"
              native-value="NORMAL_SAY"
              type="is-primary"
              size="is-small"
            >
              通常
            </b-checkbox-button>
            <b-checkbox-button
              v-model="messageTypeCodeGroup"
              class="message-type-checkbox"
              native-value="WEREWOLF_SAY"
              type="is-primary"
              size="is-small"
            >
              囁き
            </b-checkbox-button>
            <b-checkbox-button
              v-model="messageTypeCodeGroup"
              class="message-type-checkbox"
              native-value="GRAVE_SAY"
              type="is-primary"
              size="is-small"
            >
              墓下見学
            </b-checkbox-button>
          </b-field>
          <b-field class="message-type-checkbox-area">
            <b-checkbox-button
              v-model="messageTypeCodeGroup"
              class="message-type-checkbox"
              native-value="MONOLOGUE_SAY"
              type="is-primary"
              size="is-small"
            >
              独り言
            </b-checkbox-button>
            <b-checkbox-button
              v-model="messageTypeCodeGroup"
              class="message-type-checkbox"
              native-value="SYSTEM"
              type="is-primary"
              size="is-small"
            >
              公開システム
            </b-checkbox-button>
            <b-checkbox-button
              v-model="messageTypeCodeGroup"
              class="message-type-checkbox"
              native-value="PRIVATE_SYSTEM"
              type="is-primary"
              size="is-small"
            >
              非公開システム
            </b-checkbox-button>
          </b-field>
        </section>
        <section class="m-t-20">
          <p style="font-weight: 700; margin-bottom: 6px;">キャラ</p>
          <b-field>
            <a @click="allParticipantOn">全てON</a>
            &nbsp;/&nbsp;
            <a @click="allParticipantOff">全てOFF</a>
            &nbsp;/&nbsp;
            <a @click="reverseParticipant">反転</a>
          </b-field>
          <div
            v-for="chunkParticipants in chunk(participantList, 2)"
            :key="chunkParticipants[0].id"
            class="columns m-l-0 m-r-0 is-mobile"
          >
            <div
              v-for="participant in chunkParticipants"
              :key="participant.id"
              class="participant-checkbox-area column is-6"
            >
              <b-checkbox
                v-model="participantIdGroup"
                :native-value="participant.id"
                size="is-small"
              >
                <div class="participant-area">
                  <div class="face-area m-r-5">
                    <chara-image :chara="participant.chara" :is-small="true" />
                  </div>
                  <div class="name-area is-size-7">
                    <p class="chara-name">
                      {{ participant.chara.chara_name.full_name }}
                    </p>
                  </div>
                </div>
              </b-checkbox>
            </div>
          </div>
        </section>
        <section class="m-t-20">
          <p style="font-weight: 700; margin-bottom: 6px;">キーワード</p>
          <b-field>
            <b-input
              v-model="keyword"
              size="is-small"
              placeholder="スペース区切り"
            />
          </b-field>
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
import { MESSAGE_TYPE, FACE_TYPE } from '~/components/const/consts'
const charaImage = () => import('~/components/village/chara-image.vue')

@Component({
  components: { charaImage }
})
export default class ModalFilter extends Vue {
  // ----------------------------------------------------------------
  // prop
  // ----------------------------------------------------------------
  @Prop({ type: Boolean })
  private isOpen!: boolean

  // ----------------------------------------------------------------
  // const
  // ----------------------------------------------------------------
  private messageTypeGroupMap: Map<string, string[]> = new Map([
    ['SYSTEM', [MESSAGE_TYPE.PUBLIC_SYSTEM, MESSAGE_TYPE.PARTICIPANTS]],
    [
      'PRIVATE_SYSTEM',
      [
        MESSAGE_TYPE.PRIVATE_SYSTEM,
        MESSAGE_TYPE.PRIVATE_SEER,
        MESSAGE_TYPE.PRIVATE_PSYCHIC,
        MESSAGE_TYPE.PRIVATE_WEREWOLF,
        MESSAGE_TYPE.PRIVATE_MASON
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
    'PRIVATE_SYSTEM',
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
  private keyword: string | null = null

  // ----------------------------------------------------------------
  // computed
  // ----------------------------------------------------------------
  private get village(): Village | null {
    return this.$store.getters.getVillage
  }

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
    if (!this.village) return false
    return (
      this.messageTypeCodeGroup.length !== this.allMessageTypeGroup.length ||
      (this.participantIdGroup.length !== 0 &&
        this.participantIdGroup.length !== this.village!.participant.count)
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
    const keyword = this.keyword
    await this.$emit('filter', {
      messageTypeList,
      participantIdList,
      keyword
    })
    this.$store.dispatch('STORE_FILTERING', {
      isFiltering: this.isFiltering
    })
  }

  private refresh(): void {
    this.messageTypeCodeGroup = this.allMessageTypeGroup
    this.participantIdGroup = this.allParticipantIdList
    this.keyword = null
    this.filter()
  }

  private charaFilter(participant: VillageParticipant): void {
    this.messageTypeCodeGroup = this.allMessageTypeGroup
    this.participantIdGroup = [participant.id]
    this.keyword = null
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

  private chunk<T extends any[]>(arr: T, size: number): Array<Array<T>> {
    return arr.reduce(
      (newarr, _, i) =>
        i % size ? newarr : [...newarr, arr.slice(i, i + size)],
      [] as T[][]
    )
  }
}
</script>

<style lang="scss" scoped>
/** header, footerを隠さない */
.modal-card {
  max-height: calc(100vh - 6.5rem);
}

.message-type-checkbox-area {
  display: flex;

  .message-type-checkbox {
    flex: 1;
  }
}

.participant-checkbox-area {
  border-top: 0.5px solid #999;
  padding: 0;

  .participant-area {
    display: flex;

    padding-top: 5px;
    padding-bottom: 5px;

    .name-area {
      flex: 1;
      display: flex;
      flex-direction: column;

      .chara-name {
        margin-bottom: 5px;
      }

      .chara-situation {
        margin-bottom: 0;
        color: #ccc;
        display: flex;

        p.left-count {
          flex: 1;
          text-align: right;
        }
      }
    }
  }
}
</style>
