import MessageType from '~/components/type/message-type'
import Camp from '~/components/type/camp'
import Ability from '~/components/type/ability'

interface Skill {
  code: string
  name: string
  short_name: string
  win_judge_camp: Camp
  ability_list: Ability[]
  manual_ability_list: Ability[]
  divine_result_wolf: boolean
  psychic_result_wolf: boolean
  sayable_skill_message_type_list: MessageType[]
  viewable_skill_message_type_list: MessageType[]
  count_camp: Camp | null
  description: string
}

export default Skill
