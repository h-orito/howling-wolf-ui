import VillageSayMessageTypeSituation from '~/components/type/village-say-message-type-situation'
import CharaFace from '~/components/type/chara-face'
import MessageType from '~/components/type/message-type'

interface VillageSaySituation {
  is_available_say: boolean
  selectable_message_type_list: VillageSayMessageTypeSituation[]
  selectable_face_type_list: CharaFace[]
  default_message_type: MessageType | null
}

export default VillageSaySituation
