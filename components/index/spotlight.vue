<template>
  <div class="spotlight-area">
    <img src="~/static/image/top.jpg" alt="top_image" />
    <div class="spotlight-tablet is-hidden-mobile has-text-left">
      <p
        class="spotlight-intro spotlight-shadow is-size-4 has-text-white"
        v-html="catchCopy"
      ></p>
      <b-button
        v-if="!isLogin"
        type="is-white"
        icon-pack="mdi"
        icon-left="twitter"
        outlined
        class="spotlight-signin-button spotlight-shadow"
        @click="$emit('signin')"
      >
        <strong>Sign in</strong>
      </b-button>
    </div>
    <div
      class="spotlight-mobile has-text-left is-block-mobile is-hidden-tablet"
    >
      <p
        class="spotlight-intro spotlight-shadow is-size-6 has-text-white"
        v-html="catchCopy"
      ></p>
    </div>
    <div
      v-if="!isLogin"
      class="spotlight-mobile-twitter-area is-block-mobile is-hidden-tablet"
    >
      <b-button
        size="is-small"
        type="is-white"
        icon-pack="mdi"
        icon-left="twitter"
        outlined
        class="spotlight-signin-button spotlight-shadow"
        @click="$emit('signin')"
      >
        <strong>Sign in</strong>
      </b-button>
    </div>
    <p
      class="spotlight-mobile-twitter-area spotlight-shadow is-size-6-tablet is-size-7-mobile has-text-white has-text-right"
    >
      {{ twitterUserName }}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Spotlight extends Vue {
  /** data */
  /** computed */
  public get isLogin(): boolean {
    return this.$store.getters.isLogin
  }

  private get catchCopy(): string {
    return 'HOWLING WOLFは<br />人狼ゲームが無料で遊べる<br />Webサービスです'
  }

  private get twitterUserName(): string {
    if (!this.isLogin) return ''
    const player = this.$store.getters.getPlayer
    return `user: ${player.nickname} @${player.twitter_user_name}`
  }

  /** methods */
}
</script>

<style lang="scss" scoped>
.spotlight-area {
  position: relative;
  margin-top: -52px;

  .spotlight-shadow {
    text-shadow: 2px 2px 5px rgba(69, 97, 133, 1),
      -2px 2px 5px rgba(69, 97, 133, 1), 2px -2px 5px rgba(69, 97, 133, 1),
      -2px -2px 5px rgba(69, 97, 133, 1);
  }

  .spotlight-tablet {
    position: absolute;
    left: 2%;
    top: 50%;

    .spotlight-intro {
      line-height: 2em;
    }

    .spotlight-signin-button {
      margin-top: 1em;
    }
  }

  .spotlight-mobile {
    position: absolute;
    left: 2%;
    bottom: 2%;

    .spotlight-intro {
      line-height: 2em;
    }
  }

  .spotlight-mobile-twitter-area {
    position: absolute;
    right: 2%;
    bottom: 4%;

    .spotlight-signin-button {
      text-shadow: 2px 2px 5px rgba(69, 97, 133, 1),
        -2px 2px 5px rgba(69, 97, 133, 1), 2px -2px 5px rgba(69, 97, 133, 1),
        -2px -2px 5px rgba(69, 97, 133, 1);
    }
  }
}
</style>
