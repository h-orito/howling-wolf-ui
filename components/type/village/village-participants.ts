import Dead from '~/components/type/dead/dead'

interface VillageParticipants {
  count: number
  member_list: VillageParticipant[]
}

interface VillageParticipant {
  id: number
  chara_id: number
  dead: Dead | null
}

export default VillageParticipants
