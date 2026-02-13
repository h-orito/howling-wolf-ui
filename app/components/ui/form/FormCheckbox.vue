<template>
  <label
    class="inline-flex cursor-pointer gap-2"
    :class="{ 'cursor-not-allowed': disabled }"
    @click.prevent="toggle"
  >
    <span class="inline-flex items-center">
      <span
        :id="computedId"
        role="checkbox"
        :tabindex="disabled ? -1 : 0"
        :aria-checked="modelValue"
        :aria-labelledby="hasLabel ? labelId : undefined"
        :aria-describedby="description ? descriptionId : undefined"
        :class="checkboxClasses"
        @keydown.space.prevent="toggle"
        @keydown.enter.prevent="toggle"
      >
        <svg
          v-if="modelValue"
          class="h-3 w-3 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    </span>
    <span v-if="hasLabel || description || $slots.default" class="text-left">
      <span
        v-if="hasLabel || $slots.default"
        :id="labelId"
        class="text-sm leading-5 text-gray-700 dark:text-gray-300"
        :class="{
          'opacity-50': disabled
        }"
      >
        <slot>{{ label }}</slot>
      </span>
      <span
        v-if="description"
        :id="descriptionId"
        class="mt-1 block text-xs text-gray-500 dark:text-gray-400"
      >
        {{ description }}
      </span>
    </span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  label?: string
  description?: string
  disabled?: boolean
  error?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  description: undefined,
  disabled: false,
  error: false,
  id: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const slots = useSlots()

// 一意なIDを生成
const autoId = useId()
const computedId = computed(() => props.id ?? autoId)
const labelId = computed(() => `${computedId.value}-label`)
const descriptionId = computed(() => `${computedId.value}-description`)

// ラベルがあるかどうか
const hasLabel = computed(() => !!props.label || !!slots.default)

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}

// チェックボックスのクラス
const checkboxClasses = computed(() => {
  const baseClasses =
    'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--ui-primary)] focus:ring-offset-2 dark:focus:ring-offset-gray-800'

  const stateClasses = props.modelValue
    ? 'bg-[var(--ui-primary)] border-[var(--ui-primary)]'
    : props.error
      ? 'bg-white border-red-500 dark:bg-gray-700 dark:border-red-500'
      : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-500'

  const disabledClasses = props.disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer'

  return [baseClasses, stateClasses, disabledClasses].join(' ')
})
</script>
