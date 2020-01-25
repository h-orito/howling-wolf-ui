import Int // 投票元villageParticipantId from '~/components/type/int-//-投票元village-participant-id'
import Int // 投票先villageParticipantId from '~/components/type/int-//-投票先village-participant-id'

interface VillageVote {
  village_day_id: number
  myself_id: Int // 投票元villageParticipantId
  target_id: Int // 投票先villageParticipantId
}

export default VillageVote
