import firebase from '~/plugins/firebase'
import * as actionType from '~/store/action-types'

export default async function({ store }) {
  return await firebase.auth().onAuthStateChanged(async user => {
    await store.dispatch(actionType.LOGINOUT, {
      user: user
    })
  })
}
