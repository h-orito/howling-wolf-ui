import VillageStatus from '~/components/type/village/village-status'
import VillageSettings from '~/components/type/village/village-settings'
import VillageParticipants from '~/components/type/village/village-participants'
import VillageVisitors from '~/components/type/village/village-visitors'

interface Village {
  id: number
  name: string
  creator_player_name: string
  status: VillageStatus
  setting: VillageSettings | null
  participant: VillageParticipants
  visitor: VillageVisitors
}

export default Village
