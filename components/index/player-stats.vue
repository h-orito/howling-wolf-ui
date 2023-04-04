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
        </div>
        <b-button
          type="is-white"
          outlined
          expanded
          class="spotlight-shadow"
          @click="openSigninModal"
        >
          <strong>ログイン</strong>
        </b-button>
      </div>
      <div v-if="isLogin">
        <div class="spotlight-shadow m-b-20">
          <p class="is-size-5">
            ようこそ
          </p>
          <p class="spotlight-shadow">{{ name }} さん</p>
          <p class="spotlight-shadow is-size-7">
            ニックネームはマイページで変更できます
          </p>
        </div>
        <div v-if="!hasIntroduced" class="m-b-20">
          <p class="is-size-7">
            詳細戦績ページで招待を受けることができます。<br />1名以上に招待を受けると参加することができます。
          </p>
        </div>
        <div class="columns">
          <div class="column is-4">
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
              <strong>マイページ</strong>
            </b-button>
          </div>
          <div class="column is-4">
            <b-button
              type="is-white"
              outlined
              expanded
              class="spotlight-shadow"
              @click="openLinkModal"
            >
              <strong>他SNSアカウント連携</strong>
            </b-button>
          </div>
          <div class="column is-4">
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
    <signin-modal
      :is-open="isSigninModalOpen"
      @close-modal="closeSigninModal"
      @signin-with-twitter="$emit('signin-with-twitter')"
      @signin-with-google="$emit('signin-with-google')"
    />
    <link-modal
      :is-open="isLinkModalOpen"
      @close-modal="closeLinkModal"
      @link-with-twitter="$emit('link-with-twitter')"
      @link-with-google="$emit('link-with-google')"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import SimpleVillage from '~/components/type/simple-village'
import MyselfPlayer from '~/components/type/myself-player'
import { VILLAGE_STATUS } from '~/components/const/consts'
const villageCard = () => import('~/components/index/village-card.vue')
const signinModal = () => import('~/components/index/modal-signin.vue')
const linkModal = () => import('~/components/index/modal-link.vue')

@Component({
  components: { villageCard, signinModal, linkModal }
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

  private get name(): string | null {
    const nickname = this.myselfPlayer?.nickname
    const twitterUserName = this.myselfPlayer?.twitter_user_name
    if (twitterUserName) {
      return `${nickname}@${twitterUserName}`
    } else {
      return nickname ?? null
    }
  }

  private get isDispParticipatingVillages(): boolean {
    return this.participatingVillages.length > 0
  }

  private isSigninModalOpen: boolean = false
  private openSigninModal(): void {
    this.isSigninModalOpen = true
  }

  private closeSigninModal(): void {
    this.isSigninModalOpen = false
  }

  private isLinkModalOpen: boolean = false
  private openLinkModal(): void {
    this.isLinkModalOpen = true
  }

  private closeLinkModal(): void {
    this.isLinkModalOpen = false
  }

  /** methods */
}
</script>
