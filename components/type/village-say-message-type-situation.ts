import MessageType from '~/components/type/message-type'
import VillageSayRestrictSituation from '~/components/type/village-say-restrict-situation'
import VillageParticipant from '~/components/type/village-participant'

interface VillageSayMessageTypeSituation {
  message_type: MessageType
  restrict: VillageSayRestrictSituation
  target_list: VillageParticipant[]
}

export default VillageSayMessageTypeSituation
