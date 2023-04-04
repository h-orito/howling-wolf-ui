import Chara from '~/components/type/chara'
import Message from '~/components/type/message'
import { MESSAGE_TYPE } from '~/components/const/consts'

export interface SayMessage {
  unix_time_milli: number // idに使う
  message_class: string
  is_anchor_message: boolean
  is_disp_anchor: boolean
  anchor_string: string
  anchor_copy_string: string
  day: number
  chara_name: string
  comingout: string | null
  nickname: string | null
  twitter_user_name: string | null
  current_count: number | null
  max_count: number
  datetime: string
  chara: Chara
  face_type_code: string
  message_lines: SayMessageLine[]
}

export interface SayMessageLine {
  sentences: SayMessageSentence[]
}

export interface SayMessageSentence {
  is_anchor: boolean
  text: string
}

export interface SystemMessage {
  unix_time_milli: number // idに使う
  message_class: string
  message_lines: string[]
}

export const convertToSayMessage = (
  message: Message,
  isAnchorMessage: boolean,
  isProgress: boolean,
  maxCount: number,
  isDispDate: boolean
): SayMessage => {
  const typeCode: string = message.content.type.code
  const isDispAnchor: boolean = _isDispAnchor(isProgress, typeCode)
  const anchorString = createAnchorString(typeCode, message.content.num!)
  const anchorCopyString: string = createAnchorCopyString(
    typeCode,
    anchorString,
    message.from!.chara.chara_name.short_name
  )
  return {
    unix_time_milli: message.time.unix_time_milli,
    message_class: sayMessageClassMap.get(message.content.type.code) || '',
    is_anchor_message: isAnchorMessage,
    is_disp_anchor: isDispAnchor,
    anchor_string: isDispAnchor ? anchorString : '',
    anchor_copy_string: isDispAnchor ? anchorCopyString : '',
    day: message.time.day,
    chara_name: message.from!.chara.chara_name.full_name,
    comingout:
      message.from!.coming_outs.list.length === 0
        ? null
        : message
            .from!.coming_outs.list.map(co => co.skill.short_name)
            .join(',') + 'CO',
    nickname: message.from!.player?.nickname,
    twitter_user_name: message.from!.player?.twitter_user_name,
    current_count: message.content.count,
    max_count: maxCount,
    datetime: isDispDate
      ? message.time.datetime
      : message.time.datetime.substring(11),
    chara: message.from!.chara,
    face_type_code: message.content.face_code,
    message_lines: convertToSayMessageLines(message.content.text)
  } as SayMessage
}

const _isDispAnchor = (isProgress: boolean, sayType: string): boolean => {
  return !isProgress || sayType !== MESSAGE_TYPE.MONOLOGUE_SAY
}

const createAnchorString = (typeCode: string, num: number): string => {
  const prefix = anchorPrefixMap.get(typeCode)
  if (prefix == null) return ''
  return `>>${prefix}${num}`
}

const createAnchorCopyString = (
  typeCode: string,
  anchorString: string,
  shortName: string
): string => {
  if (typeCode === MESSAGE_TYPE.WEREWOLF_SAY) return anchorString
  return shortName + anchorString
}

const convertToSayMessageLines = (text: string): SayMessageLine[] => {
  return splitBr(text)
    .map(lineText => escapeHtml(lineText))
    .map(lineText => {
      return {
        sentences: convertToSayMessageSentences(lineText)
      } as SayMessageLine
    })
}

const splitBr = (text: string): string[] =>
  text.replace(/(\r\n|\n|\r)/gm, '<br>').split('<br>')

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const convertToSayMessageSentences = (text: string): SayMessageSentence[] => {
  // アンカーとそれ以外で分割
  let splitedTexts: string[] = [text]
  regexps.forEach(regex => {
    splitedTexts = appendSplit(splitedTexts, regex)
  })
  return splitedTexts
    .filter(mes => mes !== '')
    .map(splitedText => {
      return {
        is_anchor: regexps.some(reg => reg.test(splitedText)),
        text: splitedText
      } as SayMessageSentence
    })
}

export const convertToSystemMessage = (message: Message): SystemMessage => {
  return {
    unix_time_milli: message.time.unix_time_milli,
    message_class: systemMessageClassMap.get(message.content.type.code) || '',
    message_lines: splitBr(message.content.text).map(lineText =>
      escapeHtml(lineText)
    )
  } as SystemMessage
}

const regexps: RegExp[] = [
  /(&gt;&gt;\d{1,5})/,
  /(&gt;&gt;\+\d{1,5})/,
  /(&gt;&gt;=\d{1,5})/,
  /(&gt;&gt;@\d{1,5})/,
  /(&gt;&gt;-\d{1,5})/,
  /(&gt;&gt;\*\d{1,5})/,
  /(&gt;&gt;#\d{1,5})/
]

const appendSplit = (array: string[], regex: RegExp): string[] => {
  let splitedMessages: string[] = []
  array.slice().forEach(mes => {
    splitedMessages = splitedMessages.concat(mes.split(regex))
  })
  return splitedMessages
}

export const getAnchorType = (mes: string): string | null => {
  if (mes.match(/(&gt;&gt;\d{1,5})/)) {
    return MESSAGE_TYPE.NORMAL_SAY
  } else if (mes.match(/(&gt;&gt;-\d{1,5})/)) {
    return MESSAGE_TYPE.MONOLOGUE_SAY
  } else if (mes.match(/(&gt;&gt;\*\d{1,5})/)) {
    return MESSAGE_TYPE.WEREWOLF_SAY
  } else if (mes.match(/(&gt;&gt;\+\d{1,5})/)) {
    return MESSAGE_TYPE.GRAVE_SAY
  } else if (mes.match(/(&gt;&gt;=\d{1,5})/)) {
    return MESSAGE_TYPE.MASON_SAY
  } else if (mes.match(/(&gt;&gt;@\d{1,5})/)) {
    return MESSAGE_TYPE.SPECTATE_SAY
  } else if (mes.match(/(&gt;&gt;#\d{1,5})/)) {
    return MESSAGE_TYPE.CREATOR_SAY
  }
  return null
}

export const getAnchorNum = (text: string): number =>
  parseInt(RegExp(/\d{1,5}/).exec(text)![0])

const sayMessageClassMap: Map<string, string> = new Map([
  [MESSAGE_TYPE.NORMAL_SAY, 'normal-say'],
  [MESSAGE_TYPE.WEREWOLF_SAY, 'werewolf-say'],
  [MESSAGE_TYPE.MONOLOGUE_SAY, 'monologue-say'],
  [MESSAGE_TYPE.GRAVE_SAY, 'grave-say'],
  [MESSAGE_TYPE.SPECTATE_SAY, 'spectate-say']
])

const systemMessageClassMap: Map<string, string> = new Map([
  [MESSAGE_TYPE.PUBLIC_SYSTEM, ''],
  [MESSAGE_TYPE.PRIVATE_SYSTEM, 'message-system-private'],
  [MESSAGE_TYPE.PRIVATE_SEER, 'message-system-private-seer'],
  [MESSAGE_TYPE.PRIVATE_PSYCHIC, 'message-system-private-psychic'],
  [MESSAGE_TYPE.PRIVATE_WEREWOLF, 'message-system-private-werewolf'],
  [MESSAGE_TYPE.PRIVATE_FANATIC, 'message-system-private-werewolf'],
  [MESSAGE_TYPE.PRIVATE_MASON, 'message-system-private-mason'],
  [MESSAGE_TYPE.PRIVATE_FOX, 'message-system-private-fox'],
  [MESSAGE_TYPE.PRIVATE_SYMPATHIZER, 'message-system-private-mason'],
  [MESSAGE_TYPE.PARTICIPANTS, '']
])

const anchorPrefixMap: Map<string, string> = new Map([
  [MESSAGE_TYPE.NORMAL_SAY, ''],
  [MESSAGE_TYPE.MONOLOGUE_SAY, '-'],
  [MESSAGE_TYPE.GRAVE_SAY, '+'],
  [MESSAGE_TYPE.WEREWOLF_SAY, '*'],
  [MESSAGE_TYPE.MASON_SAY, '='],
  [MESSAGE_TYPE.SPECTATE_SAY, '@'],
  [MESSAGE_TYPE.CREATOR_SAY, '#']
])
