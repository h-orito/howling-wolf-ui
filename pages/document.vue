<template>
  <section class="section">
    <div class="container has-text-left is-size-7">
      <h1 class="title is-5">公開API仕様</h1>
      <hr />
      <h2 class="is-size-6">村戦績</h2>
      <div class="content m-t-10">
        <p>エピローグを迎えた、もしくは廃村した村の戦績を取得できます。</p>
        <h3 class="is-size-6">Request</h3>
        <p>GET: https://wolfort.net/howling-wolf/village-record/list</p>
        <strong>Parameter</strong>
        <table class="table">
          <thead>
            <tr>
              <th>パラメータ</th>
              <th>型</th>
              <th>必須</th>
              <th>説明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>vid</td>
              <td>number</td>
              <td>-</td>
              <td>
                指定すると、指定したIDの村のみ返却する。複数指定可。<br />e.g.
                ~~/village-record/list?vid=1&amp;vid=2
              </td>
            </tr>
          </tbody>
        </table>
        <h3>Response</h3>
        <p>型：application/json</p>
        <p>文字コード：UTF8</p>
        <strong>data</strong>
        <table class="table">
          <thead>
            <tr>
              <th rowspan="3">JSON KEY</th>
              <th></th>
              <th></th>
              <th>型</th>
              <th>必須</th>
              <th>説明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>list</td>
              <td></td>
              <td></td>
              <td>Array</td>
              <td>○</td>
              <td>1件もない場合も404エラーでなくlist[]を返す。</td>
            </tr>
            <tr>
              <td></td>
              <td>id</td>
              <td></td>
              <td>number</td>
              <td>○</td>
              <td>村ID</td>
            </tr>
            <tr>
              <td></td>
              <td>name</td>
              <td></td>
              <td>string</td>
              <td>○</td>
              <td>村名</td>
            </tr>
            <tr>
              <td></td>
              <td>status</td>
              <td></td>
              <td>string</td>
              <td>○</td>
              <td>ステータス。「廃村」「エピローグ」「終了」のいずれか。</td>
            </tr>
            <tr>
              <td></td>
              <td>start_datetime</td>
              <td></td>
              <td>string</td>
              <td>-</td>
              <td>1日目が開始した日時。yyyy/MM/dd HH:mm型</td>
            </tr>
            <tr>
              <td></td>
              <td>prologue_datetime</td>
              <td></td>
              <td>string</td>
              <td>○</td>
              <td>プロローグが開始した日時。yyyy/MM/dd HH:mm型</td>
            </tr>
            <tr>
              <td></td>
              <td>epilogue_datetime</td>
              <td></td>
              <td>string</td>
              <td>-</td>
              <td>エピローグが開始した日時。yyyy/MM/dd HH:mm型</td>
            </tr>
            <tr>
              <td></td>
              <td>epilogue_day</td>
              <td></td>
              <td>number</td>
              <td>-</td>
              <td>エピローグが何日目か</td>
            </tr>
            <tr>
              <td></td>
              <td>organization</td>
              <td></td>
              <td>string</td>
              <td>○</td>
              <td>編成</td>
            </tr>
            <tr>
              <td></td>
              <td>url</td>
              <td></td>
              <td>string</td>
              <td>○</td>
              <td>村URL</td>
            </tr>
            <tr>
              <td></td>
              <td>win_camp_name</td>
              <td></td>
              <td>string</td>
              <td>-</td>
              <td>勝利陣営。村人陣営、人狼陣営、狐陣営のいずれか。</td>
            </tr>
            <tr>
              <td></td>
              <td>participant_list</td>
              <td></td>
              <td>Array</td>
              <td>○</td>
              <td>参加者リスト</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>character_name</td>
              <td>string</td>
              <td>○</td>
              <td>キャラクター名</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>twitter_user_id</td>
              <td>string</td>
              <td>○</td>
              <td>twitterのuserId</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>other_site_user_id</td>
              <td>string</td>
              <td>-</td>
              <td>他人狼サイトでのユーザID。ユーザが任意で登録できる。</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>skill_name</td>
              <td>string</td>
              <td>-</td>
              <td>役職名</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>dead</td>
              <td>boolean</td>
              <td>○</td>
              <td>死亡したか</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>dead_day</td>
              <td>number</td>
              <td>-</td>
              <td>死亡したのは何日目か。死亡していない場合はnull</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>dead_reason</td>
              <td>string</td>
              <td>-</td>
              <td>
                死因。死亡していない場合はnull<br />襲撃死、処刑死、呪殺死のいずれか。
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>win</td>
              <td>boolean</td>
              <td>-</td>
              <td>勝利したか</td>
            </tr>
          </tbody>
        </table>
        <p>例</p>
        <b-input
          size="is-small"
          :rows="20"
          type="textarea"
          v-model="jsonExample"
        >
        </b-input>
      </div>
      <hr />
      <h2 class="is-size-6">村戦績が取得できる最大村ID</h2>
      <div class="content m-t-10">
        <p>戦績取得可能な最大の村IDを取得できます。</p>
        <h3 class="is-size-6">Request</h3>
        <p>GET: https://wolfort.net/howling-wolf/village-record/latest-vid</p>
        <h3>Response</h3>
        <p>型：application/json</p>
        <p>文字コード：UTF8</p>
        <p>例</p>
        <b-input size="is-small" :rows="1" type="textarea" value="{ vid: 1 }">
        </b-input>
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
    return { title: ' | 公開API仕様' }
  }

  /** data */
  private jsonExample: string = `{
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
            "dead_reason": "襲撃死"
            "win": false,
          },
          {
            "character_name": "勇者 アスベル",
            "twitter_user_id": "user_name_2",
            "other_site_user_id": null,
            "skill_name": "人狼",
            "dead": false,
            "dead_day": null,
            "dead_reason": null,
            "win": true
          },
          {
            "character_name": "戦士 ランディ",
            "twitter_user_id": "user_name_3",
            "other_site_user_id": null,
            "skill_name": "狂人",
            "dead": false,
            "dead_day": null,
            "dead_reason": null,
            "win": true
          },
          {
            "character_name": "弓使い レティシア",
            "twitter_user_id": "user_name_4",
            "other_site_user_id": null,
            "skill_name": "占い師",
            "dead": true,
            "dead_day": 3,
            "dead_reason": "襲撃死",
            "win": false
          },
          {
            "character_name": "忍者 ミズチ",
            "twitter_user_id": "user_name_5",
            "other_site_user_id": null,
            "skill_name": "霊能者",
            "dead": true,
            "dead_day": 3,
            "dead_reason": "処刑死",
            "win": false
          }
        ]
      }
    ]
  }
  `

  /** computed */

  /** created */
  private created() {}

  /** method */
}
</script>
