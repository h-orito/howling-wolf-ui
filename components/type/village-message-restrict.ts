import MessageType from '~/components/type/message-type'
import Int from '~/components/type/int'

interface VillageMessageRestrict {
  type: MessageType
  count: number
  length: number
  line: Int
}

export default VillageMessageRestrict
