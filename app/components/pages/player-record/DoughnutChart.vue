<template>
  <div class="relative flex flex-col items-center">
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      class="-rotate-90 transform"
    >
      <!-- 背景の円 -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="noData ? '#ccc' : loseColor"
        :stroke-width="strokeWidth"
      />
      <!-- 勝利の円弧 -->
      <circle
        v-if="!noData && winCount > 0"
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="winColor"
        :stroke-width="strokeWidth"
        :stroke-dasharray="winDashArray"
        :stroke-dashoffset="0"
        stroke-linecap="round"
      />
    </svg>
    <!-- 中央のテキスト -->
    <div
      class="absolute inset-0 flex items-center justify-center"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
      <span class="text-sm font-medium text-gray-800">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  winCount: number
  loseCount: number
  label: string
  size?: number
  strokeWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 100,
  strokeWidth: 12
})

const winColor = 'rgb(86, 161, 229)'
const loseColor = 'rgb(237, 111, 133)'

const center = computed(() => props.size / 2)
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const total = computed(() => props.winCount + props.loseCount)
const noData = computed(() => total.value === 0)

const winRatio = computed(() => {
  if (total.value === 0) return 0
  return props.winCount / total.value
})

const winDashArray = computed(() => {
  const winLength = circumference.value * winRatio.value
  const gapLength = circumference.value - winLength
  return `${winLength} ${gapLength}`
})
</script>
