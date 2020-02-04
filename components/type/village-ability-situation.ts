import VillageParticipant from '~/components/type/village-participant'
import Ability from '~/components/type/ability'

interface VillageAbilitySituation {
  type: Ability
  target_list: VillageParticipant[]
  target: VillageParticipant | null
  usable: boolean
  available_no_target: boolean
}

export default VillageAbilitySituation
