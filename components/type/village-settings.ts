import PersonCapacity from '~/components/type/person-capacity'
import VillageTime from '~/components/type/village-time'
import VillageCharachip from '~/components/type/village-charachip'
import VillageOrganizations from '~/components/type/village-organizations'
import VillageRules from '~/components/type/village-rules'
import VillagePassword from '~/components/type/village-password'

interface VillageSettings {
  capacity: PersonCapacity
  time: VillageTime
  charachip: VillageCharachip
  organizations: VillageOrganizations
  rules: VillageRules
  password: VillagePassword
}

export default VillageSettings
