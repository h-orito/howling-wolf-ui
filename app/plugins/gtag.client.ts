/**
 * Google Analytics 4 (gtag.js) プラグイン
 * 本番環境でのみ有効
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const measurementId = config.public.gaMeasurementId

  if (!measurementId || process.env.NODE_ENV !== 'production') {
    return
  }

  // gtag.js スクリプトを読み込み
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  // gtag 初期化
  window.dataLayer = window.dataLayer || []
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }
  gtag('js', new Date())
  gtag('config', measurementId)

  // ページ遷移のトラッキング
  const router = useRouter()
  router.afterEach((to) => {
    gtag('event', 'page_view', {
      page_path: to.fullPath
    })
  })
})

// グローバル型定義
declare global {
  interface Window {
    dataLayer: unknown[]
  }
}
