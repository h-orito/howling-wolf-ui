import Int // 行使元villageParticipantId from '~/components/type/int-//-行使元village-participant-id'
import Int // 行使先villageParticipantId from '~/components/type/int-//-行使先village-participant-id'
import Ability from '~/components/type/ability'

interface VillageAbility {
  village_day_id: number
  myself_id: Int // 行使元villageParticipantId
  target_id: Int // 行使先villageParticipantId | null
  ability: Ability
}

export default VillageAbility
