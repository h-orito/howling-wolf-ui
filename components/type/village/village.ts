import VillageStatus from '~/components/type/village/village-status'
import VillageSettings from '~/components/type/village/setting/village-settings'
import VillageParticipants from '~/components/type/village/participant/village-participants'
import VillageVisitors from '~/components/type/village/visitor/village-visitors'

interface Village {
  id: number
  name: string
  creator_player_name: string
  status: VillageStatus
  setting: VillageSettings
  participant: VillageParticipants
  visitor: VillageVisitors
}

export default Village
