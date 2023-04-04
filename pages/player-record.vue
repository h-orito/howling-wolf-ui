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
        <p v-if="!hasIntroduced" class="has-text-danger is-size-7 m-b-20">
          まだ誰からも招待を受けていないプレイヤーです。
        </p>
        <div v-if="isMyself && !hasIntroduced" class="p-5 m-b-20">
          <p class="is-size-7">
            招待してくれた方にURLを伝え、「招待して入村できるようにする」ボタンを押してもらってください。
          </p>
          <b-button
            class="m-t-5"
            type="is-primary"
            size="is-small"
            @click="copyUrl"
            >URLをコピー</b-button
          >
        </div>
        <div v-if="canIntroduce && !hasIntroduced" class="m-b-20">
          <p class="is-size-7 has-text-danger m-b-10 ">
            荒らし対策のため、1名以上から招待されていないと入村できないようにしています。<br />
            招待する場合、このプレイヤーに規約やルールを守らせるようお願いします。
          </p>
          <b-button type="is-primary" size="is-small" @click="introduce"
            >招待して入村できるようにする</b-button
          >
        </div>
        <div v-if="canIntroduce && introducing" class="m-b-20">
          <p class="is-size-7 m-b-10 ">
            あなたはこのプレイヤーを招待しています。
          </p>
          <b-button
            v-if="introducing"
            type="is-danger"
            size="is-small"
            @click="removeIntroduce"
            >招待を取り消す</b-button
          >
        </div>
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
          <div v-if="isMyself" class="m-t-20">
            <b-button
              v-if="isMyself"
              type="is-primary"
              size="is-small"
              @click="isModalOpen = true"
              >編集する</b-button
            >
            <modal-intro
              :is-open="isModalOpen"
              :current-nickname="nickname"
              :current-other-site-name="player.other_site_name"
              :current-intro="player.introduction"
              :blacklist-players="blacklistPlayers"
              @close-modal="isModalOpen = false"
              @remove-blacklist="removeBlacklistById($event)"
              @refresh="refresh"
            />
          </div>
          <div v-if="user && !isMyself">
            <b-button
              class="m-t-20"
              v-if="!containsBlacklist"
              type="is-warning"
              size="is-small"
              @click="addBlacklist"
              :disabled="blacklistPlayers.length >= 5"
              >ブラックリスト対象に追加する</b-button
            >
            <b-button
              class="m-t-20"
              v-if="containsBlacklist"
              type="is-danger"
              size="is-small"
              @click="removeBlacklist"
              >ブラックリスト対象から外す</b-button
            >
          </div>
        </div>
        <player-record-chart :player-records="playerRecords" />
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
import firebase from '~/plugins/firebase'
// components
import loading from '~/components/loading.vue'
import modalIntro from '~/components/player-record/modal-intro.vue'
// type
import PlayerRecords from '~/components/type/player-records'
import MyselfPlayer from '~/components/type/myself-player'
import Player from '~/components/type/player'

const participateVillageList = () =>
  import('~/components/player-record/participate-village-list.vue')
const playerRecordChart = () =>
  import('~/components/player-record/player-record-chart.vue')

@Component({
  components: {
    loading,
    playerRecordChart,
    participateVillageList,
    modalIntro
  },
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

  /** computed */
  private get blacklistPlayers(): Player[] {
    if (!this.user) return []
    return this.user.blacklist_players
  }

  private get player(): Player {
    return this.playerRecords!.player
  }

  private get playerName(): string {
    if (this.player.twitter_user_name) {
      return `${this.player.nickname}@${this.player.twitter_user_name}`
    } else {
      return this.player.nickname
    }
  }

  private get nickname(): string {
    if (this.loadingRecords || !this.playerRecords) return ''
    return this.playerRecords.player.nickname
  }

  private get isMyself(): boolean {
    if (!this.user) return false
    if (this.loadingRecords || !this.playerRecords) return false
    return this.user.id === this.playerRecords.player.id
  }

  // 紹介
  private get canIntroduce(): boolean {
    return (
      !!this.user &&
      !this.isMyself &&
      this.user.participate_finished_villages.list.length > 0
    )
  }

  private get hasIntroduced(): boolean {
    if (!this.playerRecords?.player) return false
    return this.playerRecords.player.introduced
  }

  private get introducing(): boolean {
    if (!this.user) return false
    return this.user.introduce_players.some(
      ip => ip.id === this.playerRecords?.player.id
    )
  }

  private get isAlreadyAuthenticated(): boolean {
    return this.$store.getters.isAuthenticated
  }

  /** created */
  private async created(): Promise<any> {
    await this.auth()
    this.user = this.$store.getters.getPlayer
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

  private async introduce(): Promise<void> {
    await this.$axios.$post(`/player/introduce/${this.playerId}`)
    location.reload()
  }

  private async removeIntroduce(): Promise<void> {
    await this.$axios.$post(`/player/remove-introduce/${this.playerId}`)
    location.reload()
  }

  private get introductionLines(): string[] {
    return escapeAndSplitMessage(this.player.introduction!)
  }

  private copyUrl() {
    const text = `https://howling-wolf.com/player-record?id=${this.playerId}`
    // @ts-ignore
    this.$copyText(text)
    this.$buefy.toast.open({
      message: `クリップボードにコピーしました: ${text}`,
      type: 'is-info',
      position: 'is-top'
    })
  }
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
