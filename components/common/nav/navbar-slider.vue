<template>
  <div>
    <div class="navbar-side-menu" :class="isMenuExpanded ? 'is-active' : ''">
      <div class="navbar-side-user-area m-b-20">
        <div v-if="isLogin" class="twitter-user">
          <div class="m-r-10 p-t-5">
            <img :src="photoURL" class="navbar-twitter-icon" />
          </div>
          <div class="twitter-user-name">
            <p class="has-text-left is-white">
              <strong>{{ twitterNickname }}</strong>
            </p>
            <p class="has-text-left">{{ twitterUserName }}</p>
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
      <div>
        <nuxt-link
          :to="{ path: '/' }"
          class="navbar-item"
          @click.native="$emit('hide-menu')"
        >
          トップページ
        </nuxt-link>
        <nuxt-link
          :to="{ path: '/about' }"
          class="navbar-item"
          @click.native="$emit('hide-menu')"
        >
          このサイトは
        </nuxt-link>
        <nuxt-link
          :to="{ path: '/rule' }"
          class="navbar-item"
          @click.native="$emit('hide-menu')"
        >
          ルール
        </nuxt-link>
        <nuxt-link
          :to="{ path: '/faq' }"
          class="navbar-item"
          @click.native="$emit('hide-menu')"
        >
          よくある質問
        </nuxt-link>
        <nuxt-link
          :to="{ path: '/release-note' }"
          class="navbar-item"
          @click.native="$emit('hide-menu')"
        >
          更新情報
        </nuxt-link>
      </div>
      <div class="close-icon">
        <b-button
          type="is-dark"
          icon-pack="fas"
          icon-left="times"
          @click="$emit('hide-menu')"
        />
      </div>
    </div>
    <div
      class="navbar-side-menu-outside"
      :class="isMenuExpanded ? 'is-active' : ''"
      @click="$emit('hide-menu')"
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import firebase from '~/plugins/firebase'

@Component({
  components: {}
})
export default class NavBar extends Vue {
  @Prop({ type: Boolean })
  private isMenuExpanded!: boolean

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

  private async signin(): Promise<void> {
    const provider = new firebase.auth.TwitterAuthProvider()
    await firebase.auth().signInWithRedirect(provider)
  }
}
</script>

<style lang="scss" scoped>
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

    .twitter-user {
      display: flex;

      .twitter-user-name {
        flex: 1;
      }
    }

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

  .close-icon {
    position: absolute;
    top: 10px;
    right: 10px;
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
</style>
