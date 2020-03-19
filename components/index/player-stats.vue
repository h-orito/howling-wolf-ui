<template>
  <div class="player-area">
    <div v-if="isLoading" class="p-t-20 p-b-40">
      <p class="spotlight-shadow">認証情報を読み込み中...</p>
    </div>
    <div v-if="!isLoading" class="p-t-20 p-b-40 m-r-30 m-l-30">
      <div v-if="!isLogin">
        <div class="p-t-20 p-b-20">
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
        <div class="spotlight-shadow p-t-20 p-b-20">
          <p class="is-size-5-tablet is-size-6-mobile">
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
        <div class="columns">
          <div class="column is-6">
            <b-button
              :to="{ path: 'stats', query: { id: myselfPlayer.id } }"
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import MyselfPlayer from '../type/myself-player'

@Component({
  components: {}
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

  /** methods */
}
</script>

<style lang="scss" scoped>
.player-area {
  background: linear-gradient(#0a0a1a 0%, #112 50%, #0a0a1a 100%);
  color: $white;
}
</style>
