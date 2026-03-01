import {
  getAuth,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithPopup,
  linkWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  TwitterAuthProvider,
  type Auth,
  type User,
  type UserCredential,
  type Unsubscribe
} from 'firebase/auth'

/**
 * Firebase Authentication Service
 * Firebase認証の実装詳細を担当
 */

let authInstance: Auth | null = null

/**
 * Authインスタンスを取得
 */
const getAuthInstance = (): Auth => {
  if (!authInstance) {
    authInstance = getAuth()
  }
  return authInstance
}

/**
 * 認証状態の変更を監視
 */
export const onAuthStateChanged = (
  callback: (user: User | null) => void
): Unsubscribe => {
  return firebaseOnAuthStateChanged(getAuthInstance(), callback)
}

/**
 * Googleでサインイン
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider()
  return await signInWithPopup(getAuthInstance(), provider)
}

/**
 * Twitterでサインイン
 */
export const signInWithTwitter = async (): Promise<UserCredential> => {
  const provider = new TwitterAuthProvider()
  return await signInWithPopup(getAuthInstance(), provider)
}

/**
 * Googleアカウントをリンク
 */
export const linkWithGoogle = async (): Promise<UserCredential> => {
  const currentUser = getAuthInstance().currentUser
  if (!currentUser) {
    throw new Error('No user is currently signed in')
  }
  const provider = new GoogleAuthProvider()
  return await linkWithPopup(currentUser, provider)
}

/**
 * Twitterアカウントをリンク
 */
export const linkWithTwitter = async (): Promise<UserCredential> => {
  const currentUser = getAuthInstance().currentUser
  if (!currentUser) {
    throw new Error('No user is currently signed in')
  }
  const provider = new TwitterAuthProvider()
  return await linkWithPopup(currentUser, provider)
}

/**
 * サインアウト
 */
export const signOut = async (): Promise<void> => {
  await firebaseSignOut(getAuthInstance())
}

/**
 * 現在のユーザーを取得
 */
export const getCurrentUser = (): User | null => {
  return getAuthInstance().currentUser
}
