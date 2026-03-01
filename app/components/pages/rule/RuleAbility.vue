<template>
  <div>
    <h4 class="mt-4 mb-2 font-bold">全般</h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>日付更新時に、「日付更新時の処理順」の順に能力が行使されます。</li>
        <li>
          行使する前に死亡していた場合、能力は行使されません。
          <ul class="my-2 ml-6 list-disc">
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

    <h4 id="divine" class="mt-4 mb-2 font-bold">占い</h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>
          毎晩生存者1名を選択して占い、人狼かそうでないかを知ることができます。
        </li>
        <li>対象が突然死、処刑された場合も知ることができます。</li>
        <li>
          妖狐など、占われると死亡する役職を占うと、対象を無惨な死体として死亡させることができます。
        </li>
        <li>
          メッセージ例
          <div class="mt-2 space-y-2">
            <div class="message-example message-example-seer">
              [暗] 暗殺者 アシュリーは、[転] 転生者 ハルトを占った。<br />[転]
              転生者 ハルトは人狼ではないようだ。
            </div>
            <div class="message-example message-example-seer">
              [暗] 暗殺者 アシュリーは、[転] 転生者 ハルトを占った。<br />[転]
              転生者 ハルトは人狼のようだ。
            </div>
          </div>
        </li>
      </ul>
    </div>

    <h4 id="psychic" class="mt-4 mb-2 font-bold">霊視</h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>突然死、処刑された人が人狼かそうでないかを知ることができます。</li>
        <li>複数死亡した場合、全員分知ることができます。</li>
        <li>
          メッセージ例
          <div class="mt-2 space-y-2">
            <div class="message-example message-example-psychic">
              勇者 アスベルは人狼ではないようだ。
            </div>
            <div class="message-example message-example-psychic">
              勇者 アスベルは人狼のようだ。
            </div>
          </div>
        </li>
      </ul>
    </div>

    <h4 id="guard" class="mt-4 mb-2 font-bold">護衛</h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>
          初日以外の毎晩、自分以外の1名を人狼の襲撃から護衛することができます。
          （つまり、ダミーキャラの襲撃は防ぐことができません。）
        </li>
        <li>
          護衛成功してもメッセージが出ることはないため、護衛が成功したか知ることはできません。
        </li>
        <li>
          メッセージ例（エピローグまで見えません）
          <div class="mt-2">
            <div class="message-example message-example-private">
              槍使い ヘンリエッタは、僧侶 セシリーを護衛している。
            </div>
          </div>
        </li>
      </ul>
    </div>

    <h4 id="forcesuicide" class="mt-4 mb-2 font-bold">道連れ</h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
        <li>
          処刑死した場合、処刑処理時点で自分へ投票した生存者から1名をランダムで道連れにします。
        </li>
        <li>
          処刑処理前に自身が死亡していた場合は処刑による道連れは発動しません。
        </li>
        <li>襲撃死した場合、人狼が設定した襲撃担当者を道連れにします。</li>
        <li>
          襲撃処理前に襲撃者が死亡していた場合は、生存している人狼から1名をランダムで道連れにします。
        </li>
        <li>
          道連れになった対象は無惨な死体となって発見されます。（死因は呪殺死扱い）
        </li>
        <li>
          メッセージ例（エピローグまで見えません）
          <div class="mt-2">
            <div class="message-example message-example-private">
              [槍] 槍使い ヘンリエッタは、[僧] 僧侶 セシリーを道連れにした。
            </div>
          </div>
        </li>
      </ul>
    </div>

    <h4 id="attack" class="mt-4 mb-2 font-bold">襲撃</h4>
    <div>
      <ul class="ml-4 list-disc space-y-2">
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
          <div class="mt-2 space-y-2">
            <div class="message-example message-example-werewolf">
              巫女 ウズメ達は、僧侶 セシリーを襲撃した。
            </div>
            <div class="message-example message-example-public">
              次の日の朝、以下の村人が無惨な姿で発見された。<br />僧侶 セシリー
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.message-example {
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 14px;
  line-height: 1.6;
  border: 1px solid #ccc;
}
.message-example-seer {
  border-color: var(--color-system-seer-border);
  background-color: var(--color-system-seer-bg);
}
.message-example-psychic {
  border-color: var(--color-system-psychic-border);
  background-color: var(--color-system-psychic-bg);
}
.message-example-private {
  border-color: var(--color-system-private-border);
  background-color: var(--color-system-private-bg);
}
.message-example-werewolf {
  border-color: var(--color-system-werewolf-border);
  background-color: var(--color-system-werewolf-bg);
}
.message-example-public {
  border-color: #ccc;
  background-color: #fff;
}
</style>
