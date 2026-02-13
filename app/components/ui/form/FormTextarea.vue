<template>
  <textarea
    :id="id"
    ref="textareaElement"
    v-bind="$attrs"
    :name="name"
    :value="modelValue"
    :placeholder="placeholder"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :maxlength="maxlength"
    :rows="rows"
    :class="textareaClasses"
    @input="handleInput"
    @blur="handleBlur"
  />
</template>

<script setup lang="ts">
type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  modelValue: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  size?: InputSize
  maxlength?: number
  rows?: number
  error?: boolean
  id?: string
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  required: false,
  disabled: false,
  readonly: false,
  size: 'md',
  maxlength: undefined,
  rows: 3,
  error: false,
  id: undefined,
  name: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
}>()

defineOptions({
  inheritAttrs: false
})

// textarea要素への参照
const textareaElement = ref<HTMLTextAreaElement | null>(null)

// 外部からアクセス可能にする
defineExpose({
  textareaElement
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
  'block w-full rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none transition-colors duration-150 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 resize-vertical'

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
const textareaClasses = computed(() => {
  return [
    baseClasses,
    borderClasses.value,
    sizeClasses.value,
    disabledClasses.value
  ]
    .filter(Boolean)
    .join(' ')
})

// 入力ハンドラ
const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

// blurハンドラ
const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>
