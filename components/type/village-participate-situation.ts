import VillageParticipant from '~/components/type/village-participant'
import Chara from '~/components/type/chara'

interface VillageParticipateSituation {
  participating: boolean
  available_participate: boolean
  available_spectate: boolean
  selectable_chara_list: Chara[]
  available_leave: boolean
  myself: VillageParticipant | null
}

export default VillageParticipateSituation
