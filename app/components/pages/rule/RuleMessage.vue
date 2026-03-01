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
    <div class="mt-4 space-y-2 border border-gray-200 p-4">
      <MessageCard :message="normalSay" />
      <MessageCard :message="werewolfSay" />
      <MessageCard :message="masonSay" />
      <MessageCard :message="monologueSay" />
      <MessageCard :message="graveSay" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  MessageView,
  MessageContent,
  MessageTimeView,
  MessageType,
  VillageParticipantView,
  CharaView,
  CharaFace,
  CharaNameView
} from '~/lib/api/types'
import { MESSAGE_TYPE, isSayType } from '~/lib/api/message-constants'
import MessageCard from '~/components/pages/village/message/MessageCard.vue'

const createMessage = (type: string, text: string): MessageView => {
  const charaName: CharaNameView = {
    name: 'ピギー',
    short_name: 'ピギー',
    full_name: 'ピギー'
  }

  const face: CharaFace = {
    type: 'NORMAL',
    name: '通常',
    image_url: 'https://wolfort.net/wmansion/6/000_A.png'
  }

  const chara: CharaView = {
    id: 1,
    chara_name: charaName,
    charachip_id: 1,
    default_message: {},
    display: {
      width: 50,
      height: 77
    },
    face_list: [face]
  }

  const participant: VillageParticipantView = {
    id: 1,
    chara,
    spectator: false,
    coming_outs: { list: [] }
  }

  const messageType: MessageType = {
    code: type,
    name: '',
    is_say_type: isSayType(type)
  }

  const content: MessageContent = {
    type: messageType,
    num: 1,
    text,
    face_code: 'NORMAL'
  }

  const time: MessageTimeView = {
    village_day_id: 1,
    day: 1,
    datetime: '2000/01/01 23:59:59',
    unix_time_milli: 1
  }

  const message: MessageView = {
    from: participant,
    time,
    content
  }

  return message
}

const normalSay = computed(() =>
  createMessage(
    MESSAGE_TYPE.NORMAL_SAY,
    '通常発言です。\n参加していない人も含め全員が見ることができます。'
  )
)

const werewolfSay = computed(() =>
  createMessage(
    MESSAGE_TYPE.WEREWOLF_SAY,
    '人狼の囁きです。\n進行中は一部の役職しか見ることができません。\nエピローグを迎えると全員が見ることができます。'
  )
)

const masonSay = computed(() =>
  createMessage(
    MESSAGE_TYPE.MASON_SAY,
    '共有者の小声です。\n進行中は共有者しか見ることができません。\nエピローグを迎えると全員が見ることができます。'
  )
)

const monologueSay = computed(() =>
  createMessage(
    MESSAGE_TYPE.MONOLOGUE_SAY,
    '独り言です。\n進行中は自分しか見ることができません。\nエピローグを迎えると全員が見ることができます。'
  )
)

const graveSay = computed(() =>
  createMessage(
    MESSAGE_TYPE.GRAVE_SAY,
    '死者の呻きです。\n進行中は死亡した人しか見ることができません。\nエピローグを迎えると全員が見ることができます。'
  )
)
</script>
