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
    villageUserSettings.createCookieIfNeeded(<any>this)
    const settings = villageUserSettings.getCookie(<any>this)
    await commit('initSettings', { settings })
  }
}

const getters = {
  getVillageUserSettings: (state): VillageUserSettings => state.settings,
  isDarkTheme: (state): boolean => state.settings.theme?.is_dark || false
}

export default {
  state,
  mutations,
  actions,
  getters
}
