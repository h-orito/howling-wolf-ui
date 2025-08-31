<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-5">FAQ</h1>
      <ul class="content has-text-left is-size-7">
        <li class="question">入村できないのですが</li>
        <li class="answer">
          以下のいずれかに当てはまると入村できません
          <ul>
            <li>ログインしていない</li>
            <!-- <li>1回以上参加したことがある人に招待されていない</li> -->
            <li>すでに参加人数が上限に達している</li>
            <li>決着のついていない村に参加中である</li>
            <li>突然死したことがあり、入村制限が解除されていない</li>
            <li>その他入村を制限されている</li>
          </ul>
        </li>
        <li class="question">
          無残な死体が複数いる場合、表示順序に決まりはありますか
        </li>
        <li class="answer">
          ランダムに並び替えて表示するため、順序により死因は特定できません
        </li>
        <li class="question">発言から絵文字が消える</li>
        <li class="answer">
          仕様です。使用できない絵文字は自動的に削除されます
        </li>
      </ul>
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
export default class Faq extends Vue {
  /** head */
  private head() {
    return { title: ' | FAQ' }
  }
}
</script>

<style lang="scss" scoped>
ul li.question,
ul li.answer {
  position: relative;
  padding-left: 2em;
  line-height: 20px;
}
ul li.question::before {
  content: 'Q';
  display: block;
  position: absolute;
  left: 0;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
  background-color: $info;
  width: 20px;
  height: 20px;
  color: $white;
  font-size: 14px;
  font-weight: bold;
}
ul li.answer {
  margin-bottom: 20px;
}
ul li.answer::before {
  content: 'A';
  display: block;
  position: absolute;
  left: 0;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
  background-color: $danger;
  width: 20px;
  height: 20px;
  color: $white;
  font-size: 14px;
  font-weight: bold;
}
</style>
