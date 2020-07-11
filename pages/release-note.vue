<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-5">更新情報</h1>
      <div class="content">
        <ul class="has-text-left is-size-7">
          <li>2020/07/11 参加者一覧から個別抽出できるよう変更</li>
          <li>2020/07/11 発言抽出のシステムメッセージを公開と非公開に分離</li>
          <li>2020/07/11 下部メニューのタブや大きさを記憶するよう変更</li>
          <li>2020/07/11 アンカーコピーにキャラ略称を追加</li>
          <li>2020/07/11 突然死した場合陣営勝利しても敗北扱いとするよう変更</li>
          <li>2020/06/08 妖狐を追加</li>
          <li>2020/06/03 共有者を追加</li>
          <li>2020/06/02 C国狂人を追加</li>
          <li>2020/06/02 本番サーバ公開</li>
          <li>2020/02/10 テストサーバ公開</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// component
// type

@Component({
  components: {}
})
export default class extends Vue {
  /** head */
  private head() {
    return { title: ' | 更新情報' }
  }
}
</script>

<style lang="scss" scoped></style>
