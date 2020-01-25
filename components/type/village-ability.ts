import Ability from '~/components/type/ability'

interface VillageAbility {
  village_day_id: number
  myself_id: number
  target_id: number | null
  ability: Ability
}

export default VillageAbility
