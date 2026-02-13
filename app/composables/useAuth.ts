import type { User, UserCredential } from 'firebase/auth'
import type { MyselfPlayerView } from '~/lib/api/types'
import * as firebaseAuth from '~/lib/firebase/auth'

/**
 * 認証操作を提供するComposable
 * ビジネスロジックと状態管理の橋渡しを担当
 */
export const useAuth = () => {
  const authStore = useAuthStore()
  const { apiCall } = useApi()

  /**
   * 認証状態の初期化
   */
  const initializeAuth = () => {
    firebaseAuth.onAuthStateChanged((firebaseUser) => {
      authStore.setUser(firebaseUser)
      authStore.setLoading(false)
    })
  }

  /**
   * Googleでサインイン
   */
  const signInWithGoogle = async (): Promise<UserCredential> => {
    return await firebaseAuth.signInWithGoogle()
  }

  /**
   * Twitterでサインイン
   */
  const signInWithTwitter = async (): Promise<UserCredential> => {
    return await firebaseAuth.signInWithTwitter()
  }

  /**
   * Googleアカウントをリンク
   */
  const linkWithGoogle = async (): Promise<UserCredential> => {
    return await firebaseAuth.linkWithGoogle()
  }

  /**
   * Twitterアカウントをリンク
   */
  const linkWithTwitter = async (): Promise<UserCredential> => {
    return await firebaseAuth.linkWithTwitter()
  }

  /**
   * ログアウト
   */
  const logout = async () => {
    await firebaseAuth.signOut()
    authStore.setUser(null)
    authStore.setMyselfPlayer(null)
  }

  /**
   * 認証状態の待機
   */
  const waitForAuth = (): Promise<User | null> => {
    return new Promise((resolve) => {
      const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
        unsubscribe()
        resolve(user)
      })
    })
  }

  /**
   * ユーザー登録処理（必要に応じて）
   */
  const registerUserIfNeeded = async (result: UserCredential) => {
    if (!result?.user) return

    const firebaseUser = result.user
    let twitterUsername: string | null = null

    // Twitter usernameを取得
    type FirebaseUserWithReloadInfo = typeof firebaseUser & {
      reloadUserInfo?: {
        providerUserInfo?: Array<{
          providerId: string
          screenName?: string
        }>
      }
    }
    const firebaseUserWithInfo = firebaseUser as FirebaseUserWithReloadInfo
    twitterUsername =
      firebaseUserWithInfo.reloadUserInfo?.providerUserInfo?.find(
        (providerUserInfo) => providerUserInfo.providerId === 'twitter.com'
      )?.screenName ?? null

    // APIでユーザー登録
    if (twitterUsername || firebaseUser.uid) {
      try {
        await apiCall('/player', {
          method: 'POST',
          body: {
            uid: firebaseUser.uid,
            twitter_user_name: twitterUsername
          }
        })
      } catch (error) {
        console.error('Failed to register user:', error)
      }
    }

    // トークンをCookieに保存
    const idToken = await firebaseUser.getIdToken(false)
    const idTokenCookie = useCookie('id-token', {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'strict'
    })
    idTokenCookie.value = idToken

    // 1時間で有効期限が切れるので50分後に再取得させる
    const checkDateCookie = useCookie('id-token-check-date', {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'strict'
    })
    const now = new Date()
    now.setMinutes(now.getMinutes() + 50)
    checkDateCookie.value = now.toISOString()
  }

  /**
   * 認証情報の更新（プレイヤー情報取得）
   */
  const refreshAuth = async () => {
    try {
      const myPlayer = await apiCall<MyselfPlayerView>('/my-player')
      authStore.setMyselfPlayer(myPlayer)
    } catch (error) {
      console.error('Failed to fetch player:', error)
    }
  }

  /**
   * 認証トークンの取得
   */
  const getAuthToken = async (): Promise<string | null> => {
    return authStore.getAuthToken()
  }

  return {
    // 状態（Storeから取得）
    user: computed(() => authStore.user),
    myselfPlayer: computed(() => authStore.myselfPlayer),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoading: computed(() => authStore.isLoading),

    // 操作
    initializeAuth,
    signInWithGoogle,
    signInWithTwitter,
    linkWithGoogle,
    linkWithTwitter,
    logout,
    waitForAuth,
    registerUserIfNeeded,
    refreshAuth,
    getAuthToken
  }
}
