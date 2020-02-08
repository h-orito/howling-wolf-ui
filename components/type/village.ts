import Player from '~/components/type/player'
import VillageDays from '~/components/type/village-days'
import VillageSettings from '~/components/type/village-settings'
import VillageParticipants from '~/components/type/village-participants'
import VillageStatus from '~/components/type/village-status'
import VillageWinCamp from '~/components/type/village-win-camp'

interface Village {
  id: number
  name: string
  creator_player: Player
  status: VillageStatus
  win_camp: VillageWinCamp | null
  setting: VillageSettings
  participant: VillageParticipants
  spectator: VillageParticipants
  day: VillageDays
}

export default Village
