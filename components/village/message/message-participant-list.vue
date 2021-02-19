<template>
  <div class="card-content m-b-5" :class="$store.getters.isDarkTheme ? 'dark-theme' : ''">
    <div class="content has-text-left">
      <div class="hw-message-text">
        <strong>参加者一覧</strong>
        <div
          class="participant-area"
          v-for="participant in participantList"
          :key="participant.id"
        >
          <div class="face-area m-r-5">
            <chara-image :chara="participant.chara" :is-small="true" />
          </div>
          <div class="name-area is-size-7">
            <div class="chara-name">
              <p>{{ charaName(participant) }}</p>
              <p class="twitter-username">
                <a
                  :href="
                    `https://twitter.com/${participant.player.twitter_user_name}`
                  "
                  target="_blank"
                >
                  @{{ participant.player.twitter_user_name }}
                </a>
              </p>
              <p class="chara-status" :class="charaStatusClass(participant)">
                {{ charaStatus(participant) }}
              </p>
            </div>
            <div class="skill-area">
              <p class="skill">
                <strong>{{ participant.skill.name }}</strong>
                {{ skillRequest(participant) }}
              </p>
            </div>
          </div>
          <div class="button-area m-l-5 is-size-7">
            <b-button
              tag="nuxt-link"
              :to="{ path: '/player-record', query: { id: participant.player.id } }"
              target="_blank"
              size="is-small"
              icon-pack="fas"
              icon-left="chart-bar"
              type="is-primary"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Village from '~/components/type/village'
import VillageParticipant from '~/components/type/village-participant'
const charaImage = () => import('~/components/village/chara-image.vue')

@Component({
  components: { charaImage }
})
export default class ParticipantListMessage extends Vue {
  private get village(): Village {
    return this.$store.getters.getVillage!
  }

  private get participantList(): VillageParticipant[] {
    return this.village.participant.member_list
      .slice()
      .sort((vp1, vp2) => this.compareParticipant(vp1, vp2))
  }

  private compareParticipant(
    vp1: VillageParticipant,
    vp2: VillageParticipant
  ): number {
    // 死亡している人が先
    const vp1isDead = !!vp1.dead
    const vp2isDead = !!vp2.dead
    if (vp1isDead && !vp2isDead) return -1
    if (!vp1isDead && vp2isDead) return 1
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
  }

  private deadReasonPriority(reason: string) {
    if (reason === '突然') return 2
    if (reason === '処刑') return 1
    return 0
  }

  private charaName(participant: VillageParticipant): string {
    const fullName = participant.chara.chara_name.name
    if (fullName.length < 20) return fullName
    return fullName.substring(0, 20) + '...'
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

  private skillRequest(participant: VillageParticipant): string {
    const req1 = participant.skill_request!.first.name
    const req2 = participant.skill_request!.second.name
    return `（${req1}/${req2}希望）`
  }
}
</script>

<style lang="scss" scoped>
.card-content {
  padding: 10px !important;
  font-family: sans-serif;
  border: 1px solid #ccc;
  border-radius: 5px;

  &.dark-theme {
    border: 1px solid $white;
    color: $white;

    strong {
      color: #eee;
    }
  }
  &:not(.dark-theme) {
    color: $black;
  }

  .participant-area {
    display: flex;
    border-top: 0.5px solid #ccc;
    padding-top: 5px;
    padding-bottom: 5px;

    .name-area {
      flex: 1;
      display: flex;
      flex-direction: column;

      p {
        margin-bottom: 0;
      }

      .chara-name {
        margin-bottom: 5px;
        display: flex;

        p.twitter-username {
          margin-left: 5px;
        }

        .chara-status {
          flex: 1;
          text-align: right;
        }
      }

      .skill-area {
        margin-bottom: 0;
        display: flex;

        p.skill {
          flex: 1;
        }
      }
    }

    .button-area {
      padding-left: 10px;
      margin-top: auto;
      margin-bottom: auto;
    }
  }
}
</style>
