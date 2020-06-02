import VillageSaySituation from '~/components/type/village-say-situation'
import VillageParticipateSituation from '~/components/type/village-participate-situation'
import VillageSkillRequestSituation from '~/components/type/village-skill-request-situation'
import VillageCommitSituation from '~/components/type/village-commit-situation'
import VillageVoteSituation from '~/components/type/village-vote-situation'
import VillageAbilitySituations from '~/components/type/village-ability-situations'

interface SituationAsParticipant {
  participate: VillageParticipateSituation
  skill_request: VillageSkillRequestSituation
  commit: VillageCommitSituation
  say: VillageSaySituation
  ability: VillageAbilitySituations
  vote: VillageVoteSituation
}

export default SituationAsParticipant
