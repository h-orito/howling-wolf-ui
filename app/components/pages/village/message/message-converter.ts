import type { DeepReadonly } from 'vue'
import type { MessageView } from '~/lib/api/types'
import { MESSAGE_TYPE } from '~/lib/api/message-constants'

// アンカー接頭辞マップ
const anchorPrefixMap: Map<string, string> = new Map([
  [MESSAGE_TYPE.NORMAL_SAY, ''],
  [MESSAGE_TYPE.MONOLOGUE_SAY, '-'],
  [MESSAGE_TYPE.GRAVE_SAY, '+'],
  [MESSAGE_TYPE.WEREWOLF_SAY, '*'],
  [MESSAGE_TYPE.MASON_SAY, '='],
  [MESSAGE_TYPE.SPECTATE_SAY, '@'],
  [MESSAGE_TYPE.CREATOR_SAY, '#'],
  [MESSAGE_TYPE.SECRET_SAY, 's']
])

// HTMLエスケープ処理
export const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// アンカー文字列の生成（例: >>884, >>*123）
export const createAnchorString = (typeCode: string, num: number): string => {
  const prefix = anchorPrefixMap.get(typeCode)
  if (prefix == null) return ''
  return `>>${prefix}${num}`
}

// コピー用アンカー文字列の生成
export const createAnchorCopyString = (
  typeCode: string,
  anchorString: string,
  shortName: string
): string => {
  if (typeCode === MESSAGE_TYPE.WEREWOLF_SAY) return anchorString
  return shortName + anchorString
}

// 装飾タグの変換処理
const colorRegex = /\[\[(#[0-9a-fA-F]{6})\]\]([\s\S]*?)\[\[\/#\]\]/g
const boldRegex = /\[\[b\]\]([\s\S]*?)\[\[\/b\]\]/g
const strikeRegex = /\[\[s\]\]([\s\S]*?)\[\[\/s\]\]/g
const largeRegex = /\[\[large\]\]([\s\S]*?)\[\[\/large\]\]/g
const smallRegex = /\[\[small\]\]([\s\S]*?)\[\[\/small\]\]/g
const rubyRegex =
  /\[\[ruby\]\]([\s\S]*?)\[\[rt\]\]([\s\S]*?)\[\[\/rt\]\]\[\[\/ruby\]\]/g
const cwRegex = /\[\[cw\]\]([\s\S]*?)\[\[\/cw\]\]/g

export const convertToDecoratedText = (text: string): string => {
  let t = String(text)
  t = t.replace(colorRegex, '<span style="color: $1">$2</span>')
  t = t.replace(boldRegex, '<strong>$1</strong>')
  t = t.replace(
    strikeRegex,
    '<span style="text-decoration: line-through;">$1</span>'
  )
  t = t.replace(largeRegex, '<span style="font-size: 150%;">$1</span>')
  t = t.replace(smallRegex, '<span style="font-size: 80%;">$1</span>')
  t = t.replace(rubyRegex, '<ruby>$1<rt>$2</rt></ruby>')
  t = t.replace(
    cwRegex,
    '<span class="netabare cursor-pointer" onclick="this.classList.remove(\'netabare\')">$1</span>'
  )
  return t
}

// アンカータグへの変換
const anchorRegexps: RegExp[] = [
  /(&gt;&gt;\d{1,5})/g,
  /(&gt;&gt;\+\d{1,5})/g,
  /(&gt;&gt;=\d{1,5})/g,
  /(&gt;&gt;@\d{1,5})/g,
  /(&gt;&gt;-\d{1,5})/g,
  /(&gt;&gt;\*\d{1,5})/g,
  /(&gt;&gt;#\d{1,5})/g,
  /(&gt;&gt;s\d{1,5})/g
]

export const convertToAnchorTag = (text: string): string => {
  let t = String(text)
  anchorRegexps.forEach((regex) => {
    t = t.replace(
      regex,
      '<a href="javascript:void(0);" class="anchor text-blue-600 font-bold hover:underline">$1</a>'
    )
  })
  return t
}

// メッセージテキストの完全な変換
export const convertToMessageText = (text: string): string => {
  return convertToAnchorTag(convertToDecoratedText(escapeHtml(text)))
}

// アンカータイプの取得
export const getAnchorType = (mes: string): string | null => {
  const text = escapeHtml(mes)
  if (text.match(/(&gt;&gt;\d{1,5})/)) {
    return MESSAGE_TYPE.NORMAL_SAY
  } else if (text.match(/(&gt;&gt;-\d{1,5})/)) {
    return MESSAGE_TYPE.MONOLOGUE_SAY
  } else if (text.match(/(&gt;&gt;\*\d{1,5})/)) {
    return MESSAGE_TYPE.WEREWOLF_SAY
  } else if (text.match(/(&gt;&gt;\+\d{1,5})/)) {
    return MESSAGE_TYPE.GRAVE_SAY
  } else if (text.match(/(&gt;&gt;=\d{1,5})/)) {
    return MESSAGE_TYPE.MASON_SAY
  } else if (text.match(/(&gt;&gt;@\d{1,5})/)) {
    return MESSAGE_TYPE.SPECTATE_SAY
  } else if (text.match(/(&gt;&gt;#\d{1,5})/)) {
    return MESSAGE_TYPE.CREATOR_SAY
  } else if (text.match(/(&gt;&gt;s\d{1,5})/)) {
    return MESSAGE_TYPE.SECRET_SAY
  }
  return null
}

// アンカー番号の取得
export const getAnchorNum = (text: string): number => {
  const match = RegExp(/\d{1,5}/).exec(text)
  return match ? parseInt(match[0]) : 0
}

// アンカー表示判定
export const isDispAnchor = (isProgress: boolean, sayType: string): boolean => {
  // 独り言、秘話以外なら表示
  if (
    sayType !== MESSAGE_TYPE.MONOLOGUE_SAY &&
    sayType !== MESSAGE_TYPE.SECRET_SAY
  ) {
    return true
  }
  // 独り言、秘話は進行中なら表示しない
  return !isProgress
}

// メッセージ番号の計算（日付.番号形式）
export const getMessageNumber = (
  message: DeepReadonly<MessageView> | MessageView
): string => {
  if (message.content.num) {
    return `${message.time.day}.${message.content.num}`
  }
  return `${message.time.day}.0`
}

// カミングアウト文字列の生成
export const getComingOutString = (
  message: DeepReadonly<MessageView> | MessageView
): string | null => {
  if (
    !message.from?.coming_outs ||
    message.from.coming_outs.list.length === 0
  ) {
    return null
  }
  return (
    message.from.coming_outs.list.map((co) => co.skill.name).join(',') + 'CO'
  )
}
