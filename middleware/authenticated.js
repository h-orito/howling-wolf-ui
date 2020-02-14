import firebase from '~/plugins/firebase'
// import { LOGINOUT } from '~/store/action-types'

export default async function({ store }) {
  // TODO それなりに待つのでトップページと村のcreatedだけにしてローディングを出しても良いかも
  const user = await new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => resolve(user))
  })
  await store.dispatch('LOGINOUT', {
    user
  })
}
