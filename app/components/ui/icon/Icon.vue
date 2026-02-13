<template>
  <!-- heroicons コンポーネント -->
  <component
    :is="heroIconComponent"
    v-if="heroIconComponent"
    :class="iconClass"
  />
  <!-- SVG アイコン -->
  <svg
    v-else-if="svgIcon"
    :viewBox="svgIcon.viewBox"
    :class="[iconClass, { 'animate-spin': isSpinner }]"
    fill="currentColor"
    aria-hidden="true"
  >
    <path v-for="(path, index) in svgIcon.paths" :key="index" :d="path" />
  </svg>
  <!-- フォールバック -->
  <span v-else :class="iconClass" />
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { heroiconsMap } from './heroicons'
import { svgIconsMap, type SvgIconDefinition } from './svg-icons'

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  name: string
  size?: IconSize
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  class: undefined
})

const sizeClasses: Record<IconSize, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8'
}

// アイコン名を正規化して実際のキーを取得
const normalizedIconName = computed((): string => {
  const name = props.name
  if (name.includes(':')) {
    return name.split(':')[1] ?? name
  }
  return name
})

// heroiconsコンポーネントを取得
const heroIconComponent = computed((): Component | undefined => {
  if (props.name.startsWith('i-heroicons-')) {
    return heroiconsMap[props.name]
  }
  return undefined
})

// SVGアイコン定義を取得
const svgIcon = computed((): SvgIconDefinition | undefined => {
  if (!props.name.startsWith('i-heroicons-')) {
    const iconName = normalizedIconName.value
    const icon = svgIconsMap[iconName]
    if (!icon) {
      console.warn(`[Icon] Unknown icon name: ${props.name}`)
    }
    return icon
  }
  return undefined
})

// spinnerアイコンかどうか
const isSpinner = computed(() => normalizedIconName.value === 'spinner')

const iconClass = computed(() => {
  const classes: string[] = []

  const customClass = props.class
  if (!customClass || !customClass.match(/[hw]-\d/)) {
    const size: IconSize = props.size ?? 'md'
    classes.push(sizeClasses[size])
  }

  if (customClass) {
    classes.push(customClass)
  }

  return classes.join(' ')
})
</script>
