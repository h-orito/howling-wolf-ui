<template>
  <div class="container is-size-7">
    <loading v-if="loadingVillage" :message="'村情報を読み込み中...'"></loading>
    <div v-if="!loadingVillage">
      <loading v-if="loadingMessage" :message="'発言を読み込み中...'"></loading>
      <div v-if="!loadingMessage">
        <message-card
          v-for="message in messages.message_list"
          :key="message['id']"
          :message="message"
        ></message-card>
      </div>
      <div v-if="!loadingSituation">
        <participate :situation="situation"></participate>
      </div>
      <div class="w4b-footer-info-area buttons are-small">
        <div>生存 7/13</div>
        <button class="button w4b-footer-button">CO</button>
        <button class="button w4b-footer-button">定型文</button>
        <button class="button w4b-footer-button">発言する</button>
      </div>
      <div class="w4b-footer-member-skill-area">
        <div class="w4b-footer-skill-area">
          <p class="is-size-2">占</p>
        </div>
        <div class="w4b-footer-member-area">
          <div class="w4b-icon-area">
            <div class="w4b-icon">楽</div>
            <p class="w4b-icon-status has-text-danger">2d▲</p>
          </div>
          <div class="w4b-icon-area">
            <div class="w4b-icon">長</div>
          </div>
          <div class="w4b-icon-area">
            <div class="w4b-icon">羊</div>
          </div>
          <div class="w4b-icon-area">
            <div class="w4b-icon">修</div>
          </div>
          <div class="w4b-icon-area">
            <div class="w4b-icon">書</div>
          </div>
          <div class="w4b-icon-area">
            <div class="w4b-icon">樵</div>
          </div>
          <div class="w4b-icon-area">
            <div class="w4b-icon">青</div>
          </div>
          <div class="w4b-icon-area">
            <div class="w4b-icon">旅</div>
          </div>
          <div class="w4b-icon-area">
            <div class="w4b-icon">商</div>
          </div>
          <div class="w4b-icon-area">
            <div class="w4b-icon">農</div>
          </div>
        </div>
      </div>
      <div class="w4b-footer-menu buttons are-small">
        <button class="button w4b-footer-button">メニュー</button>
        <button class="button w4b-footer-button">ルール</button>
        <button class="button w4b-footer-button">フィルタ</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from '@nuxtjs/axios'
import Village from '~/components/type/village'
import VillageDay from '~/components/type/village-day'
import Messages from '~/components/type/messages'
import Message from '~/components/type/message'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import loading from '~/components/loading.vue'
import messageCard from '~/components/village/message/message-card.vue'
import participate from '~/components/village/participate/participate.vue'

@Component({
  components: {
    loading,
    messageCard,
    participate
  },
  async asyncData({ query }) {
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

  /** created */
  private async created(): Promise<any> {
    // 村情報読み込み
    this.village = await this.loadVillage()
    // 発言読み込み
    this.messages = await this.loadMessage()
    // 状況読み込み
    this.situation = await this.loadSituation()
  }

  /** methods */
  private async loadVillage(): Promise<Village> {
    return this.$axios.$get(`/village/${this.villageId}`)
  }

  private async loadMessage(): Promise<Messages> {
    if (this.latestDay == null) return Promise.reject()
    return this.$axios.$get(
      `/village/${this.village!.id}/day/${this.latestDay.day}/time/${
        this.latestDay.noonnight
      }/message-list`
    )
  }

  private async loadSituation(): Promise<any> {
    if (this.village == null) return Promise.reject()
    return this.$axios.$get(`/village/${this.village.id}/situation`)
  }
}
</script>
<style lang="scss" scoped>
.w4b-main {
  padding-bottom: 124px;
  overflow-y: scroll;

  .w4b-chat-area {
    background-color: $twitter-invert;
    padding: 5px;
    .w4b-chat-message {
      line-height: 1.5;
      text-align: left;
      white-space: pre-wrap;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
}

.w4b-lefttime {
  position: fixed;
  top: 5px;
  width: 90%;
  left: 5%;
  padding: 5px;
  margin-bottom: 0px;
  z-index: 100;
  border-radius: 25px;
}

.w4b-footer-menu {
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 37px;
  z-index: 100;
  background-color: $primary;
  display: flex;
  padding: 5px;
  margin-bottom: 0px !important;

  .w4b-footer-button {
    flex: 1;
  }
}

.w4b-footer-member-skill-area {
  position: fixed;
  bottom: 37px;
  left: 0px;
  width: 100%;
  height: 55px;
  z-index: 100;
  background-color: $twitter;
  display: flex;
  padding: 5px;

  .w4b-footer-member-area {
    flex: 1;
    display: flex;

    .w4b-icon-area {
      height: 50px;
      width: 40px;
      text-align: center;

      .w4b-icon {
        width: 30px;
        height: 30px;
        border-radius: 30px;
        background-color: $primary;
        color: $white;
        display: flex;
        -webkit-align-items: center;
        align-items: center;
        -webkit-justify-content: center;
        justify-content: center;
        margin-left: auto;
        margin-right: auto;
      }
    }
  }
  .w4b-footer-skill-area {
    width: 50px;
    border: 1px solid $primary;
    color: $primary;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
  }
}

.w4b-footer-info-area {
  position: fixed;
  bottom: 87px;
  left: 0px;
  width: 100%;
  height: 37px;
  z-index: 100;
  background-color: $primary;
  display: flex;
  padding: 5px;
  margin-bottom: 0px !important;
}
</style>

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
      }
    }
  }
}
</style>
