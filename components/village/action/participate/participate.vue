<template>
  <action-card :title="'参加する'">
    <template v-slot:content>
      <div class="content has-text-left">
        <p style="font-weight: 700; margin-bottom: 6px;">キャラ</p>
        <b-field>
          <b-select v-model="charaId" expanded size="is-small">
            <option
              v-for="chara in situation.participate.selectable_chara_list"
              :value="chara.id.toString()"
              :key="chara.id.toString()"
              >{{ chara.chara_name.name }}</option
            >
          </b-select>
          <p class="control">
            <button class="button is-primary is-small" @click="openModal">
              画像で選択
            </button>
            <b-modal
              :active.sync="isCharaSelectModalOpen"
              has-modal-card
              trap-focus
              aria-role="dialog"
              aria-modal
            >
              <chara-select-modal
                :chara-list="situation.participate.selectable_chara_list"
                @chara-select="charaSelect($event)"
              />
            </b-modal>
          </p>
        </b-field>
        <b-field
          v-if="situation.skill_request.available_skill_request"
          label="役職第1希望"
          custom-class="is-small"
        >
          <b-select v-model="firstRequestSkillCode" expanded size="is-small">
            <option
              v-for="skill in situation.skill_request.selectable_skill_list"
              :value="skill.code"
              :key="skill.code"
              >{{ skill.name }}</option
            >
          </b-select>
        </b-field>
        <b-field
          v-if="situation.skill_request.available_skill_request"
          custom-class="is-small"
          label="役職第2希望"
        >
          <b-select v-model="secondRequestSkillCode" expanded size="is-small">
            <option
              v-for="skill in situation.skill_request.selectable_skill_list"
              :value="skill.code"
              :key="skill.code"
              >{{ skill.name }}</option
            >
          </b-select>
        </b-field>
        <b-field custom-class="is-small" label="入村発言">
          <message-input
            v-model="message"
            :situation="situation.say"
            :message-type="normalSay"
            ref="messageInput"
          />
        </b-field>
      </div>
    </template>
    <template v-slot:footer>
      <b-button
        :disabled="!canSubmit || confirming"
        @click="confirmParticipate"
        type="is-primary"
        size="is-small"
        >入村確認</b-button
      >
      <modal-participate
        :is-open="isParticipateModalOpen"
        :confirm-message="confirmMessage"
        :village="village"
        @close="closeParticipateModal"
        @participate="participate"
      />
    </template>
  </action-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import actionCard from '~/components/village/action/action-card.vue'
import messageInput from '~/components/village/action/message-input.vue'
import charaSelectModal from '~/components/village/action/participate/chara-select-modal.vue'
// type
import Village from '~/components/type/village'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import Message from '~/components/type/message'
import { MESSAGE_TYPE } from '~/components/const/consts'
const modalParticipate = () =>
  import('~/components/village/action/participate/modal-participate.vue')

@Component({
  components: { actionCard, messageInput, charaSelectModal, modalParticipate }
})
export default class Participate extends Vue {
  @Prop({ type: Object })
  private village!: Village

  @Prop({ type: Object })
  private situation!: SituationAsParticipant

  private confirming: boolean = false

  private charaId: number | null = null
  private firstRequestSkillCode: string | null =
    this.situation.skill_request.skill_request == null
      ? 'LEFTOVER'
      : this.situation.skill_request.skill_request.first.code

  private secondRequestSkillCode: string | null =
    this.situation.skill_request.skill_request == null
      ? 'LEFTOVER'
      : this.situation.skill_request.skill_request.second.code

  private message: string = ''

  private isCharaSelectModalOpen = false
  private isParticipateModalOpen = false

  /** 入村確認 */
  private confirmMessage: Message | null = null

  private get normalSay(): string {
    return MESSAGE_TYPE.NORMAL_SAY
  }

  // 参加ボタンを押下できるか
  private get canSubmit(): boolean {
    return (
      this.charaId != null &&
      this.firstRequestSkillCode != null &&
      this.secondRequestSkillCode != null &&
      this.message != null &&
      this.message.length > 0 &&
      !this.isOver
    )
  }

  private get isOver(): boolean {
    return (this.$refs as any).messageInput.existsOver
  }

  private async confirmParticipate(): Promise<void> {
    this.confirming = true
    try {
      this.confirmMessage = await this.$axios.$post(
        `/village/${this.village!.id}/participate-confirm`,
        {
          chara_id: this.charaId,
          first_request_skill: this.firstRequestSkillCode,
          second_request_skill: this.secondRequestSkillCode,
          join_message: this.message,
          join_password: null,
          spectator: false
        }
      )
    } catch (error) {}
    this.confirming = false
    this.isParticipateModalOpen = true
  }

  private async participate(): Promise<void> {
    try {
      await this.$axios.$post(`/village/${this.village!.id}/participate`, {
        chara_id: this.charaId,
        first_request_skill: this.firstRequestSkillCode,
        second_request_skill: this.secondRequestSkillCode,
        join_message: this.message,
        join_password: null,
        spectator: false
      })
    } catch (error) {}
    this.$emit('reload')
  }

  private closeParticipateModal(): void {
    this.isParticipateModalOpen = false
  }

  private openModal(): void {
    this.isCharaSelectModalOpen = true
  }

  private charaSelect({ charaId }): void {
    this.charaId = charaId
    this.isCharaSelectModalOpen = false
  }
}
</script>
