import Player from '~/components/type/player'
import VillageDays from '~/components/type/village-days'
import VillageSettings from '~/components/type/village-settings'
import VillageParticipants from '~/components/type/village-participants'
import Camp from '~/components/type/camp'
import VillageStatus from '~/components/type/village-status'

interface Village {
  id: number
  name: string
  creator_player: Player
  status: VillageStatus
  win_camp: Camp | null
  setting: VillageSettings
  participant: VillageParticipants
  spectator: VillageParticipants
  day: VillageDays
  silent_time: boolean
}

export default Village
