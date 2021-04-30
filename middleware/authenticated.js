import firebase from '~/plugins/firebase'

const excludePaths = ['/', '/village', '/player-record']

export default function({ store, route }) {
  const currentPath = route.path
  // 認証を待つ必要があるページは個別で行なっているのでここでは何もしない
  if (excludePaths.some(it => it === currentPath)) return
  firebase.auth().onAuthStateChanged(user => {
    store.dispatch('LOGINOUT', {
      user
    })
  })
}
