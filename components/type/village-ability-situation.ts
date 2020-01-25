import Ability from '~/components/type/ability'
import VillageParticipant from '~/components/type/village-participant'
import VillageParticipant from '~/components/type/village-participant'
import Boolean // 能力行使可能か from '~/components/type/boolean-//-能力行使可能か'

interface VillageAbilitySituation {
  type: Ability
  target_list: VillageParticipant[]
  target: VillageParticipant | null
  usable: Boolean // 能力行使可能か
}

export default VillageAbilitySituation
