<template>
  <div class="content">
    <ul>
      <li>
        発言種別ごとに1日に発言できる回数と最大文字数が制限されます。
        <ul>
          <li>通常発言は1日に20回、1回に200文字まで</li>
          <li>人狼の囁きは1日に40回、1回に200文字まで</li>
          <li>死者の呻きは1日に40回、1回に200文字まで</li>
          <li>独り言は1日に100回、1回に200文字まで</li>
          <li>なお、プロローグ、エピローグは発言回数が制限されません。</li>
        </ul>
      </li>
      <li>
        発言可能時間が制限されている村では、進行中のみ、通常発言できない時間帯があります。
      </li>
      <li>
        発言中にアンカー文字列を含めると、クリックすることでその発言を表示することができます。
        <ul>
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
    <message-card
      :message="normalSay"
      :is-progress="false"
      :index="null"
      :is-dark-theme="false"
      :is-disp-date="false"
      :is-img-large="false"
      ref="messageCard"
    />
    <message-card
      :message="werewolfSay"
      :is-progress="false"
      :index="null"
      :is-dark-theme="false"
      :is-disp-date="false"
      :is-img-large="false"
      ref="messageCard"
    />
    <message-card
      :message="monologueSay"
      :is-progress="false"
      :index="null"
      :is-dark-theme="false"
      :is-disp-date="false"
      :is-img-large="false"
      ref="messageCard"
    />
    <message-card
      :message="graveSay"
      :is-progress="false"
      :index="null"
      :is-dark-theme="false"
      :is-disp-date="false"
      :is-img-large="false"
      ref="messageCard"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Message from '~/components/type/message'
import { MESSAGE_TYPE } from '~/components/const/consts'
const messageCard = () =>
  import('~/components/village/message/message-card.vue')

@Component({
  components: { messageCard }
})
export default class RuleMessage extends Vue {
  private get normalSay(): Message {
    return this.createMessage(
      MESSAGE_TYPE.NORMAL_SAY,
      '通常発言です。\n参加していない人も含め全員が見ることができます。'
    )
  }

  private get werewolfSay(): Message {
    return this.createMessage(
      MESSAGE_TYPE.WEREWOLF_SAY,
      '人狼の囁きです。\n進行中は一部の役職しか見ることができません。\nエピローグを迎えると全員が見ることができます。'
    )
  }

  private get monologueSay(): Message {
    return this.createMessage(
      MESSAGE_TYPE.MONOLOGUE_SAY,
      '独り言です。\n進行中は自分しか見ることができません。\nエピローグを迎えると全員が見ることができます。'
    )
  }

  private get graveSay(): Message {
    return this.createMessage(
      MESSAGE_TYPE.GRAVE_SAY,
      '死者の呻きです。\n進行中は死亡した人しか見ることができません。\nエピローグを迎えると全員が見ることができます。'
    )
  }

  private createMessage(type: string, text: string): Message {
    const message: Message = {
      from: {
        id: 1,
        chara: {
          id: 1,
          chara_name: {
            name: '',
            short_name: '',
            full_name: '[着] きぐるみ ピギー'
          },
          charachip_id: 1,
          default_message: {
            join_message: null,
            first_day_message: null
          },
          display: {
            width: 50,
            height: 77
          },
          face_list: [
            {
              type: 'NORMAL',
              name: '',
              image_url: 'https://wolfort.net/wmansion/6/000_A.png'
            }
          ]
        },
        player: null,
        dead: null,
        spectator: false,
        skill: null,
        skill_request: null,
        win: null,
        coming_outs: {
          list: []
        }
      },
      to: null,
      time: {
        village_day_id: 1,
        day: 1,
        datetime: '2000/01/01 23:59:59',
        unix_time_milli: 1
      },
      content: {
        type: {
          code: type,
          name: ''
        },
        num: 1,
        count: 1,
        text,
        face_code: 'NORMAL'
      }
    }
    return message
  }
}
</script>
