import VillageSaySituation from '~/components/type/village-say-situation'
import VillageParticipateSituation from '~/components/type/village-participate-situation'
import VillageSkillRequestSituation from '~/components/type/village-skill-request-situation'
import VillageCommitSituation from '~/components/type/village-commit-situation'
import VillageVoteSituation from '~/components/type/village-vote-situation'
import VillageAbilitySituations from '~/components/type/village-ability-situations'
import VillageComingOutSituation from '~/components/type/village-coming-out-situation'

interface SituationAsParticipant {
  participate: VillageParticipateSituation
  skill_request: VillageSkillRequestSituation
  commit: VillageCommitSituation
  coming_out: VillageComingOutSituation
  say: VillageSaySituation
  ability: VillageAbilitySituations
  vote: VillageVoteSituation
}

export default SituationAsParticipant
