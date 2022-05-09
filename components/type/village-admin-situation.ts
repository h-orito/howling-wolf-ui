import VillageParticipantSituation from '~/components/type/village-participant-situation'

interface VillageAdminSituation {
  admin: boolean
  available_kick: boolean
  participant_list: VillageParticipantSituation[]
}

export default VillageAdminSituation
