import VillageSettings from '~/components/type/village/village-settings'
import VillageParticipants from '~/components/type/village/village-participants'
import VillageVisitors from '~/components/type/village/village-visitors'

interface Village {
  id: number
  name: string
  creator_player_id: number
  status: string
  setting: VillageSettings
  participant: VillageParticipants
  visitor: VillageVisitors
}

export default Village
