import { LOGINOUT } from '~/store/action-types'

const state = {
  player: null,
  photoUrl: null,
  user: null
}
let authUbsubscribe = null

const mutations = {
  login(state, { player, photoUrl, user }) {
    state.player = player
    state.photoUrl = photoUrl
    state.user = user
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
      // get new id-token
      const idToken = await user.getIdToken(true)

      // save cookie
      self.$cookies.set('id-token', idToken, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30
      })
      // 1時間で有効期限が切れるので50分後に再取得させる
      const now = new Date()
      self.$cookies.set(
        'id-token-check-date',
        now.setMinutes(now.getHours() + 50),
        {
          path: '/',
          maxAge: 60 * 60 * 24 * 30
        }
      )
      // get user from server
      const myPlayer = await self.$axios.$get('/my-player')
      commit('login', {
        player: myPlayer,
        photoUrl: user.photoURL,
        user: user
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
