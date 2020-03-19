<template>
  <div class="menu-wrap">
    <spotlight @signin="signin" />
    <div
      v-if="isStg"
      class="p-t-30 p-b-30 p-l-30 p-r-30"
      style="background: linear-gradient(#0a0a1a 0%, #112 50%, #0a0a1a 100%);"
    >
      <div
        style="border-radius: 4px; border: 1px solid #ff0000; width: 100%; background: linear-gradient(#0a0a1a 0%, #112 50%, #0a0a1a 100%);"
        class="has-text-danger is-size-6 p-t-5 p-b-5 p-l-5 p-r-5"
      >
        テストサーバのため、データは不定期に削除される可能性があります。
      </div>
    </div>
    <intro />
    <player-stats
      :myself-player="user"
      :is-loading="loadingAuth"
      @signin="signin"
      @logout="logout"
    />
    <village-list :loading-villages="loadingVillages" :villages="villages" />
    <charachip />
    <index-footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import qs from 'qs'
import cookies from 'cookie-universal-nuxt'
import firebase from '~/plugins/firebase'
// component
import spotlight from '~/components/index/spotlight.vue'
import intro from '~/components/index/intro.vue'
import loading from '~/components/loading.vue'
// type
import Villages from '~/components/type/villages.ts'
import Village from '~/components/type/village.ts'
import MyselfPlayer from '~/components/type/myself-player.ts'
import { VILLAGE_STATUS } from '~/components/const/consts'

// dynamic imports
const playerStats = () => import('~/components/index/player-stats.vue')
const villageList = () => import('~/components/index/village-list.vue')
const charachip = () => import('~/components/index/charachip.vue')
const indexFooter = () => import('~/components/index/index-footer.vue')

@Component({
  components: {
    spotlight,
    intro,
    playerStats,
    villageList,
    charachip,
    indexFooter,
    loading
  }
})
export default class TopPage extends Vue {
  /** head */
  private head() {
    return { title: '' }
  }

  /** data */
  // 村一覧
  private villages: Village[] = []
  // loading
  private loadingAuth: boolean = true
  private loadingVillages: boolean = true

  /** computed */
  private get user(): MyselfPlayer | null {
    return this.$store.getters.getPlayer
  }

  private get isDebug(): boolean {
    return (process.env as any).ENV === 'local'
  }

  private get isStg(): boolean {
    return (process.env as any).ENV !== 'production'
  }

  /** created */
  async created() {
    // 認証を待つ
    const user = await new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => resolve(user))
    })
    await this.$store.dispatch('LOGINOUT', {
      user
    })
    // ログイン後のリダイレクトの際、ユーザ情報をサーバに保存
    this.registerUserIfNeeded()

    // 自動生成村一覧
    this.loadingAuth = false
    this.loadingVillages = true
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
    this.loadingVillages = false
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
      now.setMinutes(now.getMinutes() + 50),
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
}
</script>

<style lang="scss">
.spotlight-shadow {
  text-shadow: 2px 2px 5px rgba(69, 97, 133, 1),
    -2px 2px 5px rgba(69, 97, 133, 1), 2px -2px 5px rgba(69, 97, 133, 1),
    -2px -2px 5px rgba(69, 97, 133, 1);
}
.button.spotlight-shadow:hover {
  text-shadow: none;
}
.menu-wrap {
  background-color: #0a0a1a;

  .menu-area {
    background: linear-gradient(#0a0a1a 0%, #112 50%, #0a0a1a 100%);
    color: $white;
    padding: 30px 30px;
    margin-bottom: 50px;
  }
  .menu-area:last-child {
    margin-bottom: 0;
  }
}
</style>
