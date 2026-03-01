<template>
  <div role="radiogroup" :aria-labelledby="ariaLabelledby" class="inline-flex">
    <button
      v-for="(option, index) in options"
      :id="`${computedId}-${option.value}`"
      :key="option.value"
      type="button"
      role="radio"
      :tabindex="getTabIndex(option.value)"
      :aria-checked="modelValue === option.value"
      :disabled="disabled"
      :class="buttonClasses(option.value, index)"
      @click="selectOption(option.value)"
      @keydown.arrow-down.prevent="selectNext"
      @keydown.arrow-right.prevent="selectNext"
      @keydown.arrow-up.prevent="selectPrevious"
      @keydown.arrow-left.prevent="selectPrevious"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface RadioOption {
  value: string | number
  label: string
}

interface Props {
  modelValue: string | number
  options: RadioOption[]
  disabled?: boolean
  name?: string
  id?: string
  ariaLabelledby?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  name: undefined,
  id: undefined,
  ariaLabelledby: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

// 一意なIDを生成
const autoId = useId()
const computedId = computed(() => props.id ?? autoId)

// 選択処理
const selectOption = (value: string | number) => {
  if (!props.disabled) {
    emit('update:modelValue', value)
  }
}

// キーボードナビゲーション: 次のオプションを選択
const selectNext = () => {
  if (props.disabled || props.options.length === 0) return

  const currentIndex = props.options.findIndex(
    (opt) => opt.value === props.modelValue
  )
  const nextIndex =
    currentIndex === -1 ? 0 : (currentIndex + 1) % props.options.length
  const nextOption = props.options[nextIndex]
  if (nextOption) {
    emit('update:modelValue', nextOption.value)
  }
}

// キーボードナビゲーション: 前のオプションを選択
const selectPrevious = () => {
  if (props.disabled || props.options.length === 0) return

  const currentIndex = props.options.findIndex(
    (opt) => opt.value === props.modelValue
  )
  const prevIndex =
    currentIndex <= 0 ? props.options.length - 1 : currentIndex - 1
  const prevOption = props.options[prevIndex]
  if (prevOption) {
    emit('update:modelValue', prevOption.value)
  }
}

// タブインデックスの計算
const getTabIndex = (value: string | number): number => {
  if (props.disabled) return -1
  if (props.modelValue === value) return 0
  const hasSelection = props.options.some(
    (opt) => opt.value === props.modelValue
  )
  if (!hasSelection && props.options[0]?.value === value) return 0
  return -1
}

// ボタンのクラス
const buttonClasses = (value: string | number, index: number) => {
  const isFirst = index === 0
  const isLast = index === props.options.length - 1
  const isSelected = props.modelValue === value

  const baseClasses =
    'px-3 py-1.5 text-xs font-medium border transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--ui-primary)] focus:z-10'

  const roundedClasses = isFirst ? 'rounded-l' : isLast ? 'rounded-r' : ''

  const borderClasses = isFirst ? 'border' : '-ml-px border'

  const stateClasses = isSelected
    ? 'bg-[var(--ui-primary)] border-[var(--ui-primary)] text-white'
    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'

  const disabledClasses = props.disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer'

  return [
    baseClasses,
    roundedClasses,
    borderClasses,
    stateClasses,
    disabledClasses
  ].join(' ')
}
</script>
