<template>
  <div>
    <spotlight @signin="signin" />
    <section class="section" v-if="isStg">
      <div class="container">
        <p class="has-text-danger is-size-6">
          テストサーバのため、データは不定期に削除される可能性があります。
        </p>
      </div>
    </section>
    <player-stats :myself-player="user" @signin="signin" @logout="logout" />
    <village-list :loading-villages="loadingVillages" :villages="villages" />
    <section class="section">
      <div class="container">
        <h1 class="title is-5">よくある質問</h1>
        <div class="columns">
          <div class="column">
            <nuxt-link :to="{ path: 'faq' }" class="button is-primary"
              >よくある質問を見る</nuxt-link
            >
          </div>
        </div>
      </div>
    </section>
    <section class="section has-background-light">
      <div class="container">
        <h1 class="title is-5">更新情報</h1>
        <div class="columns">
          <div class="column">
            <ul
              class="content has-text-left is-size-7"
              style="list-style: inside;"
            >
              <li>2020/02/08 開発中</li>
            </ul>
            <nuxt-link :to="{ path: 'release-note' }" class="button is-primary"
              >過去の更新情報を見る</nuxt-link
            >
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h1 class="title is-5">その他情報</h1>
        <div class="columns">
          <div class="column">
            <ul
              class="content has-text-left is-size-7"
              style="list-style: inside;"
            >
              <li>
                要望、改善提案、不具合報告はTwitter<a
                  href="https://twitter.com/ort_dev"
                  target="_blank"
                  >@ort_dev</a
                >へお願いします
              </li>
              <li>
                投げ銭いただける方は
                <a @click="openKampaModal" href="javascript:void(0);">こちら</a
                >からお願いします
              </li>
              <li>
                <a @click="openTermModal" href="javascript:void(0);"
                  >利用規約</a
                >
              </li>
              <li>
                <a @click="openPolicyModal" href="javascript:void(0);"
                  >プライバシーポリシー</a
                >
              </li>
            </ul>
            <kampa-modal
              :is-open="isKampaModalOpen"
              @close-modal="closeKampaModal"
            />
            <term-modal
              :is-open="isTermModalOpen"
              @close-modal="closeTermModal"
            />
            <policy-modal
              :is-open="isPolicyModalOpen"
              @close-modal="closePolicyModal"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import qs from 'qs'
import cookies from 'cookie-universal-nuxt'
import firebase from '~/plugins/firebase'
// component
import spotlight from '~/components/index/spotlight.vue'
import playerStats from '~/components/index/player-stats.vue'
import loading from '~/components/loading.vue'
import kampaModal from '~/components/index/modal-kampa.vue'
import termModal from '~/components/index/modal-term.vue'
import policyModal from '~/components/index/modal-policy.vue'
import villageList from '~/components/index/village-list.vue'
// type
import Villages from '~/components/type/villages.ts'
import Village from '~/components/type/village.ts'
import MyselfPlayer from '~/components/type/myself-player.ts'
import { VILLAGE_STATUS } from '~/components/const/consts'

@Component({
  components: {
    spotlight,
    playerStats,
    loading,
    kampaModal,
    termModal,
    policyModal,
    villageList
  }
})
export default class TopPage extends Vue {
  /** head */
  private head() {
    return { title: '' }
  }

  /** data */
  // 村一覧
  private villages: Village[] | null = null
  // Kampa
  private isKampaModalOpen: boolean = false
  private isTermModalOpen: boolean = false
  private isPolicyModalOpen: boolean = false

  /** computed */
  private get loadingVillages(): boolean {
    return this.villages == null
  }

  private get user(): MyselfPlayer | null {
    return this.$store.getters.getPlayer
  }

  private get photoURL(): any {
    return this.$store.getters.getPhotoUrl
  }

  private get isLogin(): boolean {
    return this.$store.getters.isLogin
  }

  private get isDebug(): boolean {
    return (process.env as any).ENV === 'local'
  }

  private get isStg(): boolean {
    return (process.env as any).ENV !== 'production'
  }

  /** created */
  async created() {
    // ログイン後のリダイレクトの際、ユーザ情報をサーバに保存
    this.registerUserIfNeeded()

    // 認証を待つ
    const user = await new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => resolve(user))
    })
    await this.$store.dispatch('LOGINOUT', {
      user
    })

    // 自動生成村一覧
    const res = await this.$axios.$get('/village/list', {
      params: {
        village_status: [
          VILLAGE_STATUS.PROLOGUE,
          VILLAGE_STATUS.PROGRESS,
          VILLAGE_STATUS.EPILOGUE
        ],
        is_auto_generate: true
      },
      paramsSerializer: params =>
        qs.stringify(params, { arrayFormat: 'repeat' })
    })
    this.villages = (res as Villages).list
  }

  /** methods */
  private openModal(selector: string): void {
    const modal = document.querySelector(selector)
    const html = document.querySelector('html')
    modal!.classList.add('is-active')
    html!.classList.add('is-clipped')
    modal!
      .querySelector('.modal-background')!
      .addEventListener('click', function(e) {
        e.preventDefault()
        modal!.classList.remove('is-active')
        html!.classList.remove('is-clipped')
      })
  }

  private async signin(): Promise<void> {
    const provider = new firebase.auth.TwitterAuthProvider()
    await firebase.auth().signInWithRedirect(provider)
  }

  private async registerUserIfNeeded(): Promise<void> {
    const redirectResult = await firebase.auth().getRedirectResult()
    if (!redirectResult.additionalUserInfo || !redirectResult.user) {
      return
    }
    const twitterUsername = redirectResult.additionalUserInfo.username
    const user = redirectResult.user
    const idToken = await user.getIdToken(false)
    this.$cookies.set('id-token', idToken, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })
    // 1時間で有効期限が切れるので50分後に再取得させる
    const now = new Date()
    this.$cookies.set(
      'id-token-check-date',
      now.setMinutes(now.getHours() + 50),
      {
        path: '/',
        maxAge: 60 * 60 * 24 * 30
      }
    )
    // 変更しても古いままなので取得できたら無理やりとる
    let displayName = user.displayName
    if (
      redirectResult.additionalUserInfo.profile != null &&
      (redirectResult.additionalUserInfo.profile as any).name != null
    ) {
      displayName = (redirectResult.additionalUserInfo.profile as any).name
    }
    return this.$axios.$post('/player/nickname', {
      nickname: displayName,
      twitter_user_name: twitterUsername
    })
  }

  private async logout(): Promise<void> {
    await firebase.auth().signOut()
    location.reload()
  }

  private openKampaModal(): void {
    this.isKampaModalOpen = true
  }

  private closeKampaModal(): void {
    this.isKampaModalOpen = false
  }

  private openTermModal(): void {
    this.isTermModalOpen = true
  }

  private closeTermModal(): void {
    this.isTermModalOpen = false
  }

  private openPolicyModal(): void {
    this.isPolicyModalOpen = true
  }

  private closePolicyModal(): void {
    this.isPolicyModalOpen = false
  }
}
</script>

<style lang="scss" scoped></style>
