<template>
  <div role="group" :aria-labelledby="ariaLabelledby" class="flex">
    <button
      v-for="(option, index) in options"
      :id="`${computedId}-${option.value}`"
      :key="option.value"
      type="button"
      role="checkbox"
      :tabindex="getTabIndex(option.value)"
      :aria-checked="isSelected(option.value)"
      :disabled="disabled"
      :class="buttonClasses(option.value, index)"
      @click="toggleOption(option.value)"
      @keydown.space.prevent="toggleOption(option.value)"
      @keydown.arrow-down.prevent="selectNext(option.value)"
      @keydown.arrow-right.prevent="selectNext(option.value)"
      @keydown.arrow-up.prevent="selectPrevious(option.value)"
      @keydown.arrow-left.prevent="selectPrevious(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts" generic="T extends string | number">
interface CheckOption<T> {
  value: T
  label: string
}

interface Props<T> {
  modelValue: T[]
  options: CheckOption<T>[]
  disabled?: boolean
  name?: string
  id?: string
  ariaLabelledby?: string
}

const props = withDefaults(defineProps<Props<T>>(), {
  disabled: false,
  name: undefined,
  id: undefined,
  ariaLabelledby: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: T[]]
}>()

// 一意なIDを生成（propsで渡されていなければ自動生成）
const autoId = useId()
const computedId = computed(() => props.id ?? autoId)

// 選択状態の確認
const isSelected = (value: T): boolean => {
  return props.modelValue.includes(value)
}

// トグル処理
const toggleOption = (value: T) => {
  if (props.disabled) return

  const newValue = isSelected(value)
    ? props.modelValue.filter((v) => v !== value)
    : [...props.modelValue, value]

  emit('update:modelValue', newValue)
}

// キーボードナビゲーション: 次のオプションにフォーカス移動
const selectNext = (currentValue: T) => {
  if (props.disabled || props.options.length === 0) return

  const currentIndex = props.options.findIndex(
    (opt) => opt.value === currentValue
  )
  const nextIndex =
    currentIndex === -1 ? 0 : (currentIndex + 1) % props.options.length
  const nextOption = props.options[nextIndex]
  if (nextOption) {
    const nextButton = document.getElementById(
      `${computedId.value}-${nextOption.value}`
    )
    nextButton?.focus()
  }
}

// キーボードナビゲーション: 前のオプションにフォーカス移動
const selectPrevious = (currentValue: T) => {
  if (props.disabled || props.options.length === 0) return

  const currentIndex = props.options.findIndex(
    (opt) => opt.value === currentValue
  )
  const prevIndex =
    currentIndex <= 0 ? props.options.length - 1 : currentIndex - 1
  const prevOption = props.options[prevIndex]
  if (prevOption) {
    const prevButton = document.getElementById(
      `${computedId.value}-${prevOption.value}`
    )
    prevButton?.focus()
  }
}

// タブインデックスの計算（選択されているもの、または最初のオプションのみ0）
const getTabIndex = (value: T): number => {
  if (props.disabled) return -1

  // 選択されているオプションがあればそれにフォーカス
  if (props.modelValue.length > 0 && isSelected(value)) return 0

  // 選択されているオプションがない場合、最初のオプションにフォーカス可能に
  if (props.modelValue.length === 0 && props.options[0]?.value === value)
    return 0

  return -1
}

// ボタンのクラス
const buttonClasses = (value: T, index: number) => {
  const isFirst = index === 0
  const isLast = index === props.options.length - 1
  const selected = isSelected(value)

  // ベースクラス
  const baseClasses =
    'flex-1 px-3 py-1.5 text-xs font-medium border transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--ui-primary)] focus:z-10'

  // 角丸（最初と最後のみ）
  const roundedClasses = isFirst ? 'rounded-l' : isLast ? 'rounded-r' : ''

  // ボーダー（隣接ボタンとの重複を防ぐため、最初以外は左ボーダーなし）
  const borderClasses = isFirst ? 'border' : '-ml-px border'

  // 選択状態のスタイル
  const stateClasses = selected
    ? 'bg-[var(--ui-primary)] border-[var(--ui-primary)] text-white'
    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'

  // 無効状態
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
