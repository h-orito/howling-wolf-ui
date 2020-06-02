<template>
  <div>
    <div class="content is-size-7">
      <b-table :data="tableVillages" :mobile-cards="false">
        <template slot-scope="props">
          <b-table-column field="village_name" label="村名">
            <nuxt-link
              :to="{ path: 'village', query: { id: props.row.village_id } }"
              >{{ props.row.village_name }}</nuxt-link
            >
          </b-table-column>

          <b-table-column field="participant_count" label="人数">
            {{ props.row.participant_count + `(${props.row.organization})` }}
          </b-table-column>

          <b-table-column field="chara" label="キャラ">
            {{ props.row.chara.chara_name.full_name }}
          </b-table-column>

          <b-table-column field="chara" label="役職">
            {{ props.row.skill }}
          </b-table-column>

          <b-table-column field="status" label="生死">
            {{ props.row.status }}
          </b-table-column>

          <b-table-column field="camp" label="陣営">
            {{ props.row.camp }}
          </b-table-column>

          <b-table-column field="win_status" label="勝敗">
            {{ props.row.win_status }}
          </b-table-column>
        </template>

        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>終了した村はありません</p>
            </div>
          </section>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// component
// type
import ParticipateVillage from '~/components/type/participate-village'
import Village from '~/components/type/village'
import VillageParticipant from '~/components/type/village-participant'
import { FACE_TYPE } from '~/components/const/consts'

@Component({
  components: {}
})
export default class ParticipantVillageList extends Vue {
  @Prop({ type: Array })
  private participateVillageList!: ParticipateVillage[]

  /** data */

  /** computed */
  private get tableVillages(): any[] {
    return this.participateVillageList.map(
      (participateVillage: ParticipateVillage) => ({
        village_id: participateVillage.village.id,
        village_name: participateVillage.village.name,
        participant_count: `${participateVillage.village.participant.count}人`,
        organization:
          participateVillage.village.setting.organizations.organization[
            participateVillage.village.participant.count
          ],
        chara: participateVillage.participant.chara,
        chara_image: this.charaImage(participateVillage.participant),
        chara_width: this.charaImageWidth(participateVillage.participant),
        chara_height: this.charaImageHeight(participateVillage.participant),
        status: this.status(participateVillage.participant),
        skill: participateVillage.participant.skill!.name,
        camp: participateVillage.participant.skill!.win_judge_camp.name,
        win_status: participateVillage.participant.win ? '勝利' : '敗北'
      })
    )
  }

  /** methods */
  private charaImage(participant: VillageParticipant): string {
    return participant.chara.face_list.find(
      face => face.type === FACE_TYPE.NORMAL
    )!.image_url
  }

  private charaImageWidth(participant: VillageParticipant): number {
    return participant.chara.display.width
  }

  private charaImageHeight(participant: VillageParticipant): number {
    return participant.chara.display.height
  }

  private status(participant: VillageParticipant): string {
    if (!participant.dead) return '生存'
    const deadDay = participant.dead.village_day.day
    const reason = participant.dead.reason
    return `${deadDay}d ${reason}死`
  }
}
</script>

<style lang="scss" scoped></style>
