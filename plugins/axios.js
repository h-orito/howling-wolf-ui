import { Vue } from 'vue-property-decorator'

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
    Vue.prototype.$snackbar.open({
      duration: 5000,
      message: 'サーバとの接続でエラーが発生しました。',
      type: 'is-danger',
      position: 'is-top-right',
      actionText: '',
      queue: false,
      onAction: () => {}
    })
  })
}
