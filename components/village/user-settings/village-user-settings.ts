import { Vue } from 'nuxt-property-decorator'
import cookies from 'cookie-universal-nuxt'

const COOKIE_NAME = 'village-user-settings'
const COOKIE_OPTIONS = {
  path: '/',
  maxAge: 60 * 60 * 24 * 365 // 一年
}

const villageUserSettings = {
  createCookieIfNeeded(app: Vue): void {
    const cookie = this.getCookie(app)
    if (!cookie) this.setCookie(app, DEFAULT_SETTINGS)
  },
  getCookie(app: Vue): VillageUserSettings {
    return app.$cookies.get(COOKIE_NAME)
  },
  setCookie(app: Vue, cookie: VillageUserSettings): void {
    app.$cookies.set(COOKIE_NAME, cookie, COOKIE_OPTIONS)
  },
  getPaging(app: Vue): PagingSettings {
    return this.getCookie(app).paging
  },
  setPaging(app: Vue, settings: PagingSettings): void {
    const cookie = this.getCookie(app)
    cookie.paging = settings
    this.setCookie(app, cookie)
  }
}

export default villageUserSettings

export interface VillageUserSettings {
  paging: PagingSettings
}

export interface PagingSettings {
  is_paging: boolean
  message_per_page: number
}

const DEFAULT_PAGING: PagingSettings = {
  is_paging: true,
  message_per_page: 50
}

const DEFAULT_SETTINGS: VillageUserSettings = {
  paging: DEFAULT_PAGING
}
