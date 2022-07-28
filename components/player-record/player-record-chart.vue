<template>
  <div class="columns">
    <div class="column is-6">
      <h2 class="title is-size-6">総合戦績</h2>
      <div class="columns is-mobile">
        <div class="column is-12 chart-container m-b-20">
          <doughnut-chart
            :chart-data="wholeData"
            :options="chart.option"
            :styles="chart.styles"
            :text="'全体'"
          />
          <div>
            <p class="is-size-7">{{ wholeResult }}</p>
          </div>
        </div>
      </div>
      <h2 class="title is-size-6">陣営戦績</h2>
      <div class="columns is-mobile">
        <div
          v-for="campRecord in playerRecords.camp_record_list"
          :key="campRecord.camp.code"
          class="column is-4 chart-container m-b-20"
        >
          <doughnut-chart
            :chart-data="campData(campRecord)"
            :options="chart.option"
            :styles="chart.styles"
            :text="campRecord.camp.name"
          />
          <p class="is-size-7">{{ campResult(campRecord) }}</p>
        </div>
      </div>
    </div>
    <div class="column is-6">
      <h2 class="title is-size-6">役職戦績</h2>
      <div class="m-b-20">
        <div
          v-for="chunkRecords in skillRecordChunks"
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
              :options="chart.option"
              :styles="chart.styles"
              :text="skillRecord.skill.name"
            />
            <p class="is-size-7">{{ skillResult(skillRecord) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { ChartData } from 'chart.js'
// component
// type
import PlayerRecords from '~/components/type/player-records'
import CampRecord from '~/components/type/camp-record'
import SkillRecord from '~/components/type/skill-record'

const doughnutChart = () =>
  import('~/components/player-record/doughnut-chart.vue')

@Component({
  components: {
    doughnutChart
  }
})
export default class PlayerRecordChart extends Vue {
  @Prop({ type: Object })
  private playerRecords!: PlayerRecords | null

  private chart = {
    option: {
      legend: {
        display: false
      }
    },
    styles: {
      height: '100%',
      width: '100%'
    }
  }

  /** data */

  /** computed */
  private get wholeData(): ChartData {
    const wholeRecords = this.playerRecords!.whole_record
    return chartData(wholeRecords.win_count, this.wholeLoseCount)
  }

  private get wholeLoseCount(): number {
    const wholeRecords = this.playerRecords!.whole_record
    return wholeRecords.participate_count - wholeRecords.win_count
  }

  private get wholeResult(): string {
    const wholeRecords = this.playerRecords!.whole_record
    return titleString(
      wholeRecords.win_count,
      this.wholeLoseCount,
      wholeRecords.win_rate
    )
  }

  private get skillRecordChunks(): SkillRecord[][][] {
    return chunk(this.playerRecords!.skill_record_list, 2)
  }

  /** methods */
  private campData(campRecord: CampRecord): ChartData {
    return chartData(campRecord.win_count, this.campLoseCount(campRecord))
  }

  private campLoseCount(campRecord: CampRecord): number {
    return campRecord.participate_count - campRecord.win_count
  }

  private campResult(campRecord: CampRecord): string {
    return titleString(
      campRecord.win_count,
      this.campLoseCount(campRecord),
      campRecord.win_rate
    )
  }

  private skillData(skillRecord: SkillRecord): ChartData {
    return chartData(skillRecord.win_count, this.skillLoseCount(skillRecord))
  }

  private skillLoseCount(skillRecord: SkillRecord): number {
    return skillRecord.participate_count - skillRecord.win_count
  }

  private skillResult(skillRecord: SkillRecord): string {
    return titleString(
      skillRecord.win_count,
      this.skillLoseCount(skillRecord),
      skillRecord.win_rate
    )
  }
}

const chartData = (winNum: number, loseNum: number): ChartData => {
  if (winNum === 0 && loseNum === 0) return emptyData
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

const emptyData: ChartData = {
  labels: ['no data'],
  datasets: [
    {
      data: [1],
      backgroundColor: ['#ccc'],
      borderColor: 'transparent'
    }
  ]
}

const titleString = (
  winCount: number,
  loseCount: number,
  winRate: number
): string => {
  return `${winCount}勝${loseCount}負 (${winRate * 100}%)`
}

const chunk = <T extends any[]>(arr: T, size: number): Array<Array<T>> => {
  return arr.reduce(
    (newarr, _, i) => (i % size ? newarr : [...newarr, arr.slice(i, i + size)]),
    [] as T[][]
  )
}
</script>
