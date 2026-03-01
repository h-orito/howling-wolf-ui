import AbilityType from '~/components/type/ability-type'

interface VillageAbility {
  village_day_id: number
  myself_id: number
  target_id: number | null
  ability_type: AbilityType
}

export default VillageAbility
