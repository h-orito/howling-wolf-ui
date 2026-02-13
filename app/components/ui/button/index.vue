<template>
  <component
    :is="componentType"
    :type="resolvedAs === 'button' ? type : undefined"
    :disabled="resolvedAs === 'button' ? isDisabled : undefined"
    :href="resolvedAs === 'a' ? href : undefined"
    :to="resolvedAs === 'NuxtLink' ? to : undefined"
    :target="resolvedAs !== 'button' ? target : undefined"
    :rel="
      resolvedAs !== 'button' && target === '_blank'
        ? 'noopener noreferrer'
        : undefined
    "
    :class="buttonClasses"
    @click="handleClick"
  >
    <!-- Leading icon or loading spinner -->
    <span v-if="loading" class="animate-spin">
      <Icon name="i-heroicons-arrow-path" :size="iconSize" />
    </span>
    <Icon v-else-if="icon && !trailing" :name="icon" :size="iconSize" />

    <!-- Button content -->
    <slot />

    <!-- Trailing icon -->
    <Icon v-if="icon && trailing" :name="icon" :size="iconSize" />
  </component>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import Icon from '~/components/ui/icon/Icon.vue'

const attrs = useAttrs()

type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
type ButtonVariant = 'solid' | 'outline' | 'link'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  color?: ButtonColor
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  block?: boolean
  icon?: string
  type?: 'button' | 'submit' | 'reset'
  trailing?: boolean
  as?: 'button' | 'a' | 'NuxtLink'
  href?: string
  to?: RouteLocationRaw
  target?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  variant: 'solid',
  size: 'md',
  disabled: false,
  loading: false,
  block: false,
  icon: undefined,
  type: 'button',
  trailing: false,
  as: 'button',
  href: undefined,
  to: undefined,
  target: undefined
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// 実際に使用するコンポーネントタイプを自動推論
const resolvedAs = computed(() => {
  if (props.as !== 'button') return props.as
  if (props.to) return 'NuxtLink'
  if (props.href) return 'a'
  return 'button'
})

// レンダリングするコンポーネントを決定
const componentType = computed(() => {
  if (resolvedAs.value === 'a') return 'a'
  if (resolvedAs.value === 'NuxtLink') return resolveComponent('NuxtLink')
  return 'button'
})

// Determine if button should be disabled
const isDisabled = computed(() => props.disabled || props.loading)

// Icon size based on button size
const iconSize = computed<IconSize>(() => {
  const sizeMap: Record<ButtonSize, IconSize> = {
    xs: 'xs',
    sm: 'xs',
    md: 'sm',
    lg: 'md',
    xl: 'lg'
  }
  return sizeMap[props.size]
})

// Base classes for all buttons
const baseClasses =
  'inline-flex items-center justify-center gap-1.5 font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

// Size classes
const sizeClasses = computed(() => {
  const sizes: Record<ButtonSize, string> = {
    xs: 'px-2 py-1 text-xs rounded',
    sm: 'px-2.5 py-1.5 text-xs rounded-md',
    md: 'px-3 py-2 text-sm rounded-md',
    lg: 'px-4 py-2.5 text-base rounded-md',
    xl: 'px-5 py-3 text-lg rounded-lg'
  }
  return sizes[props.size]
})

// Color and variant classes
const colorVariantClasses = computed(() => {
  const colorMap: Record<ButtonColor, Record<ButtonVariant, string>> = {
    primary: {
      solid:
        'bg-[var(--ui-primary)] text-white hover:bg-[#3377dd] active:bg-[#2266cc] focus-visible:ring-[var(--ui-primary)]',
      outline:
        'border border-[var(--ui-primary)] text-[var(--ui-primary)] bg-transparent hover:bg-[var(--ui-primary)]/10 active:bg-[var(--ui-primary)]/20 focus-visible:ring-[var(--ui-primary)]',
      link: 'text-[var(--ui-primary)] bg-transparent hover:underline focus-visible:ring-[var(--ui-primary)]'
    },
    secondary: {
      solid:
        'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 focus-visible:ring-gray-600',
      outline:
        'border border-gray-600 text-gray-600 bg-transparent hover:bg-gray-600/10 active:bg-gray-600/20 focus-visible:ring-gray-600',
      link: 'text-gray-600 bg-transparent hover:underline focus-visible:ring-gray-600'
    },
    success: {
      solid:
        'bg-[var(--ui-success)] text-white hover:bg-[#1db954] active:bg-[#18a348] focus-visible:ring-[var(--ui-success)]',
      outline:
        'border border-[var(--ui-success)] text-[var(--ui-success)] bg-transparent hover:bg-[var(--ui-success)]/10 active:bg-[var(--ui-success)]/20 focus-visible:ring-[var(--ui-success)]',
      link: 'text-[var(--ui-success)] bg-transparent hover:underline focus-visible:ring-[var(--ui-success)]'
    },
    info: {
      solid:
        'bg-[var(--ui-info)] text-white hover:bg-[#1c8cd6] active:bg-[#187cbe] focus-visible:ring-[var(--ui-info)]',
      outline:
        'border border-[var(--ui-info)] text-[var(--ui-info)] bg-transparent hover:bg-[var(--ui-info)]/10 active:bg-[var(--ui-info)]/20 focus-visible:ring-[var(--ui-info)]',
      link: 'text-[var(--ui-info)] bg-transparent hover:underline focus-visible:ring-[var(--ui-info)]'
    },
    warning: {
      solid:
        'bg-[var(--ui-warning)] text-gray-900 hover:bg-[#ffd633] active:bg-[#ffd11a] focus-visible:ring-[var(--ui-warning)]',
      outline:
        'border border-[var(--ui-warning)] text-[var(--ui-warning)] bg-transparent hover:bg-[var(--ui-warning)]/10 active:bg-[var(--ui-warning)]/20 focus-visible:ring-[var(--ui-warning)]',
      link: 'text-[var(--ui-warning)] bg-transparent hover:underline focus-visible:ring-[var(--ui-warning)]'
    },
    error: {
      solid:
        'bg-[var(--ui-error)] text-white hover:bg-[#e6324f] active:bg-[#cc2c46] focus-visible:ring-[var(--ui-error)]',
      outline:
        'border border-[var(--ui-error)] text-[var(--ui-error)] bg-transparent hover:bg-[var(--ui-error)]/10 active:bg-[var(--ui-error)]/20 focus-visible:ring-[var(--ui-error)]',
      link: 'text-[var(--ui-error)] bg-transparent hover:underline focus-visible:ring-[var(--ui-error)]'
    }
  }
  return colorMap[props.color][props.variant]
})

// Disabled classes
const disabledClasses = computed(() => {
  if (isDisabled.value) {
    return 'opacity-50 cursor-not-allowed pointer-events-none'
  }
  return 'cursor-pointer'
})

// Block class
const blockClass = computed(() => (props.block ? 'w-full' : ''))

// Check if parent has specified background color class
const hasParentBgClass = computed(() => {
  const parentClass = attrs.class as string | undefined
  if (!parentClass) return false
  return parentClass.split(/\s+/).some((cls) => cls.startsWith('bg-'))
})

// Color variant classes without background (for when parent specifies bg)
const colorVariantClassesWithoutBg = computed(() => {
  return colorVariantClasses.value
    .split(' ')
    .filter(
      (cls) =>
        !cls.startsWith('bg-') &&
        !cls.startsWith('hover:bg-') &&
        !cls.startsWith('active:bg-')
    )
    .join(' ')
})

// Combined button classes
const buttonClasses = computed(() => {
  return [
    baseClasses,
    sizeClasses.value,
    hasParentBgClass.value
      ? colorVariantClassesWithoutBg.value
      : colorVariantClasses.value,
    disabledClasses.value,
    blockClass.value
  ].filter(Boolean)
})

// Click handler
const handleClick = (event: MouseEvent) => {
  if (!isDisabled.value) {
    emit('click', event)
  }
}
</script>
