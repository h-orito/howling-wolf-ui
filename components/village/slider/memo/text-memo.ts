import { Vue } from 'nuxt-property-decorator'
import cookies from 'cookie-universal-nuxt'

const COOKIE_OPTIONS = {
  path: '/',
  maxAge: 60 * 60 * 24 * 30 // 1ヶ月
}

const textMemo = {
  createCookieIfNeeded(app: Vue, villageId: number, memoNumber: number): void {
    const cookie = this.getCookie(app, villageId, memoNumber)
    if (!cookie) this.setCookie(app, villageId, memoNumber, encodeText(''))
  },
  getCookie(app: Vue, villageId: number, memoNumber: number): string {
    const encodedText = app.$cookies.get(getCookieName(villageId, memoNumber))
    return encodedText ? decodeText(encodedText) : ''
  },
  setCookie(
    app: Vue,
    villageId: number,
    memoNumber: number,
    text: string
  ): void {
    app.$cookies.set(
      getCookieName(villageId, memoNumber),
      encodeText(text),
      COOKIE_OPTIONS
    )
  }
}

export default textMemo

const getCookieName = (villageId: number, memoNumber: number): string => {
  const vid = 'v' + ('0000' + villageId.toString()).slice(-4)
  return `village-memo-text-${memoNumber}-${vid}`
}

// base64 encode
const encodeText = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)))
}

// base64 decode
const decodeText = (str: string): string => {
  return decodeURIComponent(escape(atob(str)))
}
