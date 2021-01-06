import { Vue } from 'nuxt-property-decorator'
import cookies from 'cookie-universal-nuxt'
import Village from '~/components/type/village'

const COOKIE_OPTIONS = {
  path: '/',
  maxAge: 60 * 60 * 24 * 30 // 1ヶ月
}

const matome = {
  createCookieIfNeeded(app: Vue, village: Village): void {
    const cookie = this.getCookie(app, village)
    if (!cookie) this.setCookie(app, village, createDefaultMatomes(village))
  },
  getCookie(app: Vue, village: Village): Matomes {
    return app.$cookies.get(getCookieName(village.id))
  },
  setCookie(app: Vue, village: Village, cookie: Matomes): void {
    app.$cookies.set(getCookieName(village.id), cookie, COOKIE_OPTIONS)
  },
  addLine(app: Vue, village: Village): void {
    const matomes = this.getCookie(app, village)
    matomes.matomes.push({
      contents: matomes.chara_names.map(_ => '＿')
    })
    this.setCookie(app, village, matomes)
  },
  removeLine(app: Vue, village: Village, index: number): void {
    const matomes = this.getCookie(app, village)
    matomes.matomes.splice(index, 1)
    this.setCookie(app, village, matomes)
  },
  toLeft(app: Vue, village: Village, index: number): void {
    const matomes = this.getCookie(app, village)
    matomes.chara_names.splice(
      index - 1,
      2,
      matomes.chara_names[index],
      matomes.chara_names[index - 1]
    )
    matomes.matomes.forEach(matome => {
      matome.contents.splice(
        index - 1,
        2,
        matome.contents[index],
        matome.contents[index - 1]
      )
    })
    this.setCookie(app, village, matomes)
  },
  toRight(app: Vue, village: Village, index: number): void {
    const matomes = this.getCookie(app, village)
    matomes.chara_names.splice(
      index,
      2,
      matomes.chara_names[index + 1],
      matomes.chara_names[index]
    )
    matomes.matomes.forEach(matome => {
      matome.contents.splice(
        index,
        2,
        matome.contents[index + 1],
        matome.contents[index]
      )
    })
    this.setCookie(app, village, matomes)
  },
  changeContent(
    app: Vue,
    village: Village,
    lineIndex: number,
    contentIndex: number
  ): void {
    const matomes = this.getCookie(app, village)
    const current: string = matomes.matomes[lineIndex].contents[contentIndex]
    const currentIndex = contents.indexOf(current)
    if (currentIndex === contents.length - 1) {
      matomes.matomes[lineIndex].contents[contentIndex] = contents[0]
    } else {
      matomes.matomes[lineIndex].contents[contentIndex] =
        contents[currentIndex + 1]
    }
    this.setCookie(app, village, matomes)
  },
  output(app: Vue, village: Village): string {
    const matomes = this.getCookie(app, village)
    const charas = matomes.chara_names.join('')
    const lines = matomes.matomes.map(line => line.contents.join('')).join('\n')
    return `${charas}\n${lines}`
  }
}

export default matome

const contents: string[] = [
  '＿',
  '非',
  '占',
  '霊',
  '狩',
  '狼',
  '狂',
  '白',
  '黒',
  '偽',
  '灰'
]

export interface Matomes {
  chara_names: string[]
  matomes: Matome[]
}

interface Matome {
  contents: string[]
}

const createDefaultMatomes = (village: Village): Matomes => {
  const matomes: Matomes = {
    chara_names: village.participant.member_list.map(
      m => m.chara.chara_name.short_name
    ),
    matomes: []
  }
  return matomes
}

const getCookieName = (villageId: number): string => {
  const vid = 'v' + ('0000' + villageId.toString()).slice(-4)
  return `village-memo-matome-${vid}`
}
