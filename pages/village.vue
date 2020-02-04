<template>
  <div class="container is-size-7">
    <loading v-if="loadingVillage" :message="'村情報を読み込み中...'"></loading>
    <div v-if="!loadingVillage">
      <loading v-if="loadingMessage" :message="'発言を読み込み中...'"></loading>
      <div v-if="!loadingMessage">
        <message-card
          v-for="message in messages.message_list"
          :key="message['id']"
          :village="village"
          :message="message"
          :is-progress="
            village.status.code === 'PROLOGUE' ||
              village.status.code === 'PROGRESS'
          "
        ></message-card>
      </div>
      <div v-if="!loadingSituation">
        <action
          :situation="situation"
          @participate="participate($event)"
          @spectate="spectate($event)"
          @leave="leave($event)"
          @change-skill-request="changeSkillRequest($event)"
          @say="say($event)"
          @vote="vote($event)"
          @set-ability="setAbility($event)"
          @commit="commit($event)"
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from '@nuxtjs/axios'
// components
import loading from '~/components/loading.vue'
import messageCard from '~/components/village/message/message-card.vue'
import action from '~/components/village/action/action.vue'
import villageDebug from '~/components/village/debug/village-debug.vue'
// type
import Village from '~/components/type/village'
import VillageDay from '~/components/type/village-day'
import Messages from '~/components/type/messages'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import DebugVillage from '~/components/type/debug-village'

@Component({
  components: {
    loading,
    messageCard,
    action,
    villageDebug
  },
  asyncData({ query }) {
    return { villageId: query.id }
  }
})
export default class extends Vue {
  /** head */
  private head() {
    return { title: '| 村' }
  }

  /** data */
  private villageId: number = 0
  private villageName: string = ''
  private leftTime: number = 60

  private village: Village | null = null
  private messages: Messages | null = null
  private situation: SituationAsParticipant | null = null
  private debugVillage: DebugVillage | null = null

  /** computed */
  private get loadingVillage(): boolean {
    return this.village == null
  }

  private get loadingMessage(): boolean {
    return this.messages == null
  }

  private get loadingSituation(): boolean {
    return this.situation == null
  }

  private get latestDay(): VillageDay | null {
    if (this.village == null) return null
    return this.village.day.day_list[this.village.day.day_list.length - 1]
  }

  private get isDebug(): boolean {
    return (process.env as any).IS_LOCAL
  }

  private get isDispDebugMenu(): boolean {
    return this.isDebug && this.debugVillage != null && this.situation != null
  }

  /** created */
  private async created(): Promise<any> {
    await this.reload()
  }

  /** methods */
  private async loadVillage(): Promise<Village> {
    return await this.$axios.$get(`/village/${this.villageId}`)
  }

  private async loadMessage(): Promise<Messages | null> {
    if (this.latestDay == null) return null
    return await this.$axios.$get(
      `/village/${this.village!.id}/day/${this.latestDay.day}/time/${
        this.latestDay.noonnight
      }/message-list`
    )
  }

  private async loadSituation(): Promise<SituationAsParticipant | null> {
    if (this.village == null) return null
    return await this.$axios.$get(`/village/${this.village.id}/situation`)
  }

  private async loadDebugVillage(): Promise<DebugVillage> {
    return await this.$axios.$get(`/admin/village/${this.villageId}`)
  }

  private async reload(): Promise<void> {
    this.village = await this.loadVillage()
    this.messages = await this.loadMessage()
    this.situation = await this.loadSituation()
    if (this.isDebug) this.debugVillage = await this.loadDebugVillage()
  }

  private async participate({
    charaId,
    firstRequestSkillCode,
    secondRequestSkillCode,
    message
  }): Promise<void> {
    try {
      await this.$axios.$post(`/village/${this.village!.id}/participate`, {
        chara_id: parseInt(charaId),
        first_request_skill: firstRequestSkillCode,
        second_request_skill: secondRequestSkillCode,
        join_message: message,
        join_password: null,
        spectator: false
      })
      this.reload()
    } catch (error) {}
  }

  private async spectate({ charaId }): Promise<void> {
    try {
      await this.$axios.$post(`/village/${this.village!.id}/participate`, {
        chara_id: parseInt(charaId),
        join_message: 'dummy join message',
        join_password: null,
        spectator: true
      })
      this.reload()
    } catch (error) {}
  }

  private async leave(): Promise<void> {
    try {
      await this.$axios.$post(`/village/${this.village!.id}/leave`, {})
      this.reload()
    } catch (error) {}
  }

  private async changeSkillRequest({
    firstRequestSkillCode,
    secondRequestSkillCode
  }): Promise<void> {
    try {
      await this.$axios.$post(`/village/${this.village!.id}/change-skill`, {
        first_request_skill: firstRequestSkillCode,
        second_request_skill: secondRequestSkillCode
      })
      this.reload()
    } catch (error) {}
  }

  private async say({ message, messageType, faceType }): Promise<void> {
    try {
      await this.$axios.$post(`/village/${this.village!.id}/say`, {
        message,
        message_type: messageType,
        face_type: faceType
      })
      this.reload()
    } catch (error) {}
  }

  private async vote({ targetId }): Promise<void> {
    return await this.$axios.$post(`/village/${this.village!.id}/vote`, {
      target_id: targetId
    })
  }

  private async setAbility({ targetId, abilityType }): Promise<void> {
    return await this.$axios.$post(`/village/${this.village!.id}/ability`, {
      target_id: parseInt(targetId),
      ability_type: abilityType
    })
  }

  private async commit({ doCommit }): Promise<void> {
    return await this.$axios.$post(`/village/${this.village!.id}/commit`, {
      commit: doCommit
    })
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
.w4b-message-card {
  padding: 5px;
  margin-bottom: 5px;

  .w4b-message-name-area {
    padding-bottom: 5px;
    display: flex;

    .w4b-message-name {
      flex: 1;
      text-align: left;
      font-weight: bold;
    }
    .w4b-message-datetime {
      flex: 1;
      text-align: right;
      color: #aaaaaa;
    }
  }
  .w4b-message-content-area {
    display: flex;

    .w4b-message-face-area {
      padding-right: 5px;

      .w4b-message-chara-image {
        border-radius: 5px;
      }
    }

    .w4b-message-text-area {
      flex: 1;
      border: 1px solid #dddddd;
      border-radius: 5px;
      padding: 5px;

      .w4b-message-text {
        text-align: left;
        word-break: break-word;
      }
    }
  }
}
</style>
