import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'
import { useVillage } from './useVillage'

/**
 * 村タイマーの管理(残り時間の計算・表示)
 */
export const useVillageTimer = () => {
  const timerText = ref<string>('')
  const timerInterval = ref<ReturnType<typeof setInterval> | null>(null)

  const { village } = useVillage()

  onUnmounted(() => {
    stopTimer()
  })

  const startTimer = () => {
    stopTimer()
    updateTimer()

    const statusCode = village.value?.status.code
    if (
      statusCode === VILLAGE_STATUS.COMPLETED ||
      statusCode === VILLAGE_STATUS.CANCEL
    ) {
      return
    }

    timerInterval.value = setInterval(() => {
      updateTimer()
    }, 1000)
  }

  const stopTimer = () => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
  }

  const padZero = (num: number): string => String(num).padStart(2, '0')

  const updateTimer = () => {
    if (!village.value) {
      timerText.value = ''
      return
    }

    const statusCode = village.value.status.code

    if (statusCode === VILLAGE_STATUS.COMPLETED) {
      timerText.value = '終了'
      stopTimer()
      return
    } else if (statusCode === VILLAGE_STATUS.CANCEL) {
      timerText.value = '廃村'
      stopTimer()
      return
    }

    const nextDaychangeDatetime = getNextDaychangeDatetime()
    if (!nextDaychangeDatetime) {
      timerText.value = ''
      return
    }

    const left = nextDaychangeDatetime.getTime() - new Date().getTime()
    const hour = Math.floor(left / 3600000)
    const minute = Math.floor((left - 3600000 * hour) / 60000)
    const second = Math.floor((left % 60000) / 1000)

    if (left < 0) {
      timerText.value = '残00:00:00'
    } else if (hour > 99) {
      timerText.value = '残99:59:59'
    } else {
      timerText.value = `残${padZero(hour)}:${padZero(minute)}:${padZero(second)}`
    }
  }

  const getNextDaychangeDatetime = (): Date | null => {
    if (!village.value) return null
    const dayList = village.value.day.day_list
    if (!dayList || dayList.length === 0) return null
    const lastDay = dayList[dayList.length - 1]
    if (!lastDay) return null
    const s = lastDay.day_change_datetime
    if (!s) return null

    return new Date(
      parseInt(s.substring(0, 4)),
      parseInt(s.substring(5, 7)) - 1,
      parseInt(s.substring(8, 10)),
      parseInt(s.substring(11, 13)),
      parseInt(s.substring(14, 16)),
      parseInt(s.substring(17, 19))
    )
  }

  return {
    timerText: readonly(timerText),
    startTimer,
    stopTimer,
    updateTimer
  }
}
