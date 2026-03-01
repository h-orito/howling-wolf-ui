/**
 * 村ページ内のスクロール処理
 */
export const useVillageNavigation = () => {
  // スクロールアニメーションの所要時間（ミリ秒）
  const SCROLL_DURATION = 200

  /**
   * カスタムスムーズスクロール（高速版）
   */
  const smoothScroll = (
    container: Element,
    targetTop: number,
    duration: number
  ) => {
    const startTop = container.scrollTop
    const distance = targetTop - startTop
    const startTime = performance.now()

    const easeOutQuad = (t: number) => t * (2 - t)

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutQuad(progress)

      container.scrollTop = startTop + distance * eased

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }

  /**
   * コンテナ内で要素にスクロール（要素が画面上部に来る）
   */
  const scrollInContainer = (container: HTMLElement, target: HTMLElement) => {
    const containerRect = container.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()

    // コンテナの現在のスクロール位置 + ターゲットの相対位置
    const scrollTop = container.scrollTop + (targetRect.top - containerRect.top)

    smoothScroll(container, scrollTop, SCROLL_DURATION)
  }

  /**
   * ページ最上部にスクロール
   */
  const scrollToTop = (
    containerSelector: string = '#village-article-wrapper'
  ) => {
    const container = document.querySelector(containerSelector)
    if (!container) return

    smoothScroll(container, 0, SCROLL_DURATION)
  }

  /**
   * ページ最下部にスクロール
   */
  const scrollToBottom = (
    containerSelector: string = '#village-article-wrapper'
  ) => {
    const container = document.querySelector(containerSelector)
    if (!container) return

    const element = document.getElementById('message-bottom')
    if (!element) {
      // message-bottomが見つからない場合はコンテナの最下部へ
      smoothScroll(container, container.scrollHeight, SCROLL_DURATION)
      return
    }

    // message-bottomが画面下部に来るようにスクロール
    const containerRect = container.getBoundingClientRect()
    const targetRect = element.getBoundingClientRect()
    const scrollTop =
      container.scrollTop + (targetRect.bottom - containerRect.bottom)

    smoothScroll(container, scrollTop, SCROLL_DURATION)
  }

  /**
   * 特定の要素にスクロール
   */
  const scrollToElement = (
    elementId: string,
    containerSelector: string = '#village-article-wrapper'
  ) => {
    const container = document.querySelector(containerSelector)
    if (!container) return

    const element = document.getElementById(elementId)
    if (!element) return

    scrollInContainer(container as HTMLElement, element)
  }

  return {
    scrollToTop,
    scrollToBottom,
    scrollToElement
  }
}
