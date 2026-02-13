<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
type BadgeColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
type BadgeVariant = 'solid' | 'outline' | 'soft' | 'subtle'
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg'

interface Props {
  color?: BadgeColor
  variant?: BadgeVariant
  size?: BadgeSize
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  variant: 'solid',
  size: 'sm',
  class: undefined
})

// Base classes for all badges
const baseClasses =
  'inline-flex items-center justify-center font-medium rounded-full whitespace-nowrap'

// Size classes
const sizeClasses = computed(() => {
  const sizes: Record<BadgeSize, string> = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1 text-base'
  }
  return sizes[props.size]
})

// Color and variant classes
const colorVariantClasses = computed(() => {
  const colorMap: Record<BadgeColor, Record<BadgeVariant, string>> = {
    primary: {
      solid: 'bg-[var(--ui-primary)] text-white',
      outline:
        'border border-[var(--ui-primary)] text-[var(--ui-primary)] bg-transparent',
      soft: 'bg-[var(--ui-primary)]/20 text-[var(--ui-primary)]',
      subtle: 'bg-[var(--ui-primary)]/10 text-[var(--ui-primary)]'
    },
    success: {
      solid: 'bg-[var(--ui-success)] text-white',
      outline:
        'border border-[var(--ui-success)] text-[var(--ui-success)] bg-transparent',
      soft: 'bg-[var(--ui-success)]/20 text-[var(--ui-success)]',
      subtle: 'bg-[var(--ui-success)]/10 text-[var(--ui-success)]'
    },
    warning: {
      solid: 'bg-[var(--ui-warning)] text-gray-900',
      outline:
        'border border-[var(--ui-warning)] text-[var(--ui-warning)] bg-transparent',
      soft: 'bg-[var(--ui-warning)]/20 text-[var(--ui-warning)]',
      subtle: 'bg-[var(--ui-warning)]/10 text-[var(--ui-warning)]'
    },
    error: {
      solid: 'bg-[var(--ui-error)] text-white',
      outline:
        'border border-[var(--ui-error)] text-[var(--ui-error)] bg-transparent',
      soft: 'bg-[var(--ui-error)]/20 text-[var(--ui-error)]',
      subtle: 'bg-[var(--ui-error)]/10 text-[var(--ui-error)]'
    },
    secondary: {
      solid: 'bg-gray-600 text-white',
      outline: 'border border-gray-400 text-gray-600 bg-transparent',
      soft: 'bg-gray-200 text-gray-700',
      subtle: 'bg-gray-100 text-gray-600'
    },
    info: {
      solid: 'bg-[var(--ui-info)] text-white',
      outline:
        'border border-[var(--ui-info)] text-[var(--ui-info)] bg-transparent',
      soft: 'bg-[var(--ui-info)]/20 text-[var(--ui-info)]',
      subtle: 'bg-[var(--ui-info)]/10 text-[var(--ui-info)]'
    }
  }
  return colorMap[props.color][props.variant]
})

// Combined badge classes
const badgeClasses = computed(() => {
  return [
    baseClasses,
    sizeClasses.value,
    colorVariantClasses.value,
    props.class
  ].filter(Boolean)
})
</script>
