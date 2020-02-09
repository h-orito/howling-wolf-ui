<template>
  <nav class="navbar is-dark-opacity is-fixed-top">
    <div class="navbar-menu-icon-area">
      <a
        role="button"
        aria-level="menu"
        class="navbar-burger burger navbar-menu-icon"
        :class="isMenuExpanded ? 'is-active' : ''"
        @click="toggleMenu"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-brand navbar-brand-center">
      <a
        class="navbar-item has-text-center nuxt-link-exact-active nuxt-link-active"
        @click="toHead"
      >
        HOWLING WOLF
      </a>
    </div>
    <div class="navbar-side-menu" :class="isMenuExpanded ? 'is-active' : ''">
      <div class="navbar-side-user-area m-b-20">
        <div v-if="isLogin">
          <div style="display: flex;">
            <div class="m-r-10 p-t-5">
              <img :src="photoURL" class="navbar-twitter-icon" />
            </div>
            <div style="flex: 1;">
              <p class="has-text-left is-white">
                <strong>{{ twitterNickname }}</strong>
              </p>
              <p class="has-text-left">{{ twitterUserName }}</p>
            </div>
          </div>
        </div>
        <div v-if="!isLogin">
          <b-button
            type="is-primary"
            icon-pack="mdi"
            icon-left="twitter"
            @click="signin"
          >
            ログイン
          </b-button>
        </div>
      </div>
      <div class="navbar-start">
        <nuxt-link
          :to="{ path: '/' }"
          class="navbar-item"
          @click.native="hideMenu"
        >
          トップページ
        </nuxt-link>
        <nuxt-link
          :to="{ path: 'about' }"
          class="navbar-item"
          @click.native="hideMenu"
        >
          このサイトは
        </nuxt-link>
        <nuxt-link
          :to="{ path: 'rule' }"
          class="navbar-item"
          @click.native="hideMenu"
        >
          ルール
        </nuxt-link>
        <nuxt-link
          :to="{ path: 'faq' }"
          class="navbar-item"
          @click.native="hideMenu"
        >
          よくある質問
        </nuxt-link>
        <nuxt-link
          :to="{ path: 'release-note' }"
          class="navbar-item"
          @click.native="hideMenu"
        >
          更新情報
        </nuxt-link>
      </div>
      <div class="navbar-end">
        <div data-v-597fb36e="" class="navbar-item"></div>
      </div>
    </div>
    <div
      class="navbar-side-menu-outside"
      :class="isMenuExpanded ? 'is-active' : ''"
      @click="hideMenu"
    ></div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import firebase from '~/plugins/firebase'
import MyselfPlayer from '~/components/type/myself-player'

@Component({
  components: {}
})
export default class NavBar extends Vue {
  private isMenuExpanded: boolean = false

  private get isLogin(): boolean {
    return this.$store.getters.isLogin
  }

  private get twitterUserName(): string {
    if (!this.isLogin) return ''
    const player = this.$store.getters.getPlayer
    return `@${player.twitter_user_name}`
  }

  private get twitterNickname(): string {
    if (!this.isLogin) return ''
    const player = this.$store.getters.getPlayer
    return player.nickname
  }

  private get photoURL(): any {
    return this.$store.getters.getPhotoUrl
  }

  private toggleMenu(): void {
    this.isMenuExpanded = !this.isMenuExpanded
  }

  private hideMenu(): void {
    this.isMenuExpanded = false
  }

  private async signin(): Promise<void> {
    const provider = new firebase.auth.TwitterAuthProvider()
    await firebase.auth().signInWithRedirect(provider)
  }

  private toHead(): void {
    if (document.scrollingElement == null) return
    if (document.scrollingElement.scrollTop < 10) {
      document.scrollingElement.scrollTop = 0
    } else {
      document.scrollingElement.scrollTop =
        document.scrollingElement.scrollTop / 1.1
      setTimeout(this.toHead, 10)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  .navbar-menu-icon-area {
    position: absolute;
    left: 5px;
    width: 40px;
    height: 3.25rem;

    .navbar-menu-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .navbar-brand-center {
    justify-content: center;
    align-items: center;
  }
  .navbar-side-menu {
    position: absolute;
    left: 0;
    top: 0;
    background-color: $dark;
    height: 100vh;
    width: 0%;
    overflow-x: hidden;
    overflow-y: scroll;
    transition-property: all;
    transition-duration: 200ms;
    transition-delay: 0s;
    transition-timing-function: ease;

    .navbar-side-user-area {
      padding: 8px 12px;

      strong {
        color: $white;
      }
      .navbar-twitter-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }

    .navbar-item {
      color: $white;
    }
  }
  .navbar-side-menu.is-active {
    width: 300px;
    padding: 10px;
  }
  .navbar-side-menu-outside {
    display: none;
    position: absolute;
    right: 0;
    top: 0;
    background-color: hsla(0, 0%, 21%, 0.4);
    height: 100vh;
    width: calc(100% - 300px);
  }
  .navbar-side-menu-outside.is-active {
    display: block;
  }
}
</style>
