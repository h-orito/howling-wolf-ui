import Skill from '~/components/type/skill'
import SkillRequest from '~/components/type/skill-request'

interface VillageSkillRequestSituation {
  available_skill_request: boolean
  selectable_skill_list: Skill[]
  skill_request: SkillRequest | null
}

export default VillageSkillRequestSituation
