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
        <h2 class="title is-size-7 m-b-10">
          Amazonギフトカード（15円〜、手数料なし）
        </h2>
        <div class="content">
          <p>
            Kampa!というサービスを利用することで、個人情報をやりとりすることなくAmazonギフトカードで投げ銭することができます。<br />
            以下の手順でお願いします。
          </p>
          <ol>
            <li>
              「Amazonギフトカードで投げ銭する」よりKampa!サイトへ遷移
            </li>
            <li>
              表示されたページのメールアドレスをコピーし、Kampa!ボタンをクリック
            </li>
            <li>
              「金額」に投げ銭していただける金額を入力、「受取人」にコピーしたメールアドレスを貼り付けし、購入
              （応援メッセージをいただけると喜びます）<br />
              <p class="has-text-danger">
                Amazonページ遷移時、デフォルトは10,000円に設定されており、
                Amazonにログインしている場合は贈り主に氏名が自動入力されているようなのでご注意ください。※金額は15円〜で設定可能です。
              </p>
            </li>
          </ol>
          <a
            href="http://kampa.me/t/lxc"
            target="_blank"
            class="button is-small is-primary"
            >Amazonギフトカードで投げ銭する</a
          >
        </div>
        <h2 class="title is-size-7 m-b-10">
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

        <h4 class="is-size-5">補足</h4>
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
