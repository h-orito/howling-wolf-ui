<template>
  <section class="section">
    <div class="container">
      <div v-if="!isLogin">
        <h1 class="title is-5">はじめる</h1>
        <b-button
          v-if="!isLogin"
          type="is-primary"
          icon-pack="mdi"
          icon-left="twitter"
          @click="$emit('signin')"
        >
          <strong>Twitterアカウントでログイン</strong>
        </b-button>
        <p class="m-t-10 is-size-7">
          参加にはアプリ連携が必要です。名前とユーザ名がエピローグで表示されます。
        </p>
      </div>
      <div v-if="isLogin">
        <div class="card">
          <div class="card-content">
            <div class="media">
              <div v-if="photoURL != null" class="media-left">
                <img :src="photoURL" />
              </div>
              <div class="media-content">
                <p class="title is-6">{{ myselfPlayer.nickname }}</p>
                <p class="subtitle is-6">
                  <a v-if="twitterUrl" :href="twitterUrl" target="_blank"
                    >@{{ myselfPlayer.twitter_user_name }}</a
                  >
                </p>
              </div>
            </div>

            <!-- <div class="content">
              <p class="has-text-left">
                ここに戦績を表示
              </p>
            </div> -->
          </div>
          <footer class="card-footer">
            <nuxt-link
              class="card-footer-item"
              :to="{ path: 'stats', query: { id: myselfPlayer.id } }"
              >詳細戦績</nuxt-link
            >
            <a
              href="javascript:void(0);"
              class="card-footer-item"
              @click="$emit('logout')"
              >ログアウト</a
            >
          </footer>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import MyselfPlayer from '../type/myself-player'

@Component({
  components: {}
})
export default class extends Vue {
  /** data */
  @Prop({ type: Object })
  private myselfPlayer!: MyselfPlayer | null

  /** computed */
  public get isLogin(): boolean {
    return this.$store.getters.isLogin
  }

  public get photoURL(): any {
    return this.$store.getters.getPhotoUrl
  }

  public get twitterUrl(): string | null {
    if (this.myselfPlayer == null) return null
    return `https://twitter.com/${this.myselfPlayer.twitter_user_name}`
  }

  /** methods */
}
</script>

<style lang="scss" scoped></style>
