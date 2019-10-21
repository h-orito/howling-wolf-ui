import Chara from '~/components/type/chara/chara'
import Player from '~/components/type/player/player'
import Dead from '~/components/type/dead/dead'
import Skill from '~/components/type/skill/skill'

interface VillageParticipant {
  id: number
  chara: Chara
  player: Player | null
  dead: Dead | null
  spectator: boolean
  skill: Skill | null
}

export default VillageParticipant
