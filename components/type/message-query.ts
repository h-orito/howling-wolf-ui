import VillageParticipant from '~/components/type/village-participant'
import CDef.MessageType from '~/components/type/c-def.-message-type'

interface MessageQuery {
  from: number | null
  page_size: number | null
  page_num: number | null
  participant: VillageParticipant | null
  message_type_list: CDef.MessageType[]
  participant_id_list: number[] | null
  include_monologue: boolean
  include_secret: boolean
}

export default MessageQuery
