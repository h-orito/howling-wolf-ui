import VillageStatus from '~/components/type/village/village-status'
import VillageSettings from '~/components/type/village/setting/village-settings'
import VillageParticipants from '~/components/type/village/participant/village-participants'
import VillageDays from '~/components/type/village/village-days'

interface Village {
  id: number
  name: string
  creator_player_name: string
  status: VillageStatus
  setting: VillageSettings
  participant: VillageParticipants
  spectator: VillageParticipants
  day: VillageDays
}

export default Village
