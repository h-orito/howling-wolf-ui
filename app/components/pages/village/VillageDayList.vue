<template>
  <ul
    class="mx-auto my-2 flex max-w-160 flex-wrap gap-1 px-1.5 text-left text-xs"
  >
    <li v-for="(day, idx) in dayList" :key="day.id" class="inline">
      <span v-if="idx !== 0" class="text-gray-400"> &gt; </span>
      <a
        v-if="day.id !== currentDayId"
        href="javascript:void(0);"
        class="text-blue-600 hover:underline"
        @click="handleDayChange(day)"
      >
        {{ dayName(day) }}
      </a>
      <span v-else>{{ dayName(day) }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { VillageDayView } from '~/lib/api/types'
import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'
import { useVillage } from '~/composables/village/useVillage'
import { useMessage } from '~/composables/village/useMessage'
import { useVillageNavigation } from '~/composables/village/useVillageNavigation'

const {
  village,
  latestDay,
  currentVillageDay,
  changeCurrentVillageDay,
  isCurrentVillageDayLatest
} = useVillage()
const { resetPaging } = useMessage()
const { scrollToTop } = useVillageNavigation()

const dayList = computed(() => village.value?.day.day_list ?? [])

const currentDayId = computed(() => currentVillageDay.value?.id ?? null)

const dayName = (day: VillageDayView): string => {
  const status = village.value?.status.code

  // 終了済み: 最終日は「終了」、その前は「エピローグ」
  if (status === VILLAGE_STATUS.COMPLETED) {
    if (latestDay.value?.id === day.id) return '終了'
    if (dayList.value.slice(-2)[0]?.id === day.id) return 'エピローグ'
  }

  // エピローグ中: 最終日は「エピローグ」
  if (status === VILLAGE_STATUS.EPILOGUE && latestDay.value?.id === day.id) {
    return 'エピローグ'
  }

  // 通常: 0日目は「プロローグ」、それ以外は「N日目」
  return day.day === 0 ? 'プロローグ' : `${day.day}日目`
}

const handleDayChange = (villageDay: VillageDayView) => {
  changeCurrentVillageDay(villageDay)
  resetPaging(isCurrentVillageDayLatest.value)
  scrollToTop()
}
</script>
