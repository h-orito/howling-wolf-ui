import Vuex from 'vuex'
import auth from './modules/auth'
import village from './modules/village'

const store = () =>
  new Vuex.Store({
    modules: {
      auth,
      village
    }
  })
export default store
