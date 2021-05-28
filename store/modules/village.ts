import {
  INIT_VILLAGE,
  LOAD_VILLAGE,
  STORE_MESSAGES,
  STORE_SITUATION,
  STORE_FILTERING,
  LOAD_DEBUGVILLAGE
} from '~/store/action-types'
import api from '~/components/village/village-api'
import Village from '~/components/type/village'
import VillageDay from '~/components/type/village-day'
import Messages from '~/components/type/messages'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import DebugVillage from '~/components/type/debug-village'

const state: {
  villageId: number | null
  village: Village | null
  latestDay: VillageDay | null
  restrictCountMap: Map<string, number> | null
  messages: Messages | null
  situation: SituationAsParticipant | null
  isFiltering: boolean
  debugVillage: DebugVillage | null
} = {
  villageId: null,
  village: null,
  latestDay: null,
  restrictCountMap: null,
  messages: null,
  situation: null,
  isFiltering: false,
  debugVillage: null
}

const mutations = {
  init(state, { villageId }) {
    state.villageId = villageId
    state.village = null
    state.latestDay = null
    state.restrictCountMap = null
    state.messages = null
    state.situation = null
    state.debugVillage = null
  },
  saveVillage(state, { village }) {
    const v: Village = village
    state.village = v
    if (!v) return
    state.latestDay = v.day.day_list[v.day.day_list.length - 1]
    state.restrictCountMap = new Map(
      v.setting.rules.message_restrict.restrict_list.map(r => [
        r.type.code,
        r.count
      ])
    )
  },
  saveMessages(state, { messages }) {
    state.messages = messages
  },
  saveSituation(state, { situation }) {
    state.situation = situation
  },
  saveFiltering(state, { isFiltering }) {
    state.isFiltering = isFiltering
  },
  saveDebugVillage(state, { debugVillage }) {
    state.debugVillage = debugVillage
  }
}

const actions = {
  async [INIT_VILLAGE]({ commit }, { villageId }) {
    await commit('init', { villageId })
  },
  async [LOAD_VILLAGE]({ commit, state }) {
    const village = await api.fetchVillage(<any>this, state.villageId)
    await commit('saveVillage', { village })
  },
  async [STORE_MESSAGES]({ commit }, { messages }) {
    await commit('saveMessages', { messages: null })
    await commit('saveMessages', { messages })
  },
  async [STORE_SITUATION]({ commit }, { situation }) {
    await commit('saveSituation', { situation })
  },
  async [STORE_FILTERING]({ commit }, { isFiltering }) {
    await commit('saveFiltering', { isFiltering })
  },
  async [LOAD_DEBUGVILLAGE]({ commit, state }) {
    const debugVillage = await api.fetchDebugVillage(<any>this, state.villageId)
    await commit('saveDebugVillage', { debugVillage })
  }
}

const getters = {
  getVillageId: (state): number => state.villageId,
  getVillage: (state): Village | null => state.village,
  getLatestDay: (state): VillageDay | null => state.latestDay,
  getRestrictCountMap: (state): Map<string, number> | null =>
    state.restrictCountMap,
  getMessages: state => state.messages,
  getSituation: state => state.situation,
  isFiltering: state => state.isFiltering,
  getDebugVillage: (state): DebugVillage | null => state.debugVillage
}

export default {
  state,
  mutations,
  actions,
  getters
}
