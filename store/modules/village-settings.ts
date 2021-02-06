import { INIT_VILLAGE_SETTINGS } from '~/store/action-types'
import villageUserSettings, {
  VillageUserSettings
} from '~/components/village/user-settings/village-user-settings'

const state: {
  settings: VillageUserSettings | null
} = {
  settings: null
}

const mutations = {
  initSettings(state, { settings }) {
    state.settings = settings
  }
}

const actions = {
  async [INIT_VILLAGE_SETTINGS]({ commit }) {
    const settings = villageUserSettings.getCookie(<any>this)
    await commit('initSettings', { settings })
  }
}

const getters = {
  getVillageUserSettings: (state): VillageUserSettings => state.settings
}

export default {
  state,
  mutations,
  actions,
  getters
}
