import firebase from '~/plugins/firebase'

export default function({ store }) {
  firebase.auth().onAuthStateChanged(user => {
    store.dispatch('LOGINOUT', {
      user
    })
  })
}
