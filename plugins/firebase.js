import firebase from 'firebase'
import 'firebase/firestore'

const config = {
  databaseURL: process.env.FIREBASE_DATABASEURL,
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID
}

if (firebase.apps.length === 0) {
  firebase.initializeApp(config)
}

export default firebase
