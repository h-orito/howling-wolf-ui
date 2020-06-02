import Player from '~/components/type/player'
import ParticipateVillage from '~/components/type/participate-village'
import CampRecord from '~/components/type/camp-record'
import Record from '~/components/type/record'
import SkillRecord from '~/components/type/skill-record'

interface PlayerRecords {
  player: Player
  whole_record: Record
  camp_record_list: CampRecord[]
  skill_record_list: SkillRecord[]
  participate_village_list: ParticipateVillage[]
}

export default PlayerRecords
