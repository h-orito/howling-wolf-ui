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
  },
  getActionWindow(app: Vue): ActionWindowSettings {
    const cookie = this.getCookie(app)
    if (cookie.action_window) return cookie.action_window
    this.setActionWindow(app, DEFAULT_ACTION_WINDOW)
    return DEFAULT_ACTION_WINDOW
  },
  setActionWindow(app: Vue, settings: ActionWindowSettings): void {
    const cookie = this.getCookie(app)
    cookie.action_window = settings
    this.setCookie(app, cookie)
  },
  getMessageDisplay(app: Vue): MessageDisplaySettings {
    const cookie = this.getCookie(app)
    if (cookie.message_display) return cookie.message_display
    this.setMessageDisplay(app, DEFAULT_MESSAGE_DISPLAY)
    return DEFAULT_MESSAGE_DISPLAY
  },
  setMessageDisplay(app: Vue, settings: MessageDisplaySettings): void {
    const cookie = this.getCookie(app)
    cookie.message_display = settings
    this.setCookie(app, cookie)
  },
  getTheme(app: Vue): ThemeSettings {
    const cookie = this.getCookie(app)
    if (cookie.theme) return cookie.theme
    this.setTheme(app, DEFAULT_THEME)
    return DEFAULT_THEME
  },
  setTheme(app: Vue, settings: ThemeSettings): void {
    const cookie = this.getCookie(app)
    cookie.theme = settings
    this.setCookie(app, cookie)
  },
  getOperation(app: Vue): OperationSettings {
    const cookie = this.getCookie(app)
    if (cookie.operation) return cookie.operation
    this.setOperation(app, DEFAULT_OPERATION)
    return DEFAULT_OPERATION
  },
  setOperation(app: Vue, settings: OperationSettings): void {
    const cookie = this.getCookie(app)
    cookie.operation = settings
    this.setCookie(app, cookie)
  }
}

export default villageUserSettings

export interface VillageUserSettings {
  paging: PagingSettings
  action_window?: ActionWindowSettings
  message_display?: MessageDisplaySettings
  theme?: ThemeSettings
  operation?: OperationSettings
}

export interface PagingSettings {
  is_paging: boolean
  message_per_page: number
}

export interface ActionWindowSettings {
  size: number
  tab_code: string
}

export interface MessageDisplaySettings {
  is_disp_date: boolean
  is_char_large: boolean
  is_img_large: boolean
}

export interface ThemeSettings {
  is_dark: boolean
}

export interface OperationSettings {
  is_open_filter_newtab: boolean
  is_paste_anchor: boolean
}

const DEFAULT_PAGING: PagingSettings = {
  is_paging: true,
  message_per_page: 50
}

const DEFAULT_ACTION_WINDOW: ActionWindowSettings = {
  size: 1,
  tab_code: 'myself'
}

const DEFAULT_MESSAGE_DISPLAY: MessageDisplaySettings = {
  is_disp_date: false,
  is_char_large: false,
  is_img_large: false
}

const DEFAULT_THEME: ThemeSettings = {
  is_dark: false
}

const DEFAULT_OPERATION: OperationSettings = {
  is_open_filter_newtab: false,
  is_paste_anchor: false
}

const DEFAULT_SETTINGS: VillageUserSettings = {
  paging: DEFAULT_PAGING,
  action_window: DEFAULT_ACTION_WINDOW,
  message_display: DEFAULT_MESSAGE_DISPLAY,
  theme: DEFAULT_THEME,
  operation: DEFAULT_OPERATION
}
