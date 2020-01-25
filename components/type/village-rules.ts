import Boolean from '~/components/type/boolean'
import VillageMessageRestricts from '~/components/type/village-message-restricts'

interface VillageRules {
  open_vote: Boolean
  available_skill_request: Boolean
  available_spectate: Boolean
  open_skill_in_grave: Boolean
  visible_grave_message: Boolean
  available_suddenly_death: Boolean
  available_commit: Boolean
  message_restrict: VillageMessageRestricts
}

export default VillageRules
