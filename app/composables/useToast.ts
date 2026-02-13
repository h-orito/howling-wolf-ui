/**
 * トースト通知を管理するcomposable
 */

export interface ToastItem {
  id: number
  message: string
  type: 'info' | 'success' | 'error'
  duration: number
}

const toasts = ref<ToastItem[]>([])
let toastId = 0

export const useToast = () => {
  const add = (options: {
    message: string
    type?: 'info' | 'success' | 'error'
    duration?: number
  }) => {
    const id = ++toastId
    const toast: ToastItem = {
      id,
      message: options.message,
      type: options.type ?? 'info',
      duration: options.duration ?? 3000
    }

    toasts.value.push(toast)

    // 自動で削除
    setTimeout(() => {
      remove(id)
    }, toast.duration)

    return id
  }

  const remove = (id: number) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clear = () => {
    toasts.value = []
  }

  return {
    toasts: readonly(toasts),
    add,
    remove,
    clear
  }
}
