<template>
  <div class="flex h-full items-stretch bg-[#363636] text-xs">
    <!-- モバイル: メニューボタン -->
    <button
      v-if="isMobile"
      class="flex min-w-[60px] cursor-pointer items-center justify-center border-0 border-r border-[#555] text-white"
      @click="toggleSlider"
    >
      <span class="text-base">&#x2630;</span>
    </button>

    <!-- 更新ボタン -->
    <button
      class="flex cursor-pointer items-center justify-center border-0 border-r border-[#555] text-white"
      :class="isMobile ? 'min-w-[60px]' : 'w-[120px]'"
      @click="handleRefresh"
    >
      <span
        :class="[existsNewMessages ? 'text-blue-400' : 'text-white']"
        class="text-base"
      >
        &#x21BB;
      </span>
    </button>

    <!-- 下部スクロールボタン -->
    <button
      class="flex flex-1 cursor-pointer items-center justify-center border-0 border-b border-white text-white"
      @click="$emit('to-bottom')"
    >
      <span class="text-xs">&#x25BC;</span>
    </button>

    <!-- フィルタボタン -->
    <button
      class="flex cursor-pointer items-center justify-center border-0 border-l border-[#555]"
      :class="[
        isMobile ? 'min-w-[60px]' : 'w-[120px]',
        isFiltering ? 'text-blue-400' : 'text-white'
      ]"
      @click="handleFilterClick"
    >
      <span class="text-base">&#x1F50D;</span>
      <span v-if="isFiltering" class="ml-1 text-blue-400">解除</span>
    </button>

    <!-- タイマー -->
    <div
      class="flex w-[80px] items-center justify-center border-l border-[#555] text-white"
    >
      {{ timerText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVillageRefresh } from '~/composables/village/useVillageRefresh'
import { useVillageTimer } from '~/composables/village/useVillageTimer'
import { useVillageMessageFilter } from '~/composables/village/useVillageMessageFilter'
import { useVillageSlider } from '~/composables/village/useVillageSlider'
import { useMessage } from '~/composables/village/useMessage'
import { useWindowResize } from '~/composables/useWindowResize'

defineEmits<{
  'to-bottom': []
}>()

const { refresh } = useVillageRefresh()
const { timerText, startTimer } = useVillageTimer()
const { isFiltering } = useVillageMessageFilter()
const { resetFilter, loadMessages } = useMessage()
const { toggle: toggleSlider } = useVillageSlider()
const { isMobile } = useWindowResize()

const villageStore = useVillageStore()
const existsNewMessages = computed(() => villageStore.existsNewMessages)

const handleRefresh = async () => {
  await refresh()
}

const handleFilterClick = () => {
  if (isFiltering.value) {
    resetFilter()
    loadMessages()
  } else {
    // TODO: フィルタモーダルを開く
  }
}

onMounted(() => {
  startTimer()
})
</script>
