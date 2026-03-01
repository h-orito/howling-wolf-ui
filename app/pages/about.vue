<template>
  <section class="section px-6 py-12 md:px-12">
    <div class="container mx-auto text-left text-sm">
      <h1 class="mb-4 text-xl font-bold">このサイトは</h1>
      <div class="content">
        <ul class="list-inside list-disc space-y-2">
          <li>HOWLING WOLFは、オンラインで長期人狼が遊べるサイトです。</li>
          <li>システムにより自動で村が作成される「自動生成村」があります。</li>
        </ul>
      </div>

      <h2 class="mt-6 mb-3 text-xl font-bold">注意事項</h2>
      <div class="content">
        <ul class="list-inside list-disc space-y-2">
          <li>
            同村しているプレイヤーの画面の向こうにはあなたと同様人間がいます。<br />他者を思いやり、迷惑をかけないプレイを心がけるようお願いします。
          </li>
          <li>
            正常な運営を妨げる行為がなされた場合、管理人の裁量によりアクセス禁止措置等が取られる可能性があります。
          </li>
          <li>
            キャラチップについて
            <ul class="mt-1 ml-6 list-inside list-disc">
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

      <h2 class="mt-6 mb-3 text-xl font-bold">姉妹サイト</h2>
      <div class="content">
        <ul class="list-inside list-disc space-y-2">
          <li>
            <a
              href="https://firewolf.netlify.app"
              target="_blank"
              class="text-blue-600 underline hover:text-blue-800"
              >FIREWOLF</a
            >
            <ul class="mt-1 ml-6 list-inside list-disc">
              <li>長期人狼が遊べるサイトです。</li>
              <li>
                当サイトと似たようなUIで、好きな設定の村を作成して遊ぶことができます。
              </li>
            </ul>
          </li>
          <li>
            <a
              href="https://wolfort.net/wolf-mansion/"
              target="_blank"
              class="text-blue-600 underline hover:text-blue-800"
              >WOLF MANSION</a
            >
            <ul class="mt-1 ml-6 list-inside list-disc">
              <li>特殊ルール人狼「人狼館の事件簿村」が遊べるサイトです。</li>
              <li>対話がないため時間がない人でもパズル感覚で楽しめます。</li>
            </ul>
          </li>
          <li>
            <a
              href="https://lastwolf.netlify.app"
              target="_blank"
              class="text-blue-600 underline hover:text-blue-800"
              >LASTWOLF</a
            >
            <ul class="mt-1 ml-6 list-inside list-disc">
              <li>短期人狼が遊べるサイトです。</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'このサイトは | HOWLING WOLF',
  description:
    'HOWLING WOLFはオンラインで長期人狼が無料で遊べるWebサービスです。システムにより自動で村が作成される自動生成村があります。'
})
</script>
