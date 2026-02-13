<template>
  <div>
    <ul class="ml-4 list-disc space-y-2">
      <li>
        発言種別ごとに1日に発言できる回数と最大文字数が制限されます。
        <ul class="mt-1 ml-6 list-inside list-disc">
          <li>通常発言は1日に20回、1回に200文字まで</li>
          <li>人狼の囁きは1日に40回、1回に200文字まで</li>
          <li>死者の呻きは1日に40回、1回に200文字まで</li>
          <li>独り言は1日に100回、1回に200文字まで</li>
          <li>なお、プロローグ、エピローグは発言回数が制限されません。</li>
          <li>初心者村の場合、通常発言は1日に10回までとなります。</li>
        </ul>
      </li>
      <li>
        発言可能時間が制限されている村では、進行中のみ、通常発言できない時間帯があります。
      </li>
      <li>
        発言中にアンカー文字列を含めると、クリックすることでその発言を表示することができます。
        <ul class="mt-1 ml-6 list-inside list-disc">
          <li>&gt;&gt;1 通常発言へのアンカー</li>
          <li>&gt;&gt;*1 人狼の囁きへのアンカー</li>
          <li>&gt;&gt;+1 死者の呻きへのアンカー</li>
          <li>&gt;&gt;-1 独り言へのアンカー（エピローグ後のみ）</li>
          <li>
            いずれのアンカーも、自分が見られない発言はクリックしても発言が表示されません。
          </li>
        </ul>
      </li>
    </ul>
    <div class="mt-4 space-y-2">
      <div class="say-example say-example-normal">
        <div class="say-example-header">通常発言</div>
        <p class="say-example-text">
          通常発言です。<br />参加していない人も含め全員が見ることができます。
        </p>
      </div>
      <div class="say-example say-example-werewolf">
        <div class="say-example-header">人狼の囁き</div>
        <p class="say-example-text">
          人狼の囁きです。<br />進行中は一部の役職しか見ることができません。<br />エピローグを迎えると全員が見ることができます。
        </p>
      </div>
      <div class="say-example say-example-monologue">
        <div class="say-example-header">独り言</div>
        <p class="say-example-text">
          独り言です。<br />進行中は自分しか見ることができません。<br />エピローグを迎えると全員が見ることができます。
        </p>
      </div>
      <div class="say-example say-example-grave">
        <div class="say-example-header">死者の呻き</div>
        <p class="say-example-text">
          死者の呻きです。<br />進行中は死亡した人しか見ることができません。<br />エピローグを迎えると全員が見ることができます。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.say-example {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px 12px;
  font-size: 14px;
}
.say-example-header {
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 4px;
  color: #666;
}
.say-example-text {
  line-height: 1.6;
}
.say-example-normal {
  background-color: var(--color-say-normal);
}
.say-example-werewolf {
  background-color: var(--color-say-werewolf);
}
.say-example-monologue {
  background-color: var(--color-say-monologue);
}
.say-example-grave {
  background-color: var(--color-say-grave);
}
</style>
