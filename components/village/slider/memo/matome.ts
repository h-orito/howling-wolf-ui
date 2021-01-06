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
  addLine(matomes: Matomes): Matomes {
    matomes.matomes.push({
      contents: matomes.chara_names.map(_ => '＿')
    })
    return matomes
  },
  removeLine(matomes: Matomes, index: number): Matomes {
    matomes.matomes.splice(index, 1)
    return matomes
  },
  toLeft(matomes: Matomes, index: number): Matomes {
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
    return matomes
  },
  toRight(matomes: Matomes, index: number): Matomes {
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
    return matomes
  },
  changeContent(
    matomes: Matomes,
    lineIndex: number,
    contentIndex: number,
    content: string
  ): Matomes {
    const matome = matomes.matomes[lineIndex]
    matome.contents.splice(contentIndex, 1, content)
    matomes.matomes.splice(lineIndex, 1, matome)
    return matomes
  },
  output(matomes: Matomes): string {
    const charas = matomes.chara_names.join('')
    const lines = matomes.matomes.map(line => line.contents.join('')).join('\n')
    return `${charas}\n${lines}`
  }
}

export default matome

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
