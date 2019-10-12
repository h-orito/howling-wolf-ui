import { LOGINOUT } from '~/store/action-types'
import Player from '~/components/type/player/player'

const state = {
  player: null,
  photoUrl: null
}

const mutations = {
  login(state, { player, photoUrl }) {
    state.player = player
    state.photoUrl = photoUrl
  },
  logout(state) {
    state.player = null
    state.photoUrl = null
  }
}

const actions = {
  async [LOGINOUT]({ commit }, { user }) {
    const self = <any>this
    if (user) {
      // // get new id-token
      const idToken = await user.getIdToken(true)

      // // save cookie
      self.$cookies.set('id-token', idToken, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30
      })
      // // get user from server
      const res = await self.$axios.$get('/myplayer')
      commit('login', {
        player: res.player,
        photoUrl: user.photoURL
      })
    } else {
      self.$cookies.remove('id-token', {
        path: '/'
      })
      commit('logout')
    }
  }
}

const getters = {
  getPlayer: state => state.player,
  isLogin: state => state.player != null,
  getPhotoUrl: state => state.photoUrl
}

export default {
  state,
  mutations,
  actions,
  getters
}
