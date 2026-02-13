<template>
  <div
    v-if="allPageCount > 1"
    class="my-2 flex flex-wrap items-center justify-center gap-1 text-xs"
  >
    <!-- 最初のページ -->
    <button
      class="cursor-pointer rounded border border-gray-300 px-2 py-1"
      :class="
        currentPageNum <= 1
          ? 'cursor-not-allowed opacity-50'
          : 'hover:bg-gray-100'
      "
      :disabled="currentPageNum <= 1"
      @click="goToPage(1)"
    >
      &laquo;
    </button>

    <!-- ページ番号 -->
    <button
      v-for="page in displayPages"
      :key="page"
      class="cursor-pointer rounded border px-2 py-1"
      :class="
        page === currentPageNum
          ? 'border-blue-500 bg-blue-500 text-white'
          : 'border-gray-300 hover:bg-gray-100'
      "
      @click="goToPage(page)"
    >
      {{ page }}
    </button>

    <!-- 最新ページ -->
    <button
      class="cursor-pointer rounded border border-gray-300 px-2 py-1 hover:bg-gray-100"
      @click="goToLatest"
    >
      最新
    </button>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from '~/composables/village/useMessage'

const { messages, currentPageNum, setPageNum, setDispLatest } = useMessage()

const allPageCount = computed(() => messages.value?.all_page_count ?? 0)

const displayPages = computed(() => {
  const total = allPageCount.value
  const current = currentPageNum.value
  const pages: number[] = []
  const start = Math.max(1, current - 2)
  const end = Math.min(total, current + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const goToPage = (page: number) => {
  setPageNum(page)
}

const goToLatest = () => {
  setDispLatest(true)
}
</script>
