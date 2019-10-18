import { Vue } from 'vue-property-decorator'
import { SnackbarProgrammatic as Snackbar } from 'buefy'

export default function({ $axios, app }) {
  $axios.onRequest(config => {
    const token = app.$cookies.get('id-token')
    if (token) {
      config.headers.common['Authorization'] = 'Bearer ' + token
    }
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      // validation errorは個別にハンドリングするので何もしない
      return
    }
    // todo 業務エラーも何もしないようにする
    Snackbar.open({
      type: 'is-danger',
      message: 'サーバとの接続でエラーが発生しました。',
      position: 'is-top-right',
      duration: 5000,
      queue: false,
      actionText: '',
      onAction: () => {}
    })
  })
}
