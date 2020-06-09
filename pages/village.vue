<template>
  <div class="is-size-7 village-wrapper">
    <div v-if="!$window.isMobile" class="village-leftside-wrapper">
      <village-slider
        :village="village"
        :charachip-name="charachipName"
        :is-expanded="isSliderExpanded"
        :messages="messages"
        @refresh="reload"
        @filter="filter($event)"
        @hide-slider="hideSlider"
        ref="slider"
      />
    </div>
    <div class="village-rightside-wrapper">
      <village-header
        class="village-header-wrapper"
        :current-village-day="displayVillageDay"
        :village="village"
        @to-head="toHead"
        @current-day-change="changeDisplayDay($event)"
      />
      <div
        class="village-main-wrapper"
        :style="
          $window.isMobile
            ? 'max-width: 100vw;'
            : 'max-width: calc(100vw - 280px);'
        "
      >
        <loading
          v-if="loadingVillage"
          :message="'村情報を読み込み中...'"
          :fixed="true"
        ></loading>
        <loading
          v-if="loadingMessage"
          :message="'発言を読み込み中...'"
          :fixed="true"
        ></loading>
        <loading
          v-if="!loadingMessage && loadingSituation"
          :message="'参加状況を読み込み中...'"
          :fixed="true"
        ></loading>
        <div v-if="village" class="village-article-wrapper">
          <h1 class="village-name has-text-left">{{ villageName }}</h1>
          <village-day-list
            v-if="displayVillageDay"
            :village="village"
            :display-village-day-id="displayVillageDay.id"
            @current-day-change="changeDisplayDay($event)"
          />
          <message-cards
            v-if="messages"
            :village="village"
            :messages="messages"
            :per-page="perPage"
            :is-latest-day="
              displayVillageDay &&
                latestDay &&
                displayVillageDay.id === latestDay.id
            "
            @change-message-page="changeMessagePage($event)"
            ref="messageCards"
          />
          <village-day-list
            v-if="displayVillageDay"
            :village="village"
            :display-village-day-id="displayVillageDay.id"
            @current-day-change="changeDisplayDay($event)"
          />
          <div id="message-bottom" />
          <div v-if="isDispDebugMenu">
            <village-debug :village="debugVillage" @reload="reload" />
          </div>
        </div>
        <action
          v-if="situation && existsAction"
          :situation="situation"
          :village="village"
          @reload="reload"
          ref="action"
        ></action>
      </div>
      <village-footer
        class="village-footer-wrapper"
        :village="village"
        :exists-new-messages="existsNewMessages"
        @refresh="reload"
        @to-bottom="toBottom"
        @toggle-slider="toggleSlider"
        ref="footer"
      />
      <village-slider
        v-if="$window.isMobile"
        :village="village"
        :charachip-name="charachipName"
        :is-expanded="isSliderExpanded"
        :messages="messages"
        @refresh="reload"
        @filter="filter($event)"
        @hide-slider="hideSlider"
        ref="slider"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import qs from 'qs'
import firebase from '~/plugins/firebase'
// components
import loading from '~/components/loading.vue'
import action from '~/components/village/action/action.vue'
import villageFooter from '~/components/village/footer/village-footer.vue'
import villageHeader from '~/components/village/header/village-header.vue'
import villageSlider from '~/components/village/slider/village-slider.vue'
// type
import Village from '~/components/type/village'
import VillageDay from '~/components/type/village-day'
import VillageLatest from '~/components/type/village-latest'
import Messages from '~/components/type/messages'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import DebugVillage from '~/components/type/debug-village'
import Charachip from '~/components/type/charachip'
import { VILLAGE_STATUS } from '~/components/const/consts'
import villageUserSettings, {
  VillageUserSettings
} from '~/components/village/user-settings/village-user-settings'
import actionHelper from '~/components/village/action/village-action-helper'
import api from '~/components/village/village-api'
import toast from '~/components/village/village-toast'
// dynamic imports
const messageCards = () =>
  import('~/components/village/message/message-cards.vue')
const villageDebug = () =>
  import('~/components/village/debug/village-debug.vue')
const villageDayList = () => import('~/components/village/village-day-list.vue')

@Component({
  components: {
    loading,
    messageCards,
    action,
    villageDebug,
    villageDayList,
    villageFooter,
    villageHeader,
    villageSlider
  },
  asyncData({ query }) {
    return { villageId: query.id }
  }
})
export default class extends Vue {
  // ----------------------------------------------------------------
  // head
  // ----------------------------------------------------------------
  private head() {
    return { title: this.village == null ? '' : ` | ${this.village.name}` }
  }

  // ----------------------------------------------------------------
  // layout
  // ----------------------------------------------------------------
  private layout() {
    return 'village-layout'
  }

  // ----------------------------------------------------------------
  // data
  // ----------------------------------------------------------------
  /** village_id */
  private villageId: number = 0
  /** 現在表示している村日付 */
  private displayVillageDay: VillageDay | null = null
  /** 村情報を取得中か */
  private loadingVillage: boolean = true
  /** 発言を取得中か */
  private loadingMessage: boolean = false
  /** 参加状況を取得中か */
  private loadingSituation: boolean = false
  /** 村 */
  private village: Village | null = null
  /** 発言 */
  private messages: Messages | null = null
  /** 参加状況 */
  private situation: SituationAsParticipant | null = null
  /** ローカル環境限定の村情報 */
  private debugVillage: DebugVillage | null = null
  /** 現在の発言ページ番号 */
  private currentPageNum: number | null = 1
  /** 1ページあたりの表示件数 */
  private perPage: number = 0
  /** 最新発言unix time milli */
  private latestMessageUnixTimeMilli: number = 0
  /** 新しい発言があるか */
  private existsNewMessages: boolean = false
  /** 新しい発言があるか定期的にチェックするtimer */
  private latestTimer: any | null = null
  /** 残り時間表示 */
  private daychangeTimer: any | null = null
  /** この村のキャラチップ名 */
  private charachipName: string | null = null
  /** 発言抽出：発言種別 */
  private messageTypeFilter: string[] | null = null
  /** 発言抽出：参加者 */
  private participantIdFilter: number[] | null = null
  /** 発言抽出：キーワード */
  private keywordFilter: string | null = null
  /** サイドバー */
  private isSliderExpanded: boolean = false

  // ----------------------------------------------------------------
  // computed
  // ----------------------------------------------------------------
  /** 村名と状態 */
  private get villageName(): string {
    const status = this.village!.status
    if (status.code !== VILLAGE_STATUS.PROGRESS || !this.displayVillageDay) {
      return this.village!.name + ' - ' + status.name
    }
    return (
      this.village!.name +
      ' - ' +
      status.name +
      ' - ' +
      this.displayVillageDay!.day +
      '日目'
    )
  }

  /** 最新村日付 */
  private get latestDay(): VillageDay | null {
    if (this.village == null) return null
    return this.village.day.day_list[this.village.day.day_list.length - 1]
  }

  /** ローカル環境か */
  private get isDebug(): boolean {
    return (process.env as any).ENV === 'local'
  }

  /** デバッグメニューを表示するか */
  private get isDispDebugMenu(): boolean {
    return this.isDebug && this.debugVillage != null && this.situation != null
  }

  /** 自動的に最新発言を読み込むか */
  private get shouldLoadMessage(): boolean {
    // 最新日の最新ページを見ていない場合は勝手に更新したくない
    if (!this.isViewingLatest) return false
    // 発言入力中も勝手に更新したくない
    if (this.refs.action && this.refs.action.isInputting) return false
    // 発言抽出中も勝手に更新したくない
    if (this.refs.slider.isFiltering) return false
    return true
  }

  /** 最新日・最新ページを見ているか */
  private get isViewingLatest(): boolean {
    // 最新日を見ていない
    if (this.displayVillageDay!.id !== this.latestDay!.id) return false
    // 最新ページを見ていない
    if (
      this.messages!.all_page_count != null &&
      this.currentPageNum !== this.messages!.all_page_count
    )
      return false

    return true
  }

  private get existsAction(): boolean {
    return !!this.situation && actionHelper.existsAction(this.situation)
  }

  private get refs(): any {
    return this.$refs
  }

  private get isNotFinished(): boolean {
    const status = this.village!.status.code
    return (
      this.village!.status.code !== VILLAGE_STATUS.COMPLETE &&
      this.village!.status.code !== VILLAGE_STATUS.CANCEL
    )
  }

  // ----------------------------------------------------------------
  // created
  // ----------------------------------------------------------------
  private async created(): Promise<void> {
    // 認証を待つ
    await this.auth()
    // 表示設定が作成されていなかったら作成
    villageUserSettings.createCookieIfNeeded(this)
    // もろもろ読込
    await this.reload()
    // キャラチップ名
    this.charachipName = await this.loadCharachipName()
    // 定期的に最新発言がないかチェックする
    if (this.isNotFinished) {
      this.latestTimer = this.setLatestTimer()
      this.daychangeTimer = this.setDaychangeTimer()
    } else {
      // 1回だけ実行
      this.updateDaychangeTimer()
    }
    // safari対策
    this.resizeHeight()
    window.addEventListener('resize', () => this.resizeHeight())
  }

  // ----------------------------------------------------------------
  // destroyed
  // ----------------------------------------------------------------
  private destroyed(): void {
    this.clearTimer()
  }

  // ----------------------------------------------------------------
  // methods
  // ----------------------------------------------------------------
  /** 認証 */
  private async auth(): Promise<void> {
    const user = await new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => resolve(user))
    })
    await this.$store.dispatch('LOGINOUT', {
      user
    })
  }

  /** 村を読み込み */
  private async loadVillage(): Promise<void> {
    this.loadingVillage = true
    this.village = await api.fetchVillage(this, this.villageId)
    this.loadingVillage = false
  }

  /** 発言を読み込み */
  private async loadMessage(
    isDispLatestDay: boolean = false,
    isDispLatestPage: boolean = false
  ): Promise<void> {
    this.loadingMessage = true
    // 村を読み込めていない場合は何もしない
    if (this.latestDay == null) {
      this.loadingMessage = false
      return
    }
    // 表示する日付
    const displayDay = isDispLatestDay ? this.latestDay : this.displayVillageDay
    // 読み込み
    this.messages = await api.fetchMessageList(
      this,
      this.villageId,
      displayDay,
      isDispLatestPage,
      this.currentPageNum,
      this.messageTypeFilter,
      this.participantIdFilter,
      this.keywordFilter
    )
    if (villageUserSettings.getPaging(this).is_paging) {
      this.perPage = villageUserSettings.getPaging(this).message_per_page
    }
    this.currentPageNum = this.messages!.current_page_num
    this.updateLatestMessageUnixTimeMilliIfNeeded()
    this.loadingMessage = false
  }

  /** 参加状況を読み込み */
  private async loadSituation(): Promise<void> {
    this.loadingSituation = true
    // 村を読み込めていない場合は何もしない
    if (this.village == null) {
      this.loadingSituation = false
      return
    }
    // 参加状況を読み込み
    this.situation = await api.fetchSituation(this, this.villageId)
    this.loadingSituation = false
  }

  /** キャラチップ名を読み込み */
  private loadCharachipName(): Promise<string> {
    return api.fetchCharachipName(this, this.village!)
  }

  /** デバッグ用村情報を読み込み */
  private loadDebugVillage(): Promise<DebugVillage> {
    return api.fetchDebugVillage(this, this.villageId)
  }

  /** もろもろ読み込み */
  private async reload(): Promise<void> {
    await this.loadVillage()
    await Promise.all([
      this.loadMessage(true, true), // 最新
      this.loadSituation()
    ])
    // デバッグ用村情報
    if (this.isDebug) this.debugVillage = await this.loadDebugVillage()
    // 最新日を表示
    this.displayVillageDay = this.latestDay!
    this.existsNewMessages = false
    if (this.isNotFinished) {
      // 能力行使等をリセット
      if (this.existsAction) this.refs.action.reset()
    }
    this.toBottom()

    // 発言抽出欄を初期状態に戻す
    this.refs.slider.filterRefresh()
    // アンカーメッセージを非表示にする
    if (this.refs.messageCards) this.refs.messageCards.clearAnchorMessages()
  }

  /** 表示する村日付を変更 */
  private async changeDisplayDay({ villageDayId }): Promise<void> {
    const selectedDay = this.village!.day.day_list.find(
      day => day.id === villageDayId
    )
    if (selectedDay == null) return
    this.displayVillageDay = selectedDay
    this.currentPageNum = 1
    await this.loadMessage()
    this.toHead()
  }

  /** 表示するページを変更 */
  private async changeMessagePage({ pageNum }): Promise<void> {
    this.currentPageNum = pageNum
    await this.loadMessage()
    this.toHead()
  }

  /** 発言抽出 */
  private async filter({
    messageTypeList,
    participantIdList,
    keyword
  }): Promise<void> {
    this.messageTypeFilter = messageTypeList
    this.participantIdFilter = participantIdList
    this.keywordFilter = keyword
    await this.loadMessage()
  }

  /** 発言内容の最上部にスクロール */
  private toHead(): void {
    const element = document.getElementsByClassName('site')
    if (element == null) return
    this.$scrollTo(element[0], {
      container: '.village-article-wrapper'
    })
  }

  private toBottom(): void {
    const element = document.getElementById('message-bottom')
    if (element == null) return
    this.$scrollTo(element, {
      container: '.village-article-wrapper'
    })
  }

  /** 定期的に最新発言がないかチェック */
  private setLatestTimer(): any {
    return setInterval(this.loadVillageLatest, 30 * 1000)
  }

  /** 更新までの残り時間を表示 */
  private setDaychangeTimer(): any {
    return setInterval(this.updateDaychangeTimer, 1000)
  }

  /** 最新発言チェックを解除 */
  private clearTimer(): void {
    clearInterval(this.latestTimer)
    clearInterval(this.daychangeTimer)
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout)
  }

  private updateLatestMessageUnixTimeMilliIfNeeded(): void {
    if (!this.messages || this.messages.list.length <= 0) return
    const unixTimeMilli = this.messages!.list[this.messages!.list.length - 1]
      .time.unix_time_milli
    if (this.latestMessageUnixTimeMilli < unixTimeMilli)
      this.latestMessageUnixTimeMilli = unixTimeMilli
  }

  /** 最新発言チェック */
  private async loadVillageLatest(): Promise<void> {
    const latest: VillageLatest = await api.fetchVillageLatest(
      this,
      this.villageId,
      this.latestMessageUnixTimeMilli
    )
    const currentLatestVillageDayId: number = this.latestDay!.id
    if (latest.village_day_id !== currentLatestVillageDayId) {
      // 日付が変わった
      this.existsNewMessages = true
      if (this.shouldLoadMessage) {
        this.reload()
        toast.info(this, '日付が変わりました')
      } else {
        toast.info(this, '日付が変わりました。リロードしてください。')
      }
    } else if (this.latestMessageUnixTimeMilli < latest.unix_time_milli) {
      // 発言が増えた
      this.existsNewMessages = true
      if (this.shouldLoadMessage) {
        this.loadMessage()
        toast.info(this, '最新発言を読み込みました')
        this.existsNewMessages = false
      }
    }
  }

  private updateDaychangeTimer(): void {
    ;(this.$refs as any).footer.refreshTimer()
  }

  private toggleSlider(): void {
    this.isSliderExpanded = !this.isSliderExpanded
  }

  private hideSlider(): void {
    this.isSliderExpanded = false
  }

  // safariアドレスバーメニューバー対策
  private resizeTimeout: any = null
  private resizeHeight(): void {
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout)
    this.resizeTimeout = setTimeout(() => {
      const height = window.innerHeight
      document
        .getElementsByClassName('village-wrapper')[0]
        .setAttribute('style', `height: ${height}px;`)
      document
        .getElementsByClassName('village-rightside-wrapper')[0]
        .setAttribute('style', `height: ${height}px;`)
    }, 500)
  }
}
</script>

<style lang="scss" scoped>
// 全体レイアウト
html {
  overflow-y: auto !important;
}
.village-wrapper {
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  width: 100%;
  height: 100vh;

  .village-leftside-wrapper {
    height: 100vh;
    background-color: $dark;
  }

  .village-rightside-wrapper {
    flex: 1;
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;

    .village-header-wrapper {
      height: 1.8rem;
    }

    .village-footer-wrapper {
      height: 1.8rem;
    }

    .village-main-wrapper {
      flex: 1;
      display: flex;
      flex-shrink: 0;
      flex-direction: column;
      justify-content: space-between;
      overflow-y: auto;

      .village-article-wrapper {
        flex: 1;
        overflow-y: scroll;

        .village-name {
          margin: 10px 5px;
        }
      }
      .village-action-wrapper {
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }
}
</style>
