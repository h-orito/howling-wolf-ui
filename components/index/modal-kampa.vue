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
        <p class="modal-card-title has-text-left">投げ銭について</p>
      </header>
      <section class="modal-card-body has-text-left is-size-7">
        <p class="content">
          開発を応援してくださりありがとうございます。<br />
          投げ銭いただける方は以下のいずれかの方法でお願いします。
        </p>
        <h2 class="title is-size-6 m-b-10">
          Amazonほしいものリスト
        </h2>
        <div class="content">
          Amazonほしいものリストから選んで開発者に送ることができます。<br />
          <a
            href="https://www.amazon.jp/hz/wishlist/ls/1KZSJAJS1ETW4?ref_=wl_share"
            target="_blank"
            class="button is-small is-primary"
            >Amazonほしいものリスト</a
          >
        </div>
        <h2 class="title is-size-6 m-t-10 m-b-10">
          Amazonアソシエイト経由でお買い物
        </h2>
        <div class="content">
          下記からAmazonに遷移してカートに追加＆購入すると、管理人に若干の紹介料が入ります。<br />
          <iframe
            src="https://rcm-fe.amazon-adsystem.com/e/cm?o=9&p=20&l=ez&f=ifr&linkID=c5438f7fc033eeee42260876403c6c51&t=wolfort0d-22&tracking_id=wolfort0d-22"
            width="120"
            height="90"
            scrolling="no"
            border="0"
            marginwidth="0"
            style="border:none;"
            frameborder="0"
          ></iframe>
        </div>

        <h4 class="is-size-6">補足</h4>
        <ul class="is-size-7 content">
          <li>
            頂いた改善提案、ご要望については投げ銭の有無に関係なく積極的に取り入れていくので、Twitter
            <a href="https://twitter.com/ort_dev" target="_blank">@ort_dev</a
            >までお願いします。
          </li>
        </ul>
      </section>
      <footer
        class="modal-card-foot"
        style="justify-content: flex-end !important;"
      >
        <b-button type="is-secondary" size="is-small" @click="close">
          閉じる
        </b-button>
      </footer>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class KampaModal extends Vue {
  @Prop({ type: Boolean })
  private isOpen!: boolean

  private close(): void {
    this.$emit('close-modal')
  }
}
</script>

<style></style>
