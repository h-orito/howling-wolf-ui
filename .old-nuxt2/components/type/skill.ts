import MessageType from '~/components/type/message-type'
import Camp from '~/components/type/camp'
import AbilityType from '~/components/type/ability-type'

interface Skill {
  code: string
  name: string
  short_name: string
  win_judge_camp: Camp
  ability_list: AbilityType[]
  manual_ability_list: AbilityType[]
  divine_result_wolf: boolean
  psychic_result_wolf: boolean
  sayable_skill_message_type_list: MessageType[]
  viewable_skill_message_type_list: MessageType[]
  count_camp: Camp | null
  description: string
}

export default Skill
