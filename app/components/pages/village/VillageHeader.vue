<template>
  <div class="flex h-full items-stretch bg-[#363636]">
    <!-- 前日ボタン -->
    <button
      class="flex min-w-[60px] cursor-pointer items-center justify-center border-0 px-3 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!existPrevDay"
      @click="handlePrevDay"
    >
      <Icon name="i-heroicons-chevron-left-20-solid" class="mr-0.5 h-4 w-4" />
      前日
    </button>

    <!-- 最上部スクロールボタン -->
    <button
      class="flex flex-1 cursor-pointer items-center justify-center border-0 text-white"
      @click="$emit('to-head')"
    >
      <Icon name="i-heroicons-arrow-up-20-solid" class="h-4 w-4" />
    </button>

    <!-- 翌日ボタン -->
    <button
      class="flex min-w-[60px] cursor-pointer items-center justify-center border-0 px-3 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!existNextDay"
      @click="handleNextDay"
    >
      翌日
      <Icon name="i-heroicons-chevron-right-20-solid" class="ml-0.5 h-4 w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import Icon from '~/components/ui/icon/Icon.vue'
import { useVillage } from '~/composables/village/useVillage'
import { useMessage } from '~/composables/village/useMessage'
import { useVillageNavigation } from '~/composables/village/useVillageNavigation'

defineEmits<{
  'to-head': []
}>()

const {
  existPrevDay,
  existNextDay,
  toPrevDay,
  toNextDay,
  nextDayId,
  latestDay
} = useVillage()
const { resetPaging } = useMessage()
const { scrollToTop } = useVillageNavigation()

const handlePrevDay = () => {
  toPrevDay()
  resetPaging(false)
  scrollToTop()
}

const handleNextDay = () => {
  const isLatest = nextDayId.value === latestDay.value?.id
  toNextDay()
  resetPaging(isLatest)
  scrollToTop()
}
</script>
