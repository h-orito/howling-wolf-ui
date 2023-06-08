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
        <p class="modal-card-title has-text-left">ログイン</p>
      </header>
      <section class="modal-card-body has-text-left">
        <div class="content">
          <p>いずれかのアカウントと連携してログインしてください。</p>
          <p class="has-text-danger m-b-2">
            既存のアカウントに別のログイン方法を紐付けたい場合は、まず既存のアカウントでログインしてください。<br />
            ログインしたことがあるアカウントは後から追加で紐付けることができないので、ご注意ください。
          </p>

          <div class="m-t-3 m-b-3">
            <hr class="m-b-3" />
            <b-button
              type="is-primary"
              size="is-small"
              @click="$emit('signin-with-twitter')"
            >
              Twitterログイン
            </b-button>
            <p>
              エピローグでニックネームおよびTwitterのIDが公開されます。<br />
              ニックネームはマイページで変更することができます。
            </p>
          </div>
          <div class="my-3">
            <hr class="mb-3" />
            <b-button
              type="is-primary"
              size="is-small"
              @click="$emit('signin-with-google')"
            >
              Googleログイン
            </b-button>
            <p>
              エピローグでニックネームが公開されます。<br />
              ニックネームはマイページで変更することができます。<br />
              メールアドレスが表示されることはありません。
            </p>
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
}
</script>

<style lang="scss" scoped>
/** header, footerを隠さない */
.modal-card {
  color: #333;
  max-height: calc(100vh - 6.5rem);
}
</style>
