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
        :village="village"
        :display-village-day-id="displayVillageDayId"
        @current-day-change="changeDisplayDay($event)"
      />
      <div v-if="messages">
        <message-card
          v-for="message in messages.list"
          :key="message['id']"
          :village="village"
          :message="message"
          :is-progress="isNotFinished"
        ></message-card>
      </div>
      <div id="message-bottom" />
      <div v-if="situation">
        <action
          :situation="situation"
          :village="village"
          @reload="reload"
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
    <village-footer :village="village" @refresh="reload" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// components
import loading from '~/components/loading.vue'
import messageCard from '~/components/village/message/message-card.vue'
import action from '~/components/village/action/action.vue'
import villageDebug from '~/components/village/debug/village-debug.vue'
import villageDayList from '~/components/village/village-day-list.vue'
import villageFooter from '~/components/village/footer/village-footer.vue'
// type
import Village from '~/components/type/village'
import VillageDay from '~/components/type/village-day'
import Messages from '~/components/type/messages'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import DebugVillage from '~/components/type/debug-village'
import { VILLAGE_STATUS } from '~/components/const/consts'

@Component({
  components: {
    loading,
    messageCard,
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
  private displayVillageDayId: number = 0
  private loadingVillage: boolean = true
  private loadingMessage: boolean = false
  private loadingSituation: boolean = false

  private village: Village | null = null
  private messages: Messages | null = null
  private situation: SituationAsParticipant | null = null
  private debugVillage: DebugVillage | null = null

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
    this.displayVillageDayId = this.latestDay!.id
  }

  /** methods */
  private async loadVillage(): Promise<void> {
    this.loadingVillage = true
    this.village = await this.$axios.$get(`/village/${this.villageId}`)
    this.loadingVillage = false
  }

  private async loadMessage(day: number = this.latestDay!.day): Promise<void> {
    this.loadingMessage = true
    if (this.latestDay == null) {
      this.loadingMessage = false
      return
    }
    this.messages = await this.$axios.$get(
      `/village/${this.village!.id}/day/${day}/time/${
        this.latestDay.noonnight
      }/message-list`
    )
    this.loadingMessage = false
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
    await this.loadMessage(selectedDay.day)
    this.displayVillageDayId = villageDayId
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
