<template>
  <div v-bind="$attrs" class="relative">
    <select
      :id="id"
      :name="name"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :class="selectClasses"
      @change="handleChange"
      @blur="handleBlur"
    >
      <option
        v-if="placeholder"
        value=""
        disabled
        :selected="modelValue === null || modelValue === undefined"
      >
        {{ placeholder }}
      </option>
      <option
        v-for="option in normalizedOptions"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
    >
      <svg
        class="h-4 w-4 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
type SelectSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type SelectOption =
  | {
      label: string
      value: string | number
      disabled?: boolean
    }
  | string
  | number

interface Props {
  modelValue: string | number | null | undefined
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  size?: SelectSize
  error?: boolean
  id?: string
  name?: string
  labelAttribute?: string
  valueAttribute?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  disabled: false,
  required: false,
  size: 'md',
  error: false,
  id: undefined,
  name: undefined,
  labelAttribute: 'label',
  valueAttribute: 'value'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  change: [event: Event]
}>()

defineOptions({
  inheritAttrs: false
})

// オプションを正規化
const normalizedOptions = computed(() => {
  return props.options.map((option) => {
    if (typeof option === 'string' || typeof option === 'number') {
      return { label: String(option), value: option, disabled: false }
    }
    const optionObj = option as Record<string, unknown>
    return {
      label: String(optionObj[props.labelAttribute] ?? optionObj.label ?? ''),
      value: (optionObj[props.valueAttribute] ?? optionObj.value) as
        | string
        | number,
      disabled: !!optionObj.disabled
    }
  })
})

// サイズに応じたクラス
const sizeClasses = computed(() => {
  const sizes: Record<SelectSize, string> = {
    xs: 'px-2 py-1 pr-7 text-xs',
    sm: 'px-2.5 py-1.5 pr-8 text-xs',
    md: 'px-3 py-2 pr-9 text-sm',
    lg: 'px-4 py-2.5 pr-10 text-base',
    xl: 'px-5 py-3 pr-11 text-lg'
  }
  return sizes[props.size]
})

// 基本クラス
const baseClasses =
  'block w-full appearance-none rounded-md bg-white text-gray-900 focus:outline-none transition-colors duration-150 dark:bg-gray-800 dark:text-white cursor-pointer'

// ボーダーとフォーカス時のクラス
const borderClasses = computed(() => {
  if (props.error) {
    return 'border border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-500'
  }
  return 'border border-gray-300 focus:border-[var(--ui-primary)] focus:ring-2 focus:ring-[var(--ui-primary)]/20 dark:border-gray-600'
})

// disabled時のクラス
const disabledClasses = computed(() => {
  if (props.disabled) {
    return 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
  }
  return ''
})

// 結合クラス
const selectClasses = computed(() => {
  return [
    baseClasses,
    borderClasses.value,
    sizeClasses.value,
    disabledClasses.value
  ]
    .filter(Boolean)
    .join(' ')
})

// changeハンドラ
const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  if (value === '') {
    emit('update:modelValue', value)
    emit('change', event)
    return
  }
  const numValue = Number(value)
  emit('update:modelValue', isNaN(numValue) ? value : numValue)
  emit('change', event)
}

// blurハンドラ
const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>
