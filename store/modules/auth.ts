import { LOGINOUT } from '~/store/action-types'

const state = {
  user: null
}

const mutations = {
  login(state, user) {
    state.user = user
  },
  logout(state) {
    state.user = null
  }
}

const actions = {
  [LOGINOUT]({ commit }, { user, callback }) {
    if (user) {
      commit('login', user)
    } else {
      commit('logout')
    }
    if (callback) {
      callback(user)
    }
  }
}

const getters = {
  getUser: state => state.user,
  isLogin: state => state.user != null,
  getUserName: state => state.user.displayName
}

export default {
  state,
  mutations,
  actions,
  getters
}
