/**
 * まとめ記号の型定義
 */
export type MatomeSymbol =
  | '＿'
  | '非'
  | '占'
  | '霊'
  | '狩'
  | '狼'
  | '狂'
  | '白'
  | '黒'
  | '偽'
  | '灰'

/**
 * まとめ記号一覧
 */
export const MATOME_SYMBOLS: readonly MatomeSymbol[] = [
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
] as const

/**
 * まとめの1行分のデータ
 */
export interface Matome {
  contents: string[]
}

/**
 * まとめ全体のデータ
 */
export interface Matomes {
  charaNames: string[]
  matomes: Matome[]
}

/**
 * 村まとめの管理(LocalStorage使用)
 */
export const useVillageMatome = () => {
  /**
   * LocalStorageキー名を生成
   */
  const getStorageKey = (villageId: number): string => {
    return `village-matome-${villageId}`
  }

  /**
   * まとめデータを取得
   */
  const getMatome = (villageId: number): Matomes | null => {
    const key = getStorageKey(villageId)
    const stored = localStorage.getItem(key)
    if (!stored) return null

    try {
      return JSON.parse(stored) as Matomes
    } catch {
      return null
    }
  }

  /**
   * まとめデータを保存
   */
  const saveMatome = (villageId: number, matomes: Matomes): void => {
    const key = getStorageKey(villageId)
    localStorage.setItem(key, JSON.stringify(matomes))
  }

  /**
   * まとめデータを初期化
   * 既存データがあればそれを返し、なければ新規作成して返す
   */
  const initializeMatome = (
    villageId: number,
    charaNames: string[]
  ): Matomes => {
    const existing = getMatome(villageId)
    if (existing) {
      return existing
    }

    const newMatomes: Matomes = {
      charaNames: [...charaNames],
      matomes: []
    }
    saveMatome(villageId, newMatomes)
    return newMatomes
  }

  /**
   * 行を追加
   */
  const addLine = (matomes: Matomes): Matomes => {
    const newLine: Matome = {
      contents: matomes.charaNames.map(() => '＿')
    }
    return {
      ...matomes,
      matomes: [...matomes.matomes, newLine]
    }
  }

  /**
   * 行を削除
   */
  const removeLine = (matomes: Matomes, lineIndex: number): Matomes => {
    return {
      ...matomes,
      matomes: matomes.matomes.filter((_, index) => index !== lineIndex)
    }
  }

  /**
   * 列を左に移動
   */
  const toLeft = (matomes: Matomes, index: number): Matomes => {
    if (index <= 0 || index >= matomes.charaNames.length) {
      return matomes
    }

    const newCharaNames = matomes.charaNames.map((name, i) => {
      if (i === index - 1) return matomes.charaNames[index] ?? name
      if (i === index) return matomes.charaNames[index - 1] ?? name
      return name
    })

    const newMatomes = matomes.matomes.map((matome) => {
      const newContents = matome.contents.map((content, i) => {
        if (i === index - 1) return matome.contents[index] ?? content
        if (i === index) return matome.contents[index - 1] ?? content
        return content
      })
      return { contents: newContents }
    })

    return {
      charaNames: newCharaNames,
      matomes: newMatomes
    }
  }

  /**
   * 列を右に移動
   */
  const toRight = (matomes: Matomes, index: number): Matomes => {
    if (index < 0 || index >= matomes.charaNames.length - 1) {
      return matomes
    }

    const newCharaNames = matomes.charaNames.map((name, i) => {
      if (i === index) return matomes.charaNames[index + 1] ?? name
      if (i === index + 1) return matomes.charaNames[index] ?? name
      return name
    })

    const newMatomes = matomes.matomes.map((matome) => {
      const newContents = matome.contents.map((content, i) => {
        if (i === index) return matome.contents[index + 1] ?? content
        if (i === index + 1) return matome.contents[index] ?? content
        return content
      })
      return { contents: newContents }
    })

    return {
      charaNames: newCharaNames,
      matomes: newMatomes
    }
  }

  /**
   * セル内容を変更
   */
  const changeContent = (
    matomes: Matomes,
    lineIndex: number,
    contentIndex: number,
    content: string
  ): Matomes => {
    const newMatomes = matomes.matomes.map((matome, mIndex) => {
      if (mIndex !== lineIndex) {
        return matome
      }
      const newContents = [...matome.contents]
      newContents[contentIndex] = content
      return { contents: newContents }
    })

    return {
      ...matomes,
      matomes: newMatomes
    }
  }

  /**
   * テキスト形式で出力
   */
  const outputText = (matomes: Matomes): string => {
    const header = matomes.charaNames.join('')
    const lines = matomes.matomes
      .map((line) => line.contents.join(''))
      .join('\n')
    return lines ? `${header}\n${lines}` : header
  }

  return {
    getMatome,
    saveMatome,
    initializeMatome,
    addLine,
    removeLine,
    toLeft,
    toRight,
    changeContent,
    outputText
  }
}
