<template>
  <div v-bind="$attrs">
    <input
      :id="id"
      :name="name"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :min="min"
      :max="max"
      :step="step"
      :class="inputClasses"
      @input="handleInput"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts">
type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  modelValue: string
  type?: 'text' | 'password' | 'number'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  size?: InputSize
  maxlength?: number
  error?: boolean
  id?: string
  name?: string
  min?: number
  max?: number
  step?: number
  inputClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  required: false,
  disabled: false,
  readonly: false,
  size: 'md',
  maxlength: undefined,
  error: false,
  id: undefined,
  name: undefined,
  min: undefined,
  max: undefined,
  step: undefined,
  inputClass: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
}>()

defineOptions({
  inheritAttrs: false
})

// サイズに応じたクラス
const sizeClasses = computed(() => {
  const sizes: Record<InputSize, string> = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base',
    xl: 'px-5 py-3 text-lg'
  }
  return sizes[props.size]
})

// 基本クラス
const baseClasses =
  'block w-full rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none transition-colors duration-150 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500'

// ボーダーとフォーカス時のクラス
const borderClasses = computed(() => {
  if (props.error) {
    return 'border border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-500'
  }
  return 'border border-gray-300 focus:border-[var(--ui-primary)] focus:ring-2 focus:ring-[var(--ui-primary)]/20 dark:border-gray-600'
})

// disabled/readonly時のクラス
const disabledClasses = computed(() => {
  if (props.disabled) {
    return 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
  }
  if (props.readonly) {
    return 'bg-gray-50 dark:bg-gray-700'
  }
  return ''
})

// 結合クラス
const inputClasses = computed(() => {
  return [
    baseClasses,
    borderClasses.value,
    sizeClasses.value,
    disabledClasses.value,
    props.inputClass
  ]
    .filter(Boolean)
    .join(' ')
})

// 入力ハンドラ
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

// blurハンドラ
const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>
