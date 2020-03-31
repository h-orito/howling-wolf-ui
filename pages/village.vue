<template>
  <div class="is-size-7 village-wrapper">
    <village-header
      class="village-header-wrapper"
      :current-village-day="displayVillageDay"
      :village="village"
      @to-head="toHead"
      @current-day-change="changeDisplayDay($event)"
    />
    <div class="village-main-wrapper">
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
        <h1 class="m-t-10 m-b-10 m-l-5 m-r-5 has-text-left">
          {{ village.name + ' - ' + village.status.name }}
        </h1>
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
          :is-progress="isNotFinished"
          :is-latest-day="
            displayVillageDay &&
              latestDay &&
              displayVillageDay.id === latestDay.id
          "
          @change-message-page="changeMessagePage($event)"
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
// dynamic imports
const messageCards = () =>
  import('~/components/village/message/message-cards.vue')
const villageDebug = () =>
  import('~/components/village/debug/village-debug.vue')
const villageDayList = () => import('~/components/village/village-day-list.vue')
const villageSlider = () =>
  import('~/components/village/slider/village-slider.vue')

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
  /** 読込済発言の最新日時（unix time milli seconds) */
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

  /** 終了していない村か */
  private get isNotFinished(): boolean {
    const statusCode = this.village == null ? '' : this.village.status.code
    return (
      statusCode === VILLAGE_STATUS.PROLOGUE ||
      statusCode === VILLAGE_STATUS.PROGRESS
    )
  }

  /** 自動的に最新発言を読み込むか */
  private get shouldLoadMessage(): boolean {
    // 最新日の最新ページを見ていない場合は勝手に更新したくない
    if (!this.isViewingLatest) return false
    // 発言入力中も勝手に更新したくない
    if ((this.$refs as any).action.isInputting) return false
    // 発言抽出中も勝手に更新したくない
    if ((this.$refs as any).slider.isFiltering) return false
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
    if (
      this.village!.status.code !== VILLAGE_STATUS.COMPLETE &&
      this.village!.status.code !== VILLAGE_STATUS.CANCEL
    ) {
      this.latestTimer = this.setLatestTimer()
      this.daychangeTimer = this.setDaychangeTimer()
    } else {
      // 1回だけ実行
      this.updateDaychangeTimer()
    }
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
    this.village = await this.$axios.$get(`/village/${this.villageId}`)
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
    const params: any = {
      message_type_list: this.messageTypeFilter,
      participant_id_list: this.participantIdFilter,
      keyword: this.keywordFilter
    }
    const pagingSetting = villageUserSettings.getPaging(this)
    if (pagingSetting.is_paging) {
      this.perPage = pagingSetting.message_per_page
      params.page_size = pagingSetting.message_per_page
      params.page_num = isDispLatestPage ? 10000 : this.currentPageNum
    }
    this.messages = await this.$axios.$get(
      `/village/${this.village!.id}/day/${displayDay!.day}/time/${
        displayDay!.noonnight
      }/message-list`,
      {
        params,
        paramsSerializer: params =>
          qs.stringify(params, { arrayFormat: 'repeat' })
      }
    )
    this.currentPageNum = this.messages!.current_page_num
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
    this.situation = await this.$axios.$get(
      `/village/${this.village.id}/situation`
    )
    this.loadingSituation = false
  }

  /** キャラチップ名を読み込み */
  private async loadCharachipName(): Promise<string> {
    const charachipId = this.village!.setting.charachip.charachip_id
    const charachip: Charachip = await this.$axios.$get(
      `/charachip/${charachipId}`
    )
    return charachip.name
  }

  /** デバッグ用村情報を読み込み */
  private async loadDebugVillage(): Promise<DebugVillage> {
    return await this.$axios.$get(`/admin/village/${this.villageId}`)
  }

  /** もろもろ読み込み */
  private async reload(): Promise<void> {
    // 村
    await this.loadVillage()
    await Promise.all([
      // 発言(最新の日の最新のページを表示)
      this.loadMessage(true, true),
      // 参加状況
      this.loadSituation()
    ])
    // デバッグ用村情報
    if (this.isDebug) this.debugVillage = await this.loadDebugVillage()

    // 初期表示時は最新日を表示する
    this.displayVillageDay = this.latestDay!
    this.existsNewMessages = false
    const refs = this.$refs as any
    if (
      this.village!.status.code !== VILLAGE_STATUS.COMPLETE &&
      this.village!.status.code !== VILLAGE_STATUS.CANCEL
    ) {
      // 発言読込時点での最新日時をセットしておく
      this.latestMessageUnixTimeMilli = this.messages!.list[
        this.messages!.list.length - 1
      ].time.unix_time_milli
      // 能力行使等をリセット
      if (this.existsAction) refs.action.reset()
    }
    this.toBottom()

    // 発言抽出欄を初期状態に戻す
    refs.slider.filterRefresh()
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
    // let paddingPx: number = this.convertRemToPx(1.8)
    // if (this.existsAction) paddingPx += 200
    // this.$scrollTo(element, {
    //   container: '.village-article-wrapper',
    //   offset: -window.innerHeight + paddingPx
    // })
  }

  /** rem to px */
  private convertRemToPx(rem): number {
    const fontSize = getComputedStyle(document.documentElement).fontSize
    return rem * parseFloat(fontSize)
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
  }

  /** 最新発言チェック */
  private async loadVillageLatest(): Promise<void> {
    const latest: VillageLatest = await this.$axios.$get(
      `/village/${this.villageId}/latest`,
      {
        params: {
          from: this.latestMessageUnixTimeMilli
        }
      }
    )
    const currentLatestVillageDayId: number = this.latestDay!.id
    if (latest.village_day_id !== currentLatestVillageDayId) {
      // 日付が変わった
      this.existsNewMessages = true
      if (this.shouldLoadMessage) {
        this.reload()
        this.$buefy.toast.open({
          message: '日付が変わりました',
          type: 'is-info',
          position: 'is-top'
        })
      } else {
        this.$buefy.toast.open({
          message: '日付が変わりました。リロードしてください。',
          type: 'is-info',
          position: 'is-top'
        })
      }
    } else if (this.latestMessageUnixTimeMilli < latest.unix_time_milli) {
      // 発言が増えた
      this.existsNewMessages = true
      this.latestMessageUnixTimeMilli = latest.unix_time_milli
      if (this.shouldLoadMessage) {
        this.loadMessage()
        this.$buefy.toast.open({
          message: '最新発言を読み込みました',
          type: 'is-info',
          position: 'is-top'
        })
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
}
</script>

<style lang="scss">
// 全体レイアウト
.village-wrapper {
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
    overflow-y: scroll;

    .village-article-wrapper {
      flex: 1;
      overflow-y: scroll;
    }
    .village-action-wrapper {
      display: flex;
      flex-shrink: 0;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .hw-message-card {
    padding: 5px;
    margin-bottom: 5px;

    .hw-message-name-area {
      padding-bottom: 5px;
      display: flex;

      .hw-message-name {
        text-align: left;
        font-weight: bold;
      }
      .hw-message-player {
        margin-left: 5px;
        text-align: left;
      }
      .hw-message-datetime {
        margin-left: auto;
        text-align: right;
        color: #aaaaaa;
      }
    }
    .hw-message-content-area {
      display: flex;

      .hw-message-face-area {
        padding-right: 5px;

        .hw-message-chara-image {
          vertical-align: bottom;
          border-radius: 5px;
        }
      }

      .hw-message-text-area {
        flex: 1;
        border: 1px solid #dddddd;
        border-radius: 5px;
        padding: 5px;
        font-family: sans-serif;

        .hw-message-text {
          text-align: left;
          word-break: break-word;
        }
      }
    }
  }
}
</style>
