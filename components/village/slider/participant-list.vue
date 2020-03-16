<template>
  <div class="m-b-10">
    <div
      class="participant-area"
      v-for="participant in participantList"
      :key="participant.id"
    >
      <div class="face-area m-r-5">
        <img
          :src="imageUrl(participant)"
          :width="imageWidth(participant)"
          :height="imageHeight(participant)"
          class="chara-image"
        />
      </div>
      <div class="name-area is-size-7">
        <p class="chara-name">{{ charaName(participant) }}</p>
        <div class="chara-situation">
          <p :class="charaStatusClass(participant)">
            {{ charaStatus(participant) }}
          </p>
          <p class="left-count">{{ remainingCount(participant) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Village from '~/components/type/village'
import VillageParticipant from '~/components/type/village-participant'
import Messages from '~/components/type/messages'
import {
  VILLAGE_STATUS,
  FACE_TYPE,
  MESSAGE_TYPE
} from '~/components/const/consts'

@Component({
  components: {}
})
export default class VillageSlider extends Vue {
  @Prop({ type: Object })
  private village!: Village

  @Prop({ type: Object })
  private messages?: Messages | null

  private get participantList(): VillageParticipant[] {
    return this.village!.participant.member_list.slice().sort((vp1, vp2) => {
      // 死亡している人より死亡していない人が先
      const vp1isDead = !!vp1.dead
      const vp2isDead = !!vp2.dead
      if (vp1isDead && !vp2isDead) return 1
      if (!vp1isDead && vp2isDead) return -1
      // どちらも死亡していなければ等価
      if (!vp1isDead && !vp2isDead) return 0
      // どちらも死亡している場合は日付が早い順
      const vp1DeadDay = vp1.dead!.village_day.day
      const vp2DeadDay = vp2.dead!.village_day.day
      if (vp1DeadDay !== vp2DeadDay) return vp1DeadDay - vp2DeadDay
      // 日付も同じ場合は凸->処刑->他
      const vp1DeadReason = vp1.dead!.reason
      const vp2DeadReason = vp2.dead!.reason
      return (
        this.deadReasonPriority(vp2DeadReason) -
        this.deadReasonPriority(vp1DeadReason)
      )
    })
  }

  private deadReasonPriority(reason: string) {
    if (reason === '突然死') return 2
    if (reason === '処刑') return 1
    return 0
  }

  private imageUrl(participant: VillageParticipant): string {
    return participant.chara.face_list.find(
      face => face.type === FACE_TYPE.NORMAL
    )!.image_url
  }

  private imageWidth(participant: VillageParticipant): number {
    return participant.chara.display.width / 2
  }

  private imageHeight(participant: VillageParticipant): number {
    return participant.chara.display.height / 2
  }

  private charaName(participant: VillageParticipant): string {
    const fullName = participant.chara.chara_name.full_name
    if (fullName.length < 18) return fullName
    return fullName.substring(0, 18) + '...'
  }

  private charaStatus(participant: VillageParticipant): string {
    if (!participant.dead) return '生存'
    const day = participant.dead.village_day.day
    const reason = participant.dead.reason
    return `${day}d${reason}`
  }

  private charaStatusClass(participant: VillageParticipant): string {
    if (!participant.dead) return ''
    const reason = participant.dead.reason
    if (reason === '突然' || reason === '処刑') return 'has-text-info'
    return 'has-text-danger'
  }

  private remainingCount(participant: VillageParticipant): string {
    const sayCount = this.sayCount(participant.id)
    return `${sayCount}回発言`
  }

  private sayCount(participantId: number): number {
    if (!this.messages) return 0
    return this.messages.today_message_count_map[participantId]
  }
}
</script>

<style lang="scss" scoped>
.participant-area {
  display: flex;
  border-top: 0.5px solid #999;
  padding-top: 5px;
  padding-bottom: 5px;

  .face-area {
    .chara-image {
      vertical-align: bottom;
      border-radius: 5px;
    }
  }

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
</style>
