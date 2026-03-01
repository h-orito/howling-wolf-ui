<template>
  <div class="flex h-full items-stretch bg-[#363636]">
    <!-- 前日ボタン -->
    <UiButton
      color="secondary"
      variant="solid"
      icon="i-heroicons-chevron-left-20-solid"
      :disabled="!existPrevDay"
      class="flex min-w-15 cursor-pointer items-center justify-center rounded-none border-0 bg-[#363636] px-3 text-xs"
      aria-label="前日へ移動"
      @click="handlePrevDay"
    >
      前日
    </UiButton>

    <!-- 最上部スクロールボタン -->
    <UiButton
      color="secondary"
      variant="solid"
      icon="i-heroicons-arrow-up-20-solid"
      class="flex flex-1 cursor-pointer items-center justify-center rounded-none border-0 bg-[#363636]"
      aria-label="最上部にスクロール"
      @click="$emit('to-head')"
    />

    <!-- 翌日ボタン -->
    <UiButton
      color="secondary"
      variant="solid"
      icon="i-heroicons-chevron-right-20-solid"
      trailing
      :disabled="!existNextDay"
      class="flex min-w-15 cursor-pointer items-center justify-center rounded-none border-0 bg-[#363636] px-3 text-xs"
      aria-label="翌日へ移動"
      @click="handleNextDay"
    >
      翌日
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/button/index.vue'
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
