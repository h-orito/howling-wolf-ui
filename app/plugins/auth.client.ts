export default defineNuxtPlugin(() => {
  const auth = useAuth()

  // クライアントサイドでのみ認証状態を初期化
  auth.initializeAuth()
})
