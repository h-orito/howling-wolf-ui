import Player from '~/components/type/player'
import Chara from '~/components/type/chara'
import Dead from '~/components/type/dead'
import Skill from '~/components/type/skill'

interface VillageParticipant {
  id: number
  chara: Chara
  player: Player | null
  dead: Dead | null
  spectator: boolean
  skill: Skill | null
}

export default VillageParticipant
