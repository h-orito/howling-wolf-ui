<template>
  <div class="content">
    <h4 class="is-7"><strong>全般</strong></h4>
    <div class="content">
      <ul>
        <li>
          日付更新時に、「日付更新時の処理順」の順に能力が行使されます。
        </li>
        <li>
          行使する前に死亡していた場合、能力は行使されません。
          <ul>
            <li>例：占い師が処刑された場合、占いは実行されません。</li>
            <li>
              ただし、襲撃については他の襲撃能力者が生存していれば行使されます。
            </li>
          </ul>
        </li>
        <li>
          対象を選択する能力の場合、日付更新時点でのセット先はランダムです。
        </li>
      </ul>
    </div>
    <h4 class="is-7" id="divine"><strong>占い</strong></h4>
    <div class="content">
      <ul>
        <li>
          毎晩生存者1名を選択して占い、人狼かそうでないかを知ることができます。
        </li>
        <li>対象が突然死、処刑された場合も知ることができます。</li>
        <li>
          妖狐など、占われると死亡する役職を占うと、対象を無惨な死体として死亡させることができます。
        </li>
        <li>
          メッセージ例
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private-seer"
            >
              <div class="content has-text-left">
                <p class="hw-message-text">
                  [暗] 暗殺者 アシュリーは、[転] 転生者 ハルトを占った。<br />[転]
                  転生者 ハルトは人狼ではないようだ。
                </p>
              </div>
            </div>
          </div>
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private-seer"
            >
              <div class="content has-text-left">
                <p class="hw-message-text">
                  [暗] 暗殺者 アシュリーは、[転] 転生者 ハルトを占った。<br />[転]
                  転生者 ハルトは人狼のようだ。
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <h4 class="is-7" id="psychic"><strong>霊視</strong></h4>
    <div class="content">
      <ul>
        <li>
          突然死、処刑された人が人狼かそうでないかを知ることができます。
        </li>
        <li>
          複数死亡した場合、全員分知ることができます。
        </li>
        <li>
          メッセージ例
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private-psychic"
            >
              <div class="content has-text-left">
                <p class="hw-message-text">
                  勇者 アスベルは人狼ではないようだ。
                </p>
              </div>
            </div>
          </div>
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private-psychic"
            >
              <div class="content has-text-left">
                <p class="hw-message-text">
                  勇者 アスベルは人狼のないようだ。
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <h4 class="is-7" id="guard"><strong>護衛</strong></h4>
    <div class="content">
      <ul>
        <li>
          初日以外の毎晩、自分以外の1名を人狼の襲撃から護衛することができます。
          （つまり、ダミーキャラの襲撃は防ぐことができません。）
        </li>
        <li>
          護衛成功してもメッセージが出ることはないため、護衛が成功したか知ることはできません。
        </li>
        <li>
          メッセージ例（エピローグまで見えません）
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private"
            >
              <div class="content has-text-left">
                <p class="hw-message-text">
                  槍使い ヘンリエッタは、僧侶 セシリーを護衛している。
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <h4 class="is-7" id="forcesuicide"><strong>道連れ</strong></h4>
    <div class="content">
      <ul>
        <li>
          処刑死した場合、処刑処理時点で自分へ投票した生存者から1名をランダムで道連れにします。
        </li>
        <li>
          処刑処理前に自身が死亡していた場合は処刑による道連れは発動しません。
        </li>
        <li>
          襲撃死した場合、人狼が設定した襲撃担当者を道連れにします。
        </li>
        <li>
          襲撃処理前に自身が死亡していた場合は襲撃による道連れは発動しません。
        </li>
        <li>
          道連れになった対象は無惨な死体となって発見されます。（死因は呪殺死扱い）
        </li>
        <li>
          メッセージ例（エピローグまで見えません）
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private"
            >
              <div class="content has-text-left">
                <p class="hw-message-text">
                  [槍] 槍使い ヘンリエッタは、[僧] 僧侶 セシリーを道連れにした。
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <h4 class="is-7" id="attack"><strong>襲撃</strong></h4>
    <div class="content">
      <ul>
        <li>毎晩1名を襲撃し、無惨な死体として死亡させられます。</li>
        <li>
          襲撃担当者や襲撃対象は襲撃能力者全員で連動しているので、誰かが変更すると自分の画面でも変わります。
        </li>
        <li>
          1日目はダミーキャラ（きぐるみ
          ピギー）しか襲撃対象として選択できません。
        </li>
        <li>2日目以降は襲撃しないこともできます。</li>
        <li>
          襲撃に失敗しても、護衛により失敗したのかどうかを知ることはできません。
        </li>
        <li>
          メッセージ例
          <div class="card">
            <div
              class="card-content p-t-10 p-b-10 m-b-5 message-system-private-werewolf"
            >
              <div class="content has-text-left">
                <p class="hw-message-text">
                  巫女 ウズメ達は、僧侶 セシリーを襲撃した。
                </p>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-content p-t-10 p-b-10 m-b-5">
              <div class="content has-text-left">
                <p class="hw-message-text">
                  次の日の朝、以下の村人が無惨な姿で発見された。<br />僧侶
                  セシリー
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class RuleAbility extends Vue {}
</script>

<style lang="scss" scoped>
.card-content {
  padding: 10px !important;
  font-family: sans-serif;
  border: 1px solid #ccc;
  border-radius: 5px;

  &:not(.dark-theme) {
    color: $black;
  }

  &.message-system-private {
    border: 1px solid $private-system-border;
    background-color: $private-system-bg;
  }
  &.message-system-private-seer {
    border: 1px solid $seer-system-border;
    background-color: $seer-system-bg;
  }
  &.message-system-private-psychic {
    border: 1px solid $psychic-system-border;
    background-color: $psychic-system-bg;
  }
  &.message-system-private-werewolf {
    border: 1px solid $werewolf-system-border;
    background-color: $werewolf-system-bg;
  }
  &.message-system-private-mason {
    border: 1px solid $mason-system-border;
    background-color: $mason-system-bg;
  }
}
</style>
