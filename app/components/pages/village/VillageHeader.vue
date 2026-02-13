<template>
  <div class="flex h-full items-stretch bg-[#363636]">
    <button
      class="flex min-w-[60px] cursor-pointer items-center justify-center border-0 px-3 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!existPrevDay"
      @click="handlePrevDay"
    >
      &lt; 前日
    </button>
    <button
      class="flex flex-1 cursor-pointer items-center justify-center border-0 border-t border-white text-white"
      @click="$emit('to-head')"
    >
      <span class="text-xs">&#x25B2;</span>
    </button>
    <button
      class="flex min-w-[60px] cursor-pointer items-center justify-center border-0 px-3 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!existNextDay"
      @click="handleNextDay"
    >
      翌日 &gt;
    </button>
  </div>
</template>

<script setup lang="ts">
import { useVillage } from '~/composables/village/useVillage'
import { useMessage } from '~/composables/village/useMessage'

defineEmits<{
  'to-head': []
}>()

const { existPrevDay, existNextDay, toPrevDay, toNextDay, latestDay } =
  useVillage()
const { resetPaging } = useMessage()

const handlePrevDay = () => {
  toPrevDay()
  resetPaging(false)
}

const handleNextDay = () => {
  toNextDay()
  const { currentVillageDay } = useVillage()
  const isLatest = currentVillageDay.value?.id === latestDay.value?.id
  resetPaging(isLatest)
}
</script>
