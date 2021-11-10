import VillageParticipant from '~/components/type/village-participant'
import AbilityType from '~/components/type/ability-type'

interface VillageAbilitySituation {
  type: AbilityType
  attacker_list: VillageParticipant[]
  attacker: VillageParticipant | null
  target_list: VillageParticipant[]
  target: VillageParticipant | null
  usable: boolean
  available_no_target: boolean
}

export default VillageAbilitySituation
