import VillageAbilitySituations // TODO 役職仲間 from '~/components/type/village-ability-situations-//-t-o-d-o-役職仲間'
import VillageSaySituation from '~/components/type/village-say-situation'
import VillageParticipateSituation from '~/components/type/village-participate-situation'
import VillageSkillRequestSituation from '~/components/type/village-skill-request-situation'
import VillageCommitSituation from '~/components/type/village-commit-situation'
import VillageVoteSituation from '~/components/type/village-vote-situation'

interface SituationAsParticipant {
  participate: VillageParticipateSituation
  skill_request: VillageSkillRequestSituation
  commit: VillageCommitSituation
  say: VillageSaySituation
  ability: VillageAbilitySituations // TODO 役職仲間
  vote: VillageVoteSituation
}

export default SituationAsParticipant
