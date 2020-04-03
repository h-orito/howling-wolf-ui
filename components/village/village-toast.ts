import { Vue } from 'nuxt-property-decorator'

const toast = {
  info(app: Vue, message: string): void {
    this.toast(app, 'info', message)
  },
  success(app: Vue, message: string): void {
    this.toast(app, 'success', message)
  },
  danger(app: Vue, message: string): void {
    this.toast(app, 'danger', message)
  },
  toast(app: Vue, type: string, message: string): void {
    app.$buefy.toast.open({
      message,
      type: 'is-' + type,
      position: 'is-top'
    })
  }
}

export default toast
