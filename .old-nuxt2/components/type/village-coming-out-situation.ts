import ComingOuts from '~/components/type/coming-outs'
import Skill from '~/components/type/skill'

interface VillageComingOutSituation {
  available_coming_out: boolean
  current_coming_outs: ComingOuts
  selectable_skill_list: Skill[]
}

export default VillageComingOutSituation
