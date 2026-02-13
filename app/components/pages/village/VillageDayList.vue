<template>
  <div v-if="village" class="my-2 flex flex-wrap gap-1 text-xs">
    <button
      v-for="day in village.day.day_list"
      :key="day.id"
      class="cursor-pointer rounded border px-2 py-1"
      :class="
        day.id === currentVillageDay?.id
          ? 'border-blue-500 bg-blue-500 text-white'
          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
      "
      @click="handleDayChange(day)"
    >
      {{ dayLabel(day) }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { VillageDayView } from '~/lib/api/types'
import { useVillage } from '~/composables/village/useVillage'
import { useMessage } from '~/composables/village/useMessage'

const { village, currentVillageDay, changeCurrentVillageDay, latestDay } =
  useVillage()
const { resetPaging } = useMessage()

const dayLabel = (day: VillageDayView): string => {
  if (day.day === 0) return 'プロローグ'
  return `${day.day}日目`
}

const handleDayChange = (day: VillageDayView) => {
  changeCurrentVillageDay(day)
  const isLatest = day.id === latestDay.value?.id
  resetPaging(isLatest)
}
</script>
