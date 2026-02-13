import MessageType from '~/components/type/message-type'
import VillageParticipant from '~/components/type/village-participant'
import VillageSayRestrictSituation from '~/components/type/village-say-restrict-situation'

interface VillageSayMessageTypeSituation {
  message_type: MessageType
  restrict: VillageSayRestrictSituation
  target_list: VillageParticipant[]
}

export default VillageSayMessageTypeSituation
