import { messaging } from 'firebase'

const escapeAndSplitMessage = (message: string): string[] => {
  return message
    .replace(/(\r\n|\n|\r)/gm, '<br>')
    .split('<br>') // 先に改行を分割
    .map(item => {
      // htmlエスケープ
      item = item
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
      return item
    })
}

const appendSplit = (array: string[], regex: RegExp): string[] => {
  let splitedMessages: string[] = []
  array.slice().forEach(mes => {
    splitedMessages = splitedMessages.concat(mes.split(regex))
  })
  return splitedMessages
}

const splitAnchor = (message: string): Mes[] => {
  let splitedMessages = message.split(/(&gt;&gt;\d{1,5})/)
  splitedMessages = appendSplit(splitedMessages, /(&gt;&gt;\+\d{1,5})/)
  splitedMessages = appendSplit(
    splitedMessages,
    new RegExp(/(&gt;&gt;=\d{1,5})/)
  )
  splitedMessages = appendSplit(
    splitedMessages,
    new RegExp(/(&gt;&gt;@\d{1,5})/)
  )
  splitedMessages = appendSplit(
    splitedMessages,
    new RegExp(/(&gt;&gt;\-\d{1,5})/)
  )
  splitedMessages = appendSplit(
    splitedMessages,
    new RegExp(/(&gt;&gt;\*\d{1,5})/)
  )
  splitedMessages = appendSplit(
    splitedMessages,
    new RegExp(/(&gt;&gt;\#\d{1,5})/)
  )

  return splitedMessages.map(splitedMessage => {
    const anchorType: AnchorType | null = getAnchorType(splitedMessage)
    const mes: Mes = new Mes()
    mes.text = splitedMessage
    mes.anchorType = anchorType
    mes.isAnchor = anchorType != null
    if (anchorType != null) {
      const matchArray = RegExp(/\d{1,5}/).exec(splitedMessage)
      if (matchArray) {
        mes.messageNum = parseInt(matchArray[0])
      }
    }
    return mes
  })
}

const getAnchorType = (mes: string): AnchorType | null => {
  if (mes.match(/(&gt;&gt;\d{1,5})/)) {
    return AnchorType.Normal
  } else if (mes.match(/(&gt;&gt;\+\d{1,5})/)) {
    return AnchorType.Grave
  } else if (mes.match(/(&gt;&gt;=\d{1,5})/)) {
    return AnchorType.Mason
  } else if (mes.match(/(&gt;&gt;@\d{1,5})/)) {
    return AnchorType.Spectate
  } else if (mes.match(/(&gt;&gt;\-\d{1,5})/)) {
    return AnchorType.Monologue
  } else if (mes.match(/(&gt;&gt;\*\d{1,5})/)) {
    return AnchorType.Wolf
  } else if (mes.match(/(&gt;&gt;\#\d{1,5})/)) {
    return AnchorType.Creator
  }
  return null
}

class Mes {
  text: string = ''
  isAnchor: boolean = false
  anchorType: AnchorType | null = null
  messageNum: number | null = null
}

enum AnchorType {
  Normal = 'Normal',
  Grave = 'Grave',
  Wolf = 'Wolf',
  Mason = 'Mason',
  Spectate = 'Spectate',
  Monologue = 'Monologue',
  Creator = 'Creator'
}

export default ({ app }, inject) => {
  inject('escapeAndSplitMessage', escapeAndSplitMessage)
  inject('splitAnchor', splitAnchor)
}
