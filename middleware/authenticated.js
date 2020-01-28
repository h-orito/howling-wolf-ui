import firebase from '~/plugins/firebase'
// import { LOGINOUT } from '~/store/action-types'

export default async function({ store }) {
  return await firebase.auth().onAuthStateChanged(async user => {
    await store.dispatch('LOGINOUT', {
      user
    })
  })
}
