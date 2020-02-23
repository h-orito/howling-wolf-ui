import firebase from '~/plugins/firebase'

export default function({ store, route }) {
  const currentPath = route.path
  // 認証を待つ必要があるページは個別で行なっているのでここでは何もしない
  if (currentPath === '/' || currentPath === '/village') {
    return
  }
  firebase.auth().onAuthStateChanged(user => {
    store.dispatch('LOGINOUT', {
      user
    })
  })
}
