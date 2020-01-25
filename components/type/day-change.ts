import Village from '~/components/type/village'
import Messages from '~/components/type/messages'
import VillageVotes from '~/components/type/village-votes'
import VillageAbilities from '~/components/type/village-abilities'
import Players from '~/components/type/players'

interface DayChange {
  is_change: boolean
  village: Village
  messages: Messages
  votes: VillageVotes
  abilities: VillageAbilities
  players: Players
}

export default DayChange
