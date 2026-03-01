export default defineNuxtRouteMiddleware(async (to) => {
  // サーバーサイドでは認証チェックをスキップ（Firebaseはクライアントのみ）
  if (import.meta.server) {
    return
  }

  const auth = useAuth()

  // 認証が必要なルートのパスを定義
  const authRequiredPaths = ['/create-village']

  // 現在のパスが認証必要なパスかチェック
  const requiresAuth = authRequiredPaths.some((path) =>
    to.path.startsWith(path)
  )

  // 認証が必要なページの場合のみ、認証状態の確定を待つ
  if (requiresAuth) {
    // Firebase認証の初期化完了を待つ
    await auth.waitForAuth()

    // 認証されていない場合はトップページへリダイレクト
    if (!auth.isAuthenticated.value) {
      return navigateTo('/')
    }
  }
})
