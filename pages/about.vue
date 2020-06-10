<template>
  <section class="section">
    <div class="container has-text-left is-size-7">
      <h1 class="title is-5">このサイトは</h1>
      <div class="content">
        <ul>
          <li>HOWLING WOLFは、オンラインで長期人狼が遊べるサイトです。</li>
          <li>システムにより自動で村が作成される「自動生成村」があります。</li>
        </ul>
      </div>
      <h2 class="title is-5">注意事項</h2>
      <div class="content">
        <ul>
          <li>
            同村しているプレイヤーの画面の向こうにはあなたと同様人間がいます。<br />他者を思いやり、迷惑をかけないプレイを心がけるようお願いします。
          </li>
          <li>
            正常な運営を妨げる行為がなされた場合、管理人の裁量によりアクセス禁止措置等が取られる可能性があります。
          </li>
          <li>
            キャラチップについて
            <ul>
              <li>
                村で各プレイヤーが使用するキャラクターの画像については、著作権は作者様にあります。
              </li>
              <li>
                スクリーンショットのSNSアップロードやキャラ画像のアイコン利用などについては著作権者である作者様の意向に従ってください。
              </li>
              <li>
                「実装国の規約に準ずる」とある場合は、村ログのスクリーンショットのSNSアップロードはOK、キャラ画像のみを利用するのはNGとします。
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// type

@Component({
  components: {}
})
export default class About extends Vue {
  /** head */
  private head() {
    return { title: ' | このサイトは' }
  }
}
</script>

<style lang="scss" scoped></style>
