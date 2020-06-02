<template>
  <div v-if="isLatestDay">
    <b-message class="m-b-5" size="is-small" type="is-default">
      <span v-html="villageSituationMessage.replace(/\n/g, '<br />')" />
    </b-message>
    <b-message
      v-if="isDispSuddenlyDeathMessage"
      size="is-small"
      type="is-warning"
      class="m-b-5"
    >
      <span v-html="suddenlyDeathMessage.replace(/\n/g, '<br />')" />
    </b-message>
    <b-message
      v-if="isSilentTime"
      size="is-small"
      type="is-warning"
      class="m-b-5"
    >
      <span v-html="silentTimeMessage.replace(/\n/g, '<br />')" />
    </b-message>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// type
import Village from '~/components/type/village'
import VillageParticipant from '~/components/type/village-participant'
import VillageTime from '~/components/type/village-time'
import Messages from '~/components/type/messages'
import { VILLAGE_STATUS } from '~/components/const/consts'

@Component({
  components: {}
})
export default class MessageCard extends Vue {
  @Prop({ type: Object })
  private village!: Village

  @Prop({ type: Boolean })
  private isLatestDay!: boolean

  @Prop({ type: Object })
  private messages!: Messages

  private get villageSituationMessage(): string {
    const status = this.village.status.code
    switch (status) {
      case VILLAGE_STATUS.PROLOGUE:
        return this.prologueMessage
      case VILLAGE_STATUS.PROGRESS:
        return this.progressMessage
      case VILLAGE_STATUS.EPILOGUE:
        return this.epilogueMessage
      case VILLAGE_STATUS.COMPLETE:
        return this.completeMessage
      case VILLAGE_STATUS.CANCEL:
        return this.cancelMessage
      default:
        return ''
    }
  }

  private get isDispSuddenlyDeathMessage(): boolean {
    return (
      this.isProgress &&
      this.isAvailableSuddenlyDeath &&
      this.existsNoSayMember &&
      !this.isSilentTime
    )
  }

  private get isProgress(): boolean {
    return this.village.status.code === VILLAGE_STATUS.PROGRESS
  }

  private get isAvailableSuddenlyDeath(): boolean {
    return this.village.setting.rules.available_suddenly_death
  }

  private get isSilentTime(): boolean {
    return this.village.silent_time
  }

  private get prologueMessage(): string {
    const minPersonCount = this.village.setting.capacity.min
    const capacity = this.village.setting.capacity.max
    const currentParticipantCount = this.village.participant.count
    const startDatetime = this.village.setting.time.start_datetime
    return currentParticipantCount < minPersonCount
      ? `${startDatetime}時点で${minPersonCount}人集まれば村が開始されます。`
      : `${startDatetime}に村が開始されます。`
  }

  private get progressMessage(): string {
    const isFirstDay =
      this.village.day.day_list[this.village.day.day_list.length - 1].day === 1
    if (isFirstDay) {
      return `${this.daychangeDatetime}に日付が更新されます。\n能力者は対象を選択してセットしてください。`
    } else {
      return `${this.daychangeDatetime}に日付が更新されます。\n処刑したい人に投票してください。\n能力者は対象を選択してセットしてください。`
    }
  }

  private get epilogueMessage(): string {
    const winCamp = this.village.win_camp!.name
    return `${winCamp}の勝利です。\n全てのログとユーザー名を公開します。\n今回の感想などを話し合いましょう。\n\n${this.daychangeDatetime}に村が終了します。`
  }

  private get completeMessage(): string {
    return 'この村は終了しました。'
  }

  private get cancelMessage(): string {
    return 'この村は廃村になりました。'
  }

  private get daychangeDatetime(): string {
    return this.village.day.day_list[this.village.day.day_list.length - 1]
      .day_change_datetime
  }

  private get suddenlyDeathMessage(): string {
    const noSayMemberNames = this.noSayMembers.map(
      member => member.chara.chara_name.full_name
    )
    return `日付更新までに通常発言がない人は突然死します。\n現在まで発言していない人\n${noSayMemberNames.join(
      '\n'
    )}`
  }

  private get existsNoSayMember(): boolean {
    return this.noSayMembers.length > 0
  }

  private get noSayMembers(): VillageParticipant[] {
    return this.village.participant.member_list
      .filter(member => !member.dead)
      .filter(member => this.sayCount(member.id) === 0)
  }

  private sayCount(participantId: number): number {
    return this.messages.today_message_count_map[participantId]
  }

  private get silentTimeMessage(): string {
    return `通常発言ができない時間です。\n${this.sayableTime}に通常発言できます。`
  }

  private get sayableTime(): string {
    const timeSetting = this.village.setting.time
    const silentHours = timeSetting.silent_hours
    const start = timeSetting.sayable_start.substring(0, 5)
    const end = timeSetting.sayable_end.substring(0, 5)
    const isNextday =
      parseInt(start.substring(0, 2)) > parseInt(end.substring(0, 2))
    return `${start} - ${isNextday ? '翌' : ''}${end}`
  }
}
</script>
