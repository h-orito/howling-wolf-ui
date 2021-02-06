import Vuex from 'vuex'
import auth from './modules/auth'
import village from './modules/village'
import villageSettings from './modules/village-settings'

const store = () =>
  new Vuex.Store({
    modules: {
      auth,
      village,
      villageSettings
    }
  })
export default store
