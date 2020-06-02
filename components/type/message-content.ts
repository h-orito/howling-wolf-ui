import MessageType from '~/components/type/message-type'

interface MessageContent {
  type: MessageType
  num: number | null
  count: number | null
  text: string
  face_code: string | null
}

export default MessageContent
