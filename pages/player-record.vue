<template>
  <section class="section">
    <div class="container">
      <loading
        v-if="loadingRecords"
        :message="'戦績を読み込み中...'"
        :fixed="true"
      ></loading>
      <div v-if="!loadingRecords && playerRecords">
        <h1 class="title is-5 m-b-30" v-if="playerName">{{ playerName }}</h1>
        <h2 class="title is-size-6">自己紹介</h2>
        <div class="m-b-20">
          <p class="is-size-7 m-b-20">
            他人狼サイトでのID:
            {{ player.other_site_name ? player.other_site_name : '未登録' }}
          </p>
          <div v-if="player.introduction" class="is-size-7 has-text-left">
            <p
              v-for="intro in introductionLines"
              :key="intro.id"
              v-html="intro"
              style="word-break: break-word;"
            ></p>
          </div>
          <b-button
            class="m-t-20"
            v-if="isMyself"
            type="is-primary"
            size="is-small"
            @click="isModalOpen = true"
            >編集する</b-button
          >
          <b-button
            class="m-t-20"
            v-if="user && !isMyself && !containsBlacklist"
            type="is-warning"
            size="is-small"
            @click="addBlacklist"
            :disabled="blacklistPlayers.length >= 5"
            >ブラックリスト対象に追加する</b-button
          >
          <b-button
            class="m-t-20"
            v-if="user && !isMyself && containsBlacklist"
            type="is-danger"
            size="is-small"
            @click="removeBlacklist"
            >ブラックリスト対象から外す</b-button
          >
          <modal-intro
            :is-open="isModalOpen"
            :current-other-site-name="player.other_site_name"
            :current-intro="player.introduction"
            :blacklist-players="blacklistPlayers"
            @close-modal="isModalOpen = false"
            @remove-blacklist="removeBlacklistById($event)"
            @refresh="refresh"
          />
        </div>
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
import firebase from '~/plugins/firebase'
// components
import loading from '~/components/loading.vue'
import modalIntro from '~/components/player-record/modal-intro.vue'
// type
import PlayerRecords from '~/components/type/player-records'
import CampRecord from '~/components/type/camp-record'
import SkillRecord from '~/components/type/skill-record'
import MyselfPlayer from '~/components/type/myself-player'
import Player from '~/components/type/player'

const doughnutChart = () =>
  import('~/components/player-record/doughnut-chart.vue')
const participateVillageList = () =>
  import('~/components/player-record/participate-village-list.vue')

@Component({
  components: { loading, doughnutChart, participateVillageList, modalIntro },
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
  private playerId: string = '0'
  private playerRecords: PlayerRecords | null = null
  private loadingRecords: boolean = false
  private isModalOpen: boolean = false
  private user: MyselfPlayer | null = null

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

  /** computed */
  private get blacklistPlayers(): Player[] {
    if (!this.user) return []
    return this.user.blacklist_players
  }

  private get player(): Player {
    return this.playerRecords!.player
  }

  private get playerName(): string {
    return `${this.player.nickname}@${this.player.twitter_user_name}`
  }

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

  private get isMyself(): boolean {
    if (!this.user) return false
    if (this.loadingRecords || !this.playerRecords) return false
    return this.user.id === this.playerRecords.player.id
  }

  private get isAlreadyAuthenticated(): boolean {
    return this.$store.getters.isAuthenticated
  }

  /** created */
  private async created(): Promise<any> {
    await this.auth()
    await this.loadUser()
    await this.loadRecord()
  }

  /** methods */
  private async auth(): Promise<void> {
    // 認証済みなら何もしない
    if (this.isAlreadyAuthenticated) return
    const user = await new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => resolve(user))
    })
    await this.$store.dispatch('LOGINOUT', {
      user
    })
  }

  private async loadUser(): Promise<void> {
    this.user = await this.$axios.$get('/my-player')
  }

  private async loadRecord(): Promise<void> {
    this.loadingRecords = true
    try {
      this.playerRecords = await this.$axios.$get(
        `/player/${this.playerId}/record`
      )
    } catch (error) {}
    this.loadingRecords = false
  }

  private async refresh(): Promise<void> {
    await this.loadRecord()
  }

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

  private get containsBlacklist(): boolean {
    return this.blacklistPlayers.some(it => it.id === parseInt(this.playerId))
  }

  private async addBlacklist(): Promise<void> {
    await this.$axios.$post(
      `/player/blacklist-player/register/${this.playerId}`
    )
    await this.loadUser()
  }

  private async removeBlacklist(): Promise<void> {
    await this.removeBlacklistById({
      id: this.playerId
    })
  }

  private async removeBlacklistById({ id }): Promise<void> {
    await this.$axios.$post(`/player/blacklist-player/remove/${id}`)
    await this.loadUser()
  }

  private get skillRecordChunks(): SkillRecord[][][] {
    return chunk(this.playerRecords!.skill_record_list, 2)
  }

  private get introductionLines(): string[] {
    return escapeAndSplitMessage(this.player.introduction!)
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

const escapeAndSplitMessage = (message: string): string[] => {
  return message
    .replace(/(\r\n|\n|\r)/gm, '<br>')
    .split('<br>')
    .map(item => {
      item = item
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
      return item
    })
}
</script>

<style lang="scss" scoped>
.chart-container {
  position: relative;
}
.b-table {
  overflow: auto;
  white-space: nowrap;
}
</style>
