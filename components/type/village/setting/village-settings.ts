import PersonCapacity from '~/components/type/village/setting/person-capacity'
import VillageTime from '~/components/type/village/setting/village-time'
import VillageCharachip from '~/components/type/village/setting/village-charachip'
import VillageOrganizations from '~/components/type/village/setting/village-organizations'
import VillageRules from '~/components/type/village/setting/village-rules'
import VillagePassword from '~/components/type/village/setting/village-password'

interface VillageSettings {
  capacity: PersonCapacity
  time: VillageTime
  charachip: VillageCharachip
  organizations: VillageOrganizations
  rules: VillageRules
  password: VillagePassword
}

export default VillageSettings
