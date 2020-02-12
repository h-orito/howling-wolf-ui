<template>
  <div class="container is-size-7 village-main-area">
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
      v-if="loadingSituation"
      :message="'参加状況を読み込み中...'"
      :fixed="true"
    ></loading>
    <div v-if="village">
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
        :is-progress="isNotFinished"
        :per-page="perPageCount"
        @change-message-page="changeMessagePage($event)"
      />
      <div id="message-bottom" />
      <village-day-list
        v-if="displayVillageDay"
        :village="village"
        :display-village-day-id="displayVillageDay.id"
        @current-day-change="changeDisplayDay($event)"
      />
      <div v-if="situation">
        <action
          :situation="situation"
          :village="village"
          @reload="reload"
          @load-latest="loadVillageLatest"
          ref="action"
        ></action>
      </div>
    </div>
    <div v-if="isDispDebugMenu">
      <village-debug
        :village="debugVillage"
        @debug-participate="debugParticipate($event)"
        @dummy-login="dummyLogin($event)"
        @debug-change-day="debugChangeDay($event)"
        @set-no-suddenly-death="setNoSuddenlyDeath($event)"
      />
    </div>
    <village-footer
      :village="village"
      :exists-new-messages="existsNewMessages"
      @refresh="reload"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// components
import loading from '~/components/loading.vue'
import messageCards from '~/components/village/message/message-cards.vue'
import action from '~/components/village/action/action.vue'
import villageDebug from '~/components/village/debug/village-debug.vue'
import villageDayList from '~/components/village/village-day-list.vue'
import villageFooter from '~/components/village/footer/village-footer.vue'
// type
import Village from '~/components/type/village'
import VillageDay from '~/components/type/village-day'
import VillageLatest from '~/components/type/village-latest'
import Messages from '~/components/type/messages'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import DebugVillage from '~/components/type/debug-village'
import { VILLAGE_STATUS } from '~/components/const/consts'

@Component({
  components: {
    loading,
    messageCards,
    action,
    villageDebug,
    villageDayList,
    villageFooter
  },
  asyncData({ query }) {
    return { villageId: query.id }
  }
})
export default class extends Vue {
  /** head */
  private head() {
    return { title: this.village == null ? '' : ` | ${this.village.name}` }
  }

  /** data */
  private villageId: number = 0
  private displayVillageDay: VillageDay | null = null
  private loadingVillage: boolean = true
  private loadingMessage: boolean = false
  private loadingSituation: boolean = false

  private village: Village | null = null
  private messages: Messages | null = null
  private situation: SituationAsParticipant | null = null
  private debugVillage: DebugVillage | null = null

  // message
  private perPageCount: number = 50
  private currentPageNum: number | null = 1
  // latest message timer
  private latestMessageUnixTimeMilli: number = 0
  private existsNewMessages: boolean = false
  private latestTimer: any | null = null

  /** computed */
  private get latestDay(): VillageDay | null {
    if (this.village == null) return null
    return this.village.day.day_list[this.village.day.day_list.length - 1]
  }

  private get isDebug(): boolean {
    return (process.env as any).ENV === 'local'
  }

  private get isDispDebugMenu(): boolean {
    return this.isDebug && this.debugVillage != null && this.situation != null
  }

  private get isNotFinished(): boolean {
    const statusCode = this.village == null ? '' : this.village.status.code
    return (
      statusCode === VILLAGE_STATUS.PROLOGUE ||
      statusCode === VILLAGE_STATUS.PROGRESS
    )
  }

  /** created */
  private async created(): Promise<void> {
    await this.reload()
    this.displayVillageDay = this.latestDay!
    this.latestTimer = this.setLatestTimer()
    this.latestMessageUnixTimeMilli = this.messages!.list[
      this.messages!.list.length - 1
    ].time.unix_time_milli
  }

  /** destroyed */
  private destroyed(): void {
    this.clearLatestTimer()
  }

  /** methods */
  private async loadVillage(): Promise<void> {
    this.loadingVillage = true
    this.village = await this.$axios.$get(`/village/${this.villageId}`)
    this.loadingVillage = false
  }

  private async loadMessage(): Promise<void> {
    this.loadingMessage = true
    if (this.latestDay == null) {
      this.loadingMessage = false
      return
    }
    const displayDay =
      this.displayVillageDay == null ? this.latestDay : this.displayVillageDay
    let pageNum = this.currentPageNum
    if (this.displayVillageDay == null) {
      // 初期表示は一番新しいページを表示したい
      pageNum = 10000
    }

    this.messages = await this.$axios.$get(
      `/village/${this.village!.id}/day/${displayDay.day}/time/${
        displayDay.noonnight
      }/message-list`,
      {
        params: {
          page_size: this.perPageCount,
          page_num: pageNum
        }
      }
    )
    this.currentPageNum = this.messages!.current_page_num
    this.loadingMessage = false
    this.existsNewMessages = false
  }

  private async loadSituation(): Promise<void> {
    this.loadingSituation = true
    if (this.village == null) {
      this.loadingSituation = false
      return
    }
    this.situation = await this.$axios.$get(
      `/village/${this.village.id}/situation`
    )
    this.loadingSituation = false
  }

  private async loadDebugVillage(): Promise<DebugVillage> {
    return await this.$axios.$get(`/admin/village/${this.villageId}`)
  }

  private async reload(): Promise<void> {
    await this.loadVillage()
    await this.loadMessage()
    await this.loadSituation()
    if (this.isDebug) this.debugVillage = await this.loadDebugVillage()
  }

  private async changeDisplayDay({ villageDayId }): Promise<void> {
    const selectedDay = this.village!.day.day_list.find(
      day => day.id === villageDayId
    )
    if (selectedDay == null) return
    this.displayVillageDay = selectedDay
    this.currentPageNum = 1
    await this.loadMessage()
  }

  private async changeMessagePage({ pageNum }): Promise<void> {
    this.currentPageNum = pageNum
    await this.loadMessage()
  }

  private setLatestTimer(): any {
    return setInterval(this.loadVillageLatest, 30 * 1000)
  }

  private clearLatestTimer(): void {
    clearInterval(this.latestTimer)
  }

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
      this.$buefy.snackbar.open({
        message: '日付が変わりました。リロードしてください。',
        type: 'is-success',
        position: 'is-top-right',
        actionText: null
      })
    } else if (this.latestMessageUnixTimeMilli < latest.unix_time_milli) {
      // 発言が増えた
      this.existsNewMessages = true
      this.latestMessageUnixTimeMilli = latest.unix_time_milli
      if (this.shouldLoadMessage()) {
        this.loadMessage()
        this.$buefy.snackbar.open({
          message: '最新発言を読み込みました',
          type: 'is-success',
          position: 'is-top-right',
          actionText: null
        })
      }
    }
  }

  // 自動的に最新発言を読み込むか
  private shouldLoadMessage(): boolean {
    // 最新日以外を見ている場合
    if (this.displayVillageDay!.id !== this.latestDay!.id) return false
    // 最新ページ以外を見ている場合
    if (
      this.messages!.all_page_count != null &&
      this.currentPageNum !== this.messages!.all_page_count
    )
      return false
    // 発言入力中
    if ((this.$refs as any).action.isInputting) return false
    return true
  }

  private async debugParticipate({ num }): Promise<void> {
    await this.$axios.$post(`/admin/village/${this.village!.id}/participate`, {
      participate_count: num
    })
    this.reload()
  }

  private async dummyLogin({ participantId }): Promise<void> {
    await this.$axios.$post(`/admin/village/${this.village!.id}/dummy-login`, {
      target_id: participantId
    })
    this.reload()
  }

  private async debugChangeDay(): Promise<void> {
    await this.$axios.$post(`/admin/village/${this.village!.id}/change-day`)
    this.reload()
  }

  private async setNoSuddenlyDeath(): Promise<void> {
    await this.$axios.$post(
      `/admin/village/${this.village!.id}/no-suddenly-death`
    )
    this.reload()
  }
}
</script>

<style lang="scss">
.village-main-area {
  padding-bottom: 3rem;

  .hw-message-card {
    padding: 5px;
    margin-bottom: 5px;

    .hw-message-name-area {
      padding-bottom: 5px;
      display: flex;

      .hw-message-name {
        flex: 1;
        text-align: left;
        font-weight: bold;
      }
      .hw-message-datetime {
        flex: 1;
        text-align: right;
        color: #aaaaaa;
      }
    }
    .hw-message-content-area {
      display: flex;

      .hw-message-face-area {
        padding-right: 5px;

        .hw-message-chara-image {
          border-radius: 5px;
        }
      }

      .hw-message-text-area {
        flex: 1;
        border: 1px solid #dddddd;
        border-radius: 5px;
        padding: 5px;

        .hw-message-text {
          text-align: left;
          word-break: break-word;
        }
      }
    }
  }
}
</style>
