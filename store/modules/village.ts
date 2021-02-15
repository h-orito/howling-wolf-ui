import {
  INIT_VILLAGE,
  STORE_VILLAGE,
  STORE_MESSAGES,
  STORE_SITUATION,
  STORE_FILTERING
} from '~/store/action-types'
import Village from '~/components/type/village'
import VillageDay from '~/components/type/village-day'
import Messages from '~/components/type/messages'
import SituationAsParticipant from '~/components/type/situation-as-participant'

const state: {
  villageId: number | null
  village: Village | null
  messages: Messages | null
  situation: SituationAsParticipant | null
  isFiltering: boolean
} = {
  villageId: null,
  village: null,
  messages: null,
  situation: null,
  isFiltering: false
}

const mutations = {
  init(state, { villageId }) {
    state.villageId = villageId
    state.village = null
    state.messages = null
    state.situation = null
  },
  saveVillage(state, { village }) {
    state.village = village
  },
  saveMessages(state, { messages }) {
    state.messages = messages
  },
  saveSituation(state, { situation }) {
    state.situation = situation
  },
  saveFiltering(state, { isFiltering }) {
    state.isFiltering = isFiltering
  }
}

const actions = {
  async [INIT_VILLAGE]({ commit }, { villageId }) {
    await commit('init', { villageId })
  },
  async [STORE_VILLAGE]({ commit }, { village }) {
    await commit('saveVillage', { village })
  },
  async [STORE_MESSAGES]({ commit }, { messages }) {
    await commit('saveMessages', { messages })
  },
  async [STORE_SITUATION]({ commit }, { situation }) {
    await commit('saveSituation', { situation })
  },
  async [STORE_FILTERING]({ commit }, { isFiltering }) {
    await commit('saveFiltering', { isFiltering })
  }
}

const getters = {
  getVillageId: (state): number => state.villageId,
  getVillage: (state): Village | null => state.village,
  getLatestDay: (state): VillageDay | null => {
    const village = state.village
    if (!village) return null
    return village.day.day_list[village.day.day_list.length - 1]
  },
  getMessages: state => state.messages,
  getSituation: state => state.situation,
  isFiltering: state => state.isFiltering
}

export default {
  state,
  mutations,
  actions,
  getters
}
