import VillageParticipant from '~/components/type/village-participant'
import Chara from '~/components/type/chara'

interface VillageParticipateSituation {
  is_participating: boolean
  is_available_participate: boolean
  is_available_spectate: boolean
  selectable_chara_list: Chara[]
  is_available_leave: boolean
  myself: VillageParticipant | null
}

export default VillageParticipateSituation
