import VillageParticipant from '~/components/type/village-participant'
import MessageTime from '~/components/type/message-time'
import MessageContent from '~/components/type/message-content'

interface Message {
  from: VillageParticipant | null
  to: VillageParticipant | null
  time: MessageTime
  content: MessageContent
}

export default Message
