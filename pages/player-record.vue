<template>
  <section class="section">
    <div class="container">
      <loading
        v-if="loadingRecords"
        :message="'戦績を読み込み中...'"
        :fixed="true"
      ></loading>
      <div v-if="!loadingRecords && !playerRecords">
        <p>戦績がありません。</p>
      </div>
      <div v-if="!loadingRecords && playerRecords">
        <h1 class="title is-5 m-b-30" v-if="playerName">{{ playerName }}</h1>
        <div class="columns">
          <div class="column is-6">
            <h2 class="title is-size-5">総合戦績</h2>
            <div class="columns is-mobile">
              <div class="column is-12 chart-container m-b-20">
                <doughnut-chart
                  :chart-data="wholeData"
                  :options="chartOption"
                  :styles="chartStyles"
                  :text="'全体'"
                />
                <div>
                  <p class="is-size-7">{{ wholeResult }}</p>
                </div>
              </div>
            </div>
            <h2 class="title is-size-5">陣営戦績</h2>
            <div class="columns is-mobile">
              <div
                v-for="campRecord in playerRecords.camp_record_list"
                :key="campRecord.camp.code"
                class="column is-4 chart-container m-b-20"
              >
                <doughnut-chart
                  :chart-data="campData(campRecord)"
                  :options="chartOption"
                  :styles="chartStyles"
                  :text="campRecord.camp.name"
                />
                <p class="is-size-7">{{ campResult(campRecord) }}</p>
              </div>
            </div>
          </div>
          <div class="column is-6">
            <h2 class="title is-size-5">役職戦績</h2>
            <div class="m-b-20">
              <div
                v-for="chunkRecords in chunk(
                  playerRecords.skill_record_list,
                  2
                )"
                :key="chunkRecords[0].skill.code"
                class="columns is-mobile"
              >
                <div
                  v-for="skillRecord in chunkRecords"
                  :key="skillRecord.skill.code"
                  class="column is-6 chart-container m-b-20"
                >
                  <doughnut-chart
                    :chart-data="skillData(skillRecord)"
                    :options="chartOption"
                    :styles="chartStyles"
                    :text="skillRecord.skill.name"
                  />
                  <p class="is-size-7">{{ skillResult(skillRecord) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h2 class="title is-size-5">参加した村</h2>
        <participate-village-list
          :participate-village-list="playerRecords.participate_village_list"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ChartData, ChartOptions } from 'chart.js'
// components
import loading from '~/components/loading.vue'
// type
import PlayerRecords from '~/components/type/player-records'
import CampRecord from '~/components/type/camp-record'
import SkillRecord from '~/components/type/skill-record'
import ParticipateVillage from '~/components/type/participate-village'

const doughnutChart = () =>
  import('~/components/player-record/doughnut-chart.vue')
const participateVillageList = () =>
  import('~/components/player-record/participate-village-list.vue')

@Component({
  components: { loading, doughnutChart, participateVillageList },
  asyncData({ query }) {
    return { playerId: query.id }
  }
})
export default class extends Vue {
  /** head */
  private head() {
    return { title: ' | ユーザ戦績' }
  }

  /** data */
  private playerId: number = 0
  private playerRecords: PlayerRecords | null = null
  private loadingRecords: boolean = false

  private emptyData: ChartData = {
    labels: ['no data'],
    datasets: [
      {
        data: [1],
        backgroundColor: ['#ccc'],
        borderColor: 'transparent'
      }
    ]
  }

  private chartOption: ChartOptions = {
    legend: {
      display: false
    }
  }

  private chartStyles = {
    height: '100%',
    width: '100%'
  }

  /** computed */
  private get playerName(): string {
    if (this.loadingRecords || !this.playerRecords) return ''
    const player = this.playerRecords.player
    return `${player.nickname}@${player.twitter_user_name}`
  }

  private get wholeData(): ChartData {
    const wholeRecords = this.playerRecords!.whole_record
    return this.chartData(wholeRecords.win_count, this.wholeLoseCount)
  }

  private get wholeLoseCount(): number {
    const wholeRecords = this.playerRecords!.whole_record
    return wholeRecords.participate_count - wholeRecords.win_count
  }

  private get wholeResult(): string {
    const wholeRecords = this.playerRecords!.whole_record
    return this.titleString(
      wholeRecords.win_count,
      this.wholeLoseCount,
      wholeRecords.win_rate
    )
  }

  /** created */
  private async created(): Promise<any> {
    this.loadingRecords = true
    try {
      this.playerRecords = await this.$axios.$get(
        `/player/${this.playerId}/record`
      )
    } catch (error) {}
    this.loadingRecords = false
  }

  /** methods */
  private chartData(winNum: number, loseNum: number): ChartData {
    if (winNum === 0 && loseNum === 0) return this.emptyData
    return {
      labels: ['win', 'lose'],
      datasets: [
        {
          data: [winNum, loseNum],
          backgroundColor: ['rgb(86,161,229,1)', 'rgb(237,111,133,1)'],
          borderColor: 'transparent'
        }
      ]
    }
  }

  private titleString(
    winCount: number,
    loseCount: number,
    winRate: number
  ): string {
    return `${winCount}勝${loseCount}負 (${winRate * 100}%)`
  }

  private campData(campRecord: CampRecord): ChartData {
    return this.chartData(campRecord.win_count, this.campLoseCount(campRecord))
  }

  private campLoseCount(campRecord: CampRecord): number {
    return campRecord.participate_count - campRecord.win_count
  }

  private campResult(campRecord: CampRecord): string {
    return this.titleString(
      campRecord.win_count,
      this.campLoseCount(campRecord),
      campRecord.win_rate
    )
  }

  private skillData(skillRecord: SkillRecord): ChartData {
    return this.chartData(
      skillRecord.win_count,
      this.skillLoseCount(skillRecord)
    )
  }

  private skillLoseCount(skillRecord: SkillRecord): number {
    return skillRecord.participate_count - skillRecord.win_count
  }

  private skillResult(skillRecord: SkillRecord): string {
    return this.titleString(
      skillRecord.win_count,
      this.skillLoseCount(skillRecord),
      skillRecord.win_rate
    )
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

<style lang="scss">
.chart-container {
  position: relative;
}
.b-table {
  overflow: auto;
  white-space: nowrap;
}
</style>
