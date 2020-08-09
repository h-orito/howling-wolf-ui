import Player from '~/components/type/player'
import Chara from '~/components/type/chara'
import Dead from '~/components/type/dead'
import ComingOuts from '~/components/type/coming-outs'
import Skill from '~/components/type/skill'
import SkillRequest from '~/components/type/skill-request'

interface VillageParticipant {
  id: number
  chara: Chara
  player: Player | null
  dead: Dead | null
  spectator: boolean
  skill: Skill | null
  skill_request: SkillRequest | null
  win: boolean | null
  coming_outs: ComingOuts
}

export default VillageParticipant
