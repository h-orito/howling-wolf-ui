import MessageType from '~/components/type/message-type'
import VillageSayMessageTypeSituation from '~/components/type/village-say-message-type-situation'
import CharaFace from '~/components/type/chara-face'

interface VillageSaySituation {
  is_available_say: boolean
  selectable_message_type_list: VillageSayMessageTypeSituation[]
  selectable_face_type_list: CharaFace[]
  default_message_type: MessageType | null
}

export default VillageSaySituation
