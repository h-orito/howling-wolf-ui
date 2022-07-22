import { Vue } from 'nuxt-property-decorator'
import { ToastProgrammatic as Toast } from 'buefy'

export default function({ store, $axios, app }) {
  $axios.onRequest(async config => {
    let token = app.$cookies.get('id-token')
    const user = store.state.auth.user
    if (token && user) {
      token = await refreshTokenIfNeeded(token, app, user)
      config.headers.common.Authorization = 'Bearer ' + token
      config.headers.common.Client = 'Client ' + getClientToken(app)
    }
    return config
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 404 && error.response.data.status === 499) {
      return // business errorは個別にハンドリングするので何もしない
    }
    Toast.open({
      type: 'is-danger',
      message: 'サーバとの接続でエラーが発生しました。',
      position: 'is-top',
      duration: 5000,
      queue: false
    })
  })
}

function getClientToken(app) {
  let token = localStorage.getItem('client-token')
  if (token) return token
  token = Math.random().toString(32).substring(2)
  localStorage.setItem('client-token', token)
  return token
}

async function refreshTokenIfNeeded(token, app, user) {
  const expired = new Date(app.$cookies.get('id-token-check-date'))
  if (new Date().getTime() < expired.getTime()) {
    // 有効期限内
    return token
  }
  return await user.getIdToken(true).then(newIdToken => {
    // save cookie
    app.$cookies.set('id-token', newIdToken, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })
    const now = new Date()
    const newExpired = now.setMinutes(now.getMinutes() + 50).toString()
    app.$cookies.set('id-token-check-date', newExpired, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })

    return newIdToken
  })
}
