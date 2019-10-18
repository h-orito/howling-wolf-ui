import VillageStatus from '~/components/type/village/village-status'
import VillageSettings from '~/components/type/village/setting/village-settings'
import VillageParticipants from '~/components/type/village/participant/village-participants'

interface Village {
  id: number
  name: string
  creator_player_name: string
  status: VillageStatus
  setting: VillageSettings
  participant: VillageParticipants
  spectator: VillageParticipants
}

export default Village
