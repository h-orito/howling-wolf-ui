import VillageParticipantSituation from '~/components/type/village-participant-situation'

interface VillageAdminSituation {
  admin: boolean
  participant_list: VillageParticipantSituation[]
}

export default VillageAdminSituation
