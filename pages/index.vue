<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title is-5">人狼で寝不足になっていませんか？</h1>
        <div class="columns">
          <div class="column">
            <p class="content">
              汝は多忙なりや？は多忙な方向けのオプションルールを盛り込んだオンライン人狼が遊べるサービスです。
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="section has-background-light">
      <div class="container">
        <div v-if="!isLogin">
          <h1 class="title is-5">はじめる</h1>
          <nuxt-link class="button is-primary" :to="{ path: 'signup' }"
            >新規登録</nuxt-link
          >
          <nuxt-link class="button is-primary" :to="{ path: 'signin' }"
            >ログイン</nuxt-link
          >
        </div>
        <div v-if="isLogin">
          <h1 class="title is-5">ようこそ</h1>
          <p class="content">{{ user.email }} さん</p>
          <nuxt-link class="button is-primary" :to="{ path: 'user' }"
            >ユーザ情報編集</nuxt-link
          >
          <button class="button" @click="logout">ログアウト</button>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h1 class="title is-5">村一覧</h1>
        <p v-if="villages == null || villages.length == 0" class="content">
          現在部屋がありません。
        </p>
        <br />
        <div class="columns">
          <village-card
            v-for="village in villages"
            :key="village['key']"
            :village="village"
          ></village-card>
        </div>
        <nuxt-link
          v-if="isLogin && user.emailVerified"
          class="button is-primary"
          to="/create-room"
          >部屋を作成</nuxt-link
        >
        <div style="margin-top: 15px;">
          <nuxt-link to="/room-list">終了した部屋を見る</nuxt-link>
        </div>
      </div>
    </section>
    <section class="section has-background-light">
      <div class="container">
        <h1 class="title is-5">よくある質問</h1>
        <div class="columns">
          <div class="column">
            <nuxt-link class="button is-primary" :to="{ path: 'faq' }"
              >よくある質問を見る</nuxt-link
            >
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h1 class="title is-5">更新情報</h1>
        <div class="columns">
          <div class="column">
            <ul
              class="content has-text-left is-size-7"
              style="list-style: inside;"
            >
              <li>2019/03/25 作成中</li>
            </ul>
            <nuxt-link class="button is-primary" :to="{ path: 'release-note' }"
              >過去の更新情報を見る</nuxt-link
            >
          </div>
        </div>
      </div>
    </section>
    <section class="section has-background-light">
      <div class="container">
        <h1 class="title is-5">その他情報</h1>
        <div class="columns">
          <div class="column">
            <ul
              class="content has-text-left is-size-7"
              style="list-style: inside;"
            >
              <li>
                要望、改善提案、不具合報告はTwitter
                <a href="https://twitter.com/ort_dev" target="_blank"
                  >@ort_dev</a
                >へお願いします
              </li>
              <li>
                投げ銭いただける方は
                <a href="javascript:void(0);" @click="openKampaModal">こちら</a
                >からお願いします
              </li>
              <li>
                <a href="javascript:void(0);" @click="openTermsModal"
                  >利用規約</a
                >
              </li>
              <li>
                <a href="javascript:void(0);" @click="openPolicyModal"
                  >プライバシーポリシー</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div id="kampa-modal" class="modal">
          <div class="modal-background"></div>
          <div class="modal-content">
            <div class="box">
              <h4 class="is-size-5">投げ銭について</h4>
              <ul class="is-size-7 content">
                <li>
                  Amazonギフトカードによる投げ銭（15円〜、手数料なし）になります。
                </li>
                <li>
                  Kampa!というサービスを利用することで、個人情報をやりとりすることなくAmazonギフトカードで投げ銭することができます。
                </li>
                <li>
                  投げ銭していただける方は下記手順にてお願いします。
                  <br />
                  <ol>
                    <li>
                      最下段の「Amazonギフトカードで投げ銭」よりKampa!サイトへ遷移
                    </li>
                    <li>
                      表示されたページのメールアドレスをコピーし、Kampa!ボタンをクリック
                    </li>
                    <li>
                      「金額」に投げ銭していただける金額を入力、「受取人」にコピーしたメールアドレスを貼り付けし、購入
                      （応援メッセージをいただけると喜びます）
                    </li>
                  </ol>
                </li>
                <li class="has-text-danger">
                  Amazonページ遷移時、デフォルトは10,000円に設定されており、
                  Amazonにログインしている場合は贈り主に氏名が自動入力されているようなのでご注意ください。※金額は15円〜で設定可能です。
                </li>
              </ul>
              <h4 class="is-size-5">補足</h4>
              <ul class="is-size-7 content">
                <li>
                  頂いた投げ銭はサーバ維持費用など当サイト運営目的にのみ使用します。
                </li>
                <li>
                  頂いた改善提案、ご要望については投げ銭の有無に関係なく積極的に取り入れていくので、Twitter
                  <a href="https://twitter.com/ort_dev" target="_blank"
                    >@ort_dev</a
                  >までお願いします。
                </li>
              </ul>
              <a
                href="http://kampa.me/t/lxc"
                target="_blank"
                class="button is-primary"
                >Amazonギフトカードで投げ銭する</a
              >
            </div>
          </div>
        </div>
      </div>
    </section>
    <div id="terms-modal" class="modal">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          <h4 class="is-size-5">利用規約</h4>
          <div class="content">
            <Terms />
          </div>
        </div>
      </div>
    </div>
    <div id="policy-modal" class="modal">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          <h4 class="is-size-5">プライバシーポリシー</h4>
          <div class="content">
            <Policy />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VillageCard from '~/components/VillageCard.vue'
import Terms from '~/components/Terms.vue'
import Policy from '~/components/Policy.vue'

export default {
  head() {
    return {
      title: ''
    }
  },

  name: 'HomePage',

  components: {
    VillageCard,
    Terms,
    Policy
  },

  data() {
    return {
      info: 1,
      villages: [
        {
          id: 1,
          name: '村名XXXXXXXX',
          status: '進行中',
          talkType: 'BBS',
          progress: '1日目',
          parcicipateNum: 12,
          participateCapacity: 16,
          spectateNum: 5,
          creator: 'ort',
          comment: '22時開始です。誰でも来てください。'
        },
        {
          id: 1,
          name: '村名YYYYYYY',
          status: '進行中',
          talkType: 'BBS',
          progress: '1日目',
          parcicipateNum: 12,
          participateCapacity: 16,
          spectateNum: 5,
          creator: 'ort',
          comment: '22時開始です。誰でも来てください。'
        }
      ]
    }
  },

  async created() {
    const self = this
    await this.$axios.$get('/wolf4busy/').then(res => {
      self.info = res.hoge
    })
  },

  methods: {
    openKampaModal() {
      const modal = document.querySelector('#kampa-modal')
      const html = document.querySelector('html')
      modal.classList.add('is-active')
      html.classList.add('is-clipped')

      modal
        .querySelector('.modal-background')
        .addEventListener('click', function(e) {
          e.preventDefault()
          modal.classList.remove('is-active')
          html.classList.remove('is-clipped')
        })
    },
    openTermsModal() {
      const modal = document.querySelector('#terms-modal')
      const html = document.querySelector('html')
      modal.classList.add('is-active')
      html.classList.add('is-clipped')

      modal
        .querySelector('.modal-background')
        .addEventListener('click', function(e) {
          e.preventDefault()
          modal.classList.remove('is-active')
          html.classList.remove('is-clipped')
        })
    },
    openPolicyModal() {
      const modal = document.querySelector('#policy-modal')
      const html = document.querySelector('html')
      modal.classList.add('is-active')
      html.classList.add('is-clipped')

      modal
        .querySelector('.modal-background')
        .addEventListener('click', function(e) {
          e.preventDefault()
          modal.classList.remove('is-active')
          html.classList.remove('is-clipped')
        })
    }
  }
}
</script>
