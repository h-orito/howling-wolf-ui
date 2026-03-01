import type { InjectionKey } from 'vue'
import type { MessageView } from '~/lib/api/types'

/**
 * 発言入力欄へのアンカー挿入・秘話切替機能
 */

export interface SayInputContext {
  insertAnchor: (anchorString: string) => void
  switchToSecret: (targetParticipantId: number) => void
  setReplyTarget: (message: MessageView | null) => void
}

export interface SayInputRegisterContext {
  registerHandlers: (handlers: {
    insertAnchor: (anchor: string) => void
    switchToSecret: (targetId: number) => void
    setReplyTarget: (message: MessageView | null) => void
  }) => void
  unregisterHandlers: () => void
}

export const SAY_INPUT_KEY = Symbol() as InjectionKey<SayInputContext>
export const SAY_INPUT_REGISTER_KEY =
  Symbol() as InjectionKey<SayInputRegisterContext>

/**
 * 発言入力のProvider（village.vueで使用）
 */
export const useSayInputProvider = () => {
  const callbacks = ref<{
    insertAnchor?: (anchor: string) => void
    switchToSecret?: (targetId: number) => void
    setReplyTarget?: (message: MessageView | null) => void
  }>({})

  const registerHandlers = (handlers: {
    insertAnchor: (anchor: string) => void
    switchToSecret: (targetId: number) => void
    setReplyTarget: (message: MessageView | null) => void
  }) => {
    callbacks.value = handlers
  }

  const unregisterHandlers = () => {
    callbacks.value = {}
  }

  const insertAnchor = (anchorString: string) => {
    callbacks.value.insertAnchor?.(anchorString)
  }

  const switchToSecret = (targetParticipantId: number) => {
    callbacks.value.switchToSecret?.(targetParticipantId)
  }

  const setReplyTarget = (message: MessageView | null) => {
    callbacks.value.setReplyTarget?.(message)
  }

  provide(SAY_INPUT_KEY, { insertAnchor, switchToSecret, setReplyTarget })
  provide(SAY_INPUT_REGISTER_KEY, { registerHandlers, unregisterHandlers })
}

/**
 * 発言入力のConsumer（SayMessage.vueで使用）
 */
export const useSayInput = () => {
  return inject(SAY_INPUT_KEY)
}

/**
 * 発言入力のハンドラ登録（Say.vueで使用）
 */
export const useSayInputRegister = () => {
  return inject(SAY_INPUT_REGISTER_KEY)
}
