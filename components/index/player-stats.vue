<template>
  <div class="menu-area">
    <div v-if="isLoading">
      <p class="spotlight-shadow">認証情報を読み込み中...</p>
    </div>
    <div v-if="!isLoading">
      <div v-if="!isLogin">
        <div class="m-b-50">
          <p class="is-size-5-tablet is-size-6-mobile spotlight-shadow">
            アプリ連携すると参加できます
          </p>
          <p class="is-size-7">名前とユーザ名がエピローグで表示されます</p>
        </div>
        <b-button
          type="is-white"
          icon-pack="fab"
          icon-left="twitter"
          outlined
          expanded
          class="spotlight-shadow"
          @click="$emit('signin')"
        >
          <strong>Twitterアカウントでログイン</strong>
        </b-button>
      </div>
      <div v-if="isLogin">
        <div class="spotlight-shadow m-b-20">
          <p class="is-size-5">
            ようこそ
          </p>
          <p class="spotlight-shadow">
            {{
              myselfPlayer.nickname +
                ' @' +
                myselfPlayer.twitter_user_name +
                ' さん'
            }}
          </p>
        </div>
        <div v-if="!hasIntroduced" class="m-b-20">
          <p class="is-size-7">
            詳細戦績ページで招待を受けることができます。<br />1名以上に招待を受けると参加することができます。
          </p>
        </div>
        <div class="columns">
          <div class="column is-6">
            <b-button
              :to="{ path: 'player-record', query: { id: myselfPlayer.id } }"
              tag="nuxt-link"
              type="is-white"
              icon-pack="fas"
              icon-left="chart-bar"
              outlined
              expanded
              class="spotlight-shadow"
            >
              <strong>詳細戦績</strong>
            </b-button>
          </div>
          <div class="column is-6">
            <b-button
              type="is-white"
              icon-pack="fab"
              icon-left="twitter"
              outlined
              expanded
              class="spotlight-shadow"
              @click="$emit('logout')"
            >
              <strong>ログアウト</strong>
            </b-button>
          </div>
        </div>
        <div v-if="isDispParticipatingVillages">
          <div class="spotlight-shadow m-b-20">
            <p class="is-size-6">参加している村</p>
          </div>
          <div class="columns">
            <village-card
              v-for="village in participatingVillages"
              :key="village.key"
              :village="village"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import SimpleVillage from '~/components/type/simple-village'
import MyselfPlayer from '~/components/type/myself-player'
import { VILLAGE_STATUS } from '~/components/const/consts'
const villageCard = () => import('~/components/index/village-card.vue')

@Component({
  components: { villageCard }
})
export default class extends Vue {
  /** data */
  @Prop({ type: Object })
  private myselfPlayer!: MyselfPlayer | null

  @Prop({ type: Boolean })
  private isLoading!: boolean

  /** computed */
  public get isLogin(): boolean {
    return this.$store.getters.isLogin
  }

  private get hasIntroduced(): boolean {
    return this.$store.getters.hasIntroduced
  }

  private get participatingVillages(): SimpleVillage[] {
    if (!this.isLogin) return []
    if (!this.myselfPlayer) return []
    const progressVillages = this.myselfPlayer.participate_progress_villages
      .list
    const epilogueVillages = this.myselfPlayer.participate_finished_villages.list.filter(
      village => village.status.code === VILLAGE_STATUS.EPILOGUE
    )
    return progressVillages.concat(epilogueVillages)
  }

  private get isDispParticipatingVillages(): boolean {
    return this.participatingVillages.length > 0
  }

  /** methods */
}
</script>
