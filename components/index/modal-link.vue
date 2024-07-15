<template>
  <b-modal
    :active="isOpen"
    has-modal-card
    trap-focus
    aria-role="dialog"
    aria-modal
    :on-cancel="close"
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title has-text-left">他SNSアカウント連携</p>
      </header>
      <section class="modal-card-body has-text-left">
        <div class="content">
          <p>
            追加でログインすると、現在ログインしているアカウントに紐付けることができます。<br />
            例えば、Twitter連携＋Google連携にしておくと、Twitter連携できなくなった場合もGoogleアカウントでログインすることができます。
          </p>
          <p class="has-text-danger m-b-2">
            なお、ログインしたことがあるアカウントで追加ログインすることはできません。
          </p>

          <div class="m-t-3 m-b-3">
            <hr class="m-b-3" />
            <b-button
              type="is-primary"
              size="is-small"
              :disabled="isAlreadyTwitterLinked"
              @click="$emit('link-with-twitter')"
            >
              Twitterログイン
            </b-button>
            <p v-if="!isAlreadyTwitterLinked">
              エピローグでニックネームおよびTwitterのIDが公開されます。<br />
              ニックネームはマイページで変更することができます。
            </p>
            <p v-else>既に連携済みです。</p>
          </div>
          <div class="my-3">
            <hr class="mb-3" />
            <b-button
              type="is-primary"
              size="is-small"
              :disabled="isAlreadyGoogleLinked"
              @click="$emit('link-with-google')"
            >
              Googleログイン
            </b-button>
            <p v-if="!isAlreadyGoogleLinked">
              エピローグでニックネームが公開されます。<br />
              ニックネームはマイページで変更することができます。<br />
              メールアドレスが表示されることはありません。
            </p>
            <p v-else>既に連携済みです。</p>
          </div>
        </div>
      </section>
      <footer
        class="modal-card-foot"
        style="justify-content: flex-end !important;"
      >
        <b-button
          type="is-secondary"
          size="is-small"
          @click="$emit('close-modal')"
        >
          閉じる
        </b-button>
      </footer>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// component
// type

@Component({
  components: {}
})
export default class ModalSignin extends Vue {
  @Prop({ type: Boolean })
  private isOpen!: boolean

  private close(): void {
    this.$emit('close')
  }

  private get user(): any {
    console.log(this.$store.getters.getUser)
    return this.$store.getters.getUser
  }

  private get isAlreadyTwitterLinked(): boolean {
    return (
      !!this.user &&
      this.user.providerData.some(
        providerData => providerData.providerId === 'twitter.com'
      )
    )
  }

  private get isAlreadyGoogleLinked(): boolean {
    return (
      !!this.user &&
      this.user.providerData.some(
        providerData => providerData.providerId === 'google.com'
      )
    )
  }
}
</script>

<style lang="scss" scoped>
/** header, footerを隠さない */
.modal-card {
  color: #333;
  max-height: calc(100vh - 6.5rem);
}
</style>
