import { defineStore } from 'pinia'
import type { User } from 'firebase/auth'
import type { MyselfPlayerView } from '~/lib/api/types'

/**
 * 認証状態管理Store
 * 状態の保持と更新のみを担当
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const myselfPlayer = ref<MyselfPlayerView | null>(null)
  const isLoading = ref(true)

  // Computed
  const isAuthenticated = computed(() => !!user.value)

  // Mutations（状態更新メソッド）
  const setUser = (newUser: User | null) => {
    user.value = newUser
  }

  const setMyselfPlayer = (player: MyselfPlayerView | null) => {
    myselfPlayer.value = player
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  // 認証トークンの取得
  const getAuthToken = async (): Promise<string | null> => {
    const tokenCookie = useCookie<string | null>('id-token', {
      default: () => null,
      maxAge: 60 * 60 * 24 * 30, // 30日
      sameSite: 'strict',
      secure: import.meta.env.PROD
    })
    const checkDateCookie = useCookie<string | null>('id-token-check-date', {
      default: () => null,
      maxAge: 60 * 60 * 24 * 30, // 30日
      sameSite: 'strict',
      secure: import.meta.env.PROD
    })

    let token = tokenCookie.value
    const currentUser = user.value

    if (!token || !currentUser) {
      return null
    }

    // 有効期限チェック
    const expired = checkDateCookie.value
      ? new Date(checkDateCookie.value)
      : new Date(0)
    if (new Date().getTime() >= expired.getTime()) {
      // 期限切れの場合は更新
      try {
        token = await currentUser.getIdToken(true)

        // Cookieに保存
        tokenCookie.value = token

        // 50分後に期限切れとして設定
        const now = new Date()
        const newExpired = new Date(
          now.getTime() + 50 * 60 * 1000
        ).toISOString()
        checkDateCookie.value = newExpired
      } catch (error) {
        console.error('Failed to refresh token:', error)
        return null
      }
    }

    return token
  }

  return {
    // State
    user,
    myselfPlayer,
    isAuthenticated,
    isLoading,

    // Mutations
    setUser,
    setMyselfPlayer,
    setLoading,

    // Token管理（API呼び出しで使用）
    getAuthToken
  }
})
