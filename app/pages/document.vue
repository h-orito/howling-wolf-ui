<template>
  <section class="section px-6 py-12 md:px-12">
    <div class="container mx-auto text-left text-sm">
      <h1 class="mb-4 text-xl font-bold">公開API仕様</h1>
      <hr class="my-4" />

      <h2 class="text-lg font-bold">村戦績</h2>
      <div class="content mt-2">
        <p>エピローグを迎えた、もしくは廃村した村の戦績を取得できます。</p>

        <h3 class="mt-4 text-base font-bold">Request</h3>
        <p>
          GET:
          <code class="rounded bg-gray-100 px-1 py-0.5 text-xs"
            >https://wolfort.net/howling-wolf/village-record/list</code
          >
        </p>
        <p class="mt-2 font-bold">Parameter</p>
        <div class="overflow-x-auto">
          <table
            class="mt-1 w-full border-collapse border border-gray-300 text-xs"
          >
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-2 py-1">パラメータ</th>
                <th class="border border-gray-300 px-2 py-1">型</th>
                <th class="border border-gray-300 px-2 py-1">必須</th>
                <th class="border border-gray-300 px-2 py-1">説明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-gray-300 px-2 py-1">vid</td>
                <td class="border border-gray-300 px-2 py-1">number</td>
                <td class="border border-gray-300 px-2 py-1">-</td>
                <td class="border border-gray-300 px-2 py-1">
                  指定すると、指定したIDの村のみ返却する。複数指定可。<br />e.g.
                  ~~/village-record/list?vid=1&amp;vid=2
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="mt-4 text-base font-bold">Response</h3>
        <p>型：application/json</p>
        <p>文字コード：UTF8</p>
        <p class="mt-2 font-bold">data</p>
        <div class="overflow-x-auto">
          <table
            class="mt-1 w-full border-collapse border border-gray-300 text-xs"
          >
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-2 py-1" colspan="3">
                  JSON KEY
                </th>
                <th class="border border-gray-300 px-2 py-1">型</th>
                <th class="border border-gray-300 px-2 py-1">必須</th>
                <th class="border border-gray-300 px-2 py-1">説明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-gray-300 px-2 py-1">list</td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">Array</td>
                <td class="border border-gray-300 px-2 py-1">○</td>
                <td class="border border-gray-300 px-2 py-1">
                  1件もない場合も404エラーでなくlist[]を返す。
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">id</td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">number</td>
                <td class="border border-gray-300 px-2 py-1">○</td>
                <td class="border border-gray-300 px-2 py-1">村ID</td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">name</td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">string</td>
                <td class="border border-gray-300 px-2 py-1">○</td>
                <td class="border border-gray-300 px-2 py-1">村名</td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">status</td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">string</td>
                <td class="border border-gray-300 px-2 py-1">○</td>
                <td class="border border-gray-300 px-2 py-1">
                  ステータス。「廃村」「エピローグ」「終了」のいずれか。
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">start_datetime</td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">string</td>
                <td class="border border-gray-300 px-2 py-1">-</td>
                <td class="border border-gray-300 px-2 py-1">
                  1日目が開始した日時。yyyy/MM/dd HH:mm型
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">
                  prologue_datetime
                </td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">string</td>
                <td class="border border-gray-300 px-2 py-1">○</td>
                <td class="border border-gray-300 px-2 py-1">
                  プロローグが開始した日時。yyyy/MM/dd HH:mm型
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">
                  epilogue_datetime
                </td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">string</td>
                <td class="border border-gray-300 px-2 py-1">-</td>
                <td class="border border-gray-300 px-2 py-1">
                  エピローグが開始した日時。yyyy/MM/dd HH:mm型
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">epilogue_day</td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">number</td>
                <td class="border border-gray-300 px-2 py-1">-</td>
                <td class="border border-gray-300 px-2 py-1">
                  エピローグが何日目か
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">organization</td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">string</td>
                <td class="border border-gray-300 px-2 py-1">○</td>
                <td class="border border-gray-300 px-2 py-1">編成</td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">url</td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">string</td>
                <td class="border border-gray-300 px-2 py-1">○</td>
                <td class="border border-gray-300 px-2 py-1">村URL</td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">win_camp_name</td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">string</td>
                <td class="border border-gray-300 px-2 py-1">-</td>
                <td class="border border-gray-300 px-2 py-1">
                  勝利陣営。村人陣営、人狼陣営、狐陣営のいずれか。
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">
                  participant_list
                </td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">Array</td>
                <td class="border border-gray-300 px-2 py-1">○</td>
                <td class="border border-gray-300 px-2 py-1">参加者リスト</td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">character_name</td>
                <td class="border border-gray-300 px-2 py-1">string</td>
                <td class="border border-gray-300 px-2 py-1">○</td>
                <td class="border border-gray-300 px-2 py-1">キャラクター名</td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">
                  twitter_user_id
                </td>
                <td class="border border-gray-300 px-2 py-1">string</td>
                <td class="border border-gray-300 px-2 py-1">○</td>
                <td class="border border-gray-300 px-2 py-1">
                  twitterのuserId
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">
                  other_site_user_id
                </td>
                <td class="border border-gray-300 px-2 py-1">string</td>
                <td class="border border-gray-300 px-2 py-1">-</td>
                <td class="border border-gray-300 px-2 py-1">
                  他人狼サイトでのユーザID。ユーザが任意で登録できる。
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">skill_name</td>
                <td class="border border-gray-300 px-2 py-1">string</td>
                <td class="border border-gray-300 px-2 py-1">-</td>
                <td class="border border-gray-300 px-2 py-1">役職名</td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">dead</td>
                <td class="border border-gray-300 px-2 py-1">boolean</td>
                <td class="border border-gray-300 px-2 py-1">○</td>
                <td class="border border-gray-300 px-2 py-1">死亡したか</td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">dead_day</td>
                <td class="border border-gray-300 px-2 py-1">number</td>
                <td class="border border-gray-300 px-2 py-1">-</td>
                <td class="border border-gray-300 px-2 py-1">
                  死亡したのは何日目か。死亡していない場合はnull
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">dead_reason</td>
                <td class="border border-gray-300 px-2 py-1">string</td>
                <td class="border border-gray-300 px-2 py-1">-</td>
                <td class="border border-gray-300 px-2 py-1">
                  死因。死亡していない場合はnull<br />襲撃死、処刑死、呪殺死のいずれか。
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1"></td>
                <td class="border border-gray-300 px-2 py-1">win</td>
                <td class="border border-gray-300 px-2 py-1">boolean</td>
                <td class="border border-gray-300 px-2 py-1">-</td>
                <td class="border border-gray-300 px-2 py-1">勝利したか</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="mt-4">例</p>
        <pre class="mt-1 overflow-x-auto rounded bg-gray-100 p-3 text-xs">{{
          jsonExample
        }}</pre>
      </div>

      <hr class="my-6" />

      <h2 class="text-lg font-bold">村戦績が取得できる最大村ID</h2>
      <div class="content mt-2">
        <p>戦績取得可能な最大の村IDを取得できます。</p>
        <h3 class="mt-4 text-base font-bold">Request</h3>
        <p>
          GET:
          <code class="rounded bg-gray-100 px-1 py-0.5 text-xs"
            >https://wolfort.net/howling-wolf/village-record/latest-vid</code
          >
        </p>
        <h3 class="mt-4 text-base font-bold">Response</h3>
        <p>型：application/json</p>
        <p>文字コード：UTF8</p>
        <p class="mt-2">例</p>
        <pre class="mt-1 overflow-x-auto rounded bg-gray-100 p-3 text-xs">
{ "vid": 1 }</pre
        >
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '公開API仕様 | HOWLING WOLF',
  description: 'HOWLING WOLFの村戦績を取得できる公開APIの仕様です。'
})

const jsonExample = `{
  "list": [
    {
      "id": 1,
      "name": "0001村",
      "status": "エピローグ",
      "start_datetime": "2020/01/01 00:00",
      "prologue_datetime": "2019/12/31 00:00",
      "epilogue_datetime": "2020/01/03 00:00",
      "epilogue_day": 3,
      "organization": "村占霊狼狂",
      "url": "https://howling-wolf.com/village?id=1",
      "win_camp_name": "人狼陣営",
      "participant_list": [
        {
          "character_name": "きぐるみ ピギー",
          "twitter_user_id": "ort_dev",
          "other_site_user_id": "ort",
          "skill_name": "村人",
          "dead": true,
          "dead_day": 2,
          "dead_reason": "襲撃死",
          "win": false
        }
      ]
    }
  ]
}`
</script>
