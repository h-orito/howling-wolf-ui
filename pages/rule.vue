<template>
  <div>
    <section class="section">
      <div class="container">
        <h2 class="title is-5">ルール</h2>
        <div class="content">
          <p class="is-size-7">
            まだ執筆していません。今後ちゃんと書きます。
          </p>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h2 class="title is-5">仕様</h2>
        <div class="content">
          <p class="is-size-7">
            メモ書き状態です。
          </p>
        </div>
        <div class="content has-text-left">
          <h3 class="title is-6">突然死</h3>
          <ul class="is-size-7">
            <li>
              進行中の日付更新のタイミングで、前日に一度も通常発言をしていなかった生存者は突然死します。
            </li>
            <li>突然死者の投票は無効票となり、集計されません。</li>
            <li>突然死者の能力は、人狼の襲撃以外は無効となります。</li>
            <li>突然死者はエピローグ以外で一切の発言ができなくなります。</li>
            <li>
              突然死者は以降の村に参加することができなくなります。
              <ul>
                <li>
                  突然死した方は国主まで直接ご連絡ください。会話させていただいたのち入村制限を解除します。
                </li>
                <li>
                  連絡いただければ基本的に制限解除しますが、改善が見込めない場合など、解除しない場合があります。
                </li>
              </ul>
            </li>
            <li>
              ただし、村の設定で突然死を有効にしていない場合、突然死しません。
            </li>
          </ul>
          <h3 class="title is-6">投票</h3>
          <ul class="is-size-7">
            <li>2日目から投票による処刑が始まります。</li>
            <li>日付更新時点では自分にセットされています。</li>
            <li>翌朝に集計され、最多票となった人が処刑されます。</li>
            <li>
              最多票者が複数いる場合はランダムで処刑される人が決まります。
            </li>
            <li>
              自動生成村では無記名投票となり、被得票数のみが公表されます。
            </li>
          </ul>
          <h3 class="title is-6">アンカー</h3>
          <ul class="is-size-7">
            <li>
              アンカーを発言に含めると、クリックすることでその発言を表示することができるようになります。
            </li>
            <li>各発言種別のアンカーの付け方はいずれ書きます。</li>
            <li>
              いずれのアンカーも、自分が見ることのできない発言はクリックしてもアンカー先発言を表示することはできません。
            </li>
          </ul>
          <h3 class="title is-6">役職希望、割り当て</h3>
          <ul class="is-size-7">
            <li>
              ダミーキャラ（2日目に人狼に襲撃されるキャラ）は必ず村人が割り当てられます。
            </li>
            <li>
              以下の順に役職が割り当てられます。
              <ul>
                <li>第1希望で役職を指定した人を割り当て</li>
                <li>第2希望で役職を指定した人を割り当て</li>
                <li>
                  ここまでで割り当てられなかった人とおまかせの人を割り当て
                </li>
              </ul>
            </li>
            <li>
              村の設定で役職希望を無効にした場合、全員がおまかせ扱いになります。
            </li>
          </ul>
          <h3 class="title is-6">発言</h3>
          <ul class="is-size-7">
            <li>
              発言制限が設定されている村では、発言種別ごとに最大文字数と1日に発言できる回数が制限されます。
            </li>
            <li>
              自動生成村は以下の制限としています。
              <ul>
                <li>
                  通常発言は1日に20回、1回に200文字まで
                </li>
                <li>人狼の囁きは1日に40回、1回に200文字まで</li>
                <li>他は1回に200文字まで、回数制限なし</li>
              </ul>
            </li>
            <li>プロローグ、エピローグは発言回数が制限されません。</li>
          </ul>
          <h3 class="title is-6">流れ</h3>
          <ul class="is-size-7">
            <li>
              プロローグ
              <ul>
                <li>
                  開始日時時点で最低開始人数以上の人数がいる場合、1日目に遷移します。
                </li>
                <li>
                  開始日時までに最低開始人数が揃わなかった場合、廃村となります。
                </li>
                <li>24時間発言がない参加者は自動で村を去ります。</li>
              </ul>
            </li>
            <li>
              1日目
              <ul>
                <li>役職が割り当てられます。</li>
                <li>投票および処刑はありません。</li>
                <li>人狼の襲撃対象はダミーキャラ固定になります。</li>
                <li>占い師は占い対象を選択することができます。</li>
                <li>狩人は能力行使できません。</li>
              </ul>
            </li>
            <li>
              2日目以降
              <ul>
                <li>処刑するための投票先を選択できるようになります。</li>
                <li>人狼が襲撃対象を選択できるようになります。</li>
                <li>狩人が護衛対象を選択できるようになります。</li>
                <li>
                  日付更新時、いずれかの陣営の勝利条件に当てはまった場合はエピローグに遷移します。
                </li>
              </ul>
            </li>
          </ul>
          <h3 class="title is-6">日付更新時の処理順</h3>
          <ol class="is-size-7">
            <li>突然死</li>
            <li>処刑</li>
            <li>護衛</li>
            <li>占い</li>
            <li>霊視</li>
            <li>襲撃</li>
            <li>勝敗判定</li>
          </ol>

          <h3 class="title is-6">役職</h3>
          <ul class="is-size-7">
            <li>
              持っている能力、襲撃されるか、占い時の判定等を記載する予定です
            </li>
            <li>村人: 能力なし</li>
            <li>占い師: 占い能力を持つ</li>
            <li>人狼：襲撃能力を持つ</li>
            <li>...</li>
          </ul>
          <h3 class="title is-6">能力</h3>
          <ul class="is-size-7">
            <li>能力詳細を記載する予定です</li>
            <li>
              占い
              <ul>
                <li>
                  毎晩生存者1名を占い、人狼かそうでないかを知ることができます。
                </li>
              </ul>
            </li>
            <li>
              襲撃
              <ul>
                <li>
                  毎晩1名を襲撃することができます。
                </li>
                <li>
                  襲撃対象は襲撃能力者全員で連動しているので、誰かが変更すると自分の画面でも変わります。
                </li>
              </ul>
            </li>
            <li>...</li>
          </ul>
          <h3 class="title is-6">陣営</h3>
          <ul class="is-size-7">
            <li>陣営詳細を記載する予定です</li>
            <li>村人陣営</li>
            <li>人狼陣営</li>
            <li>...</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
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
    return { title: ' | ルール' }
  }
}
</script>

<style lang="scss" scoped></style>
