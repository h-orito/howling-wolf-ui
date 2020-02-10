import firebase from '~/plugins/firebase'
// import { LOGINOUT } from '~/store/action-types'

export default function({ store }) {
  return firebase.auth().onAuthStateChanged(user => {
    store.dispatch('LOGINOUT', {
      user
    })
  })
}
