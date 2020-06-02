import MessageType from '~/components/type/message-type'

interface VillageMessageRestrict {
  type: MessageType
  count: number
  length: number
  line: number
}

export default VillageMessageRestrict
