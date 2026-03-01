<template>
  <FormInput
    :id="id"
    :model-value="String(modelValue)"
    type="number"
    :min="min"
    :max="max"
    :step="step"
    :placeholder="placeholder"
    :required="required"
    :disabled="disabled"
    :size="size"
    :error="error"
    :name="name"
    input-class="text-right"
    @update:model-value="handleUpdate"
    @blur="handleBlur"
  />
</template>

<script setup lang="ts">
import FormInput from '~/components/ui/form/FormInput.vue'

interface Props {
  modelValue: string | number
  min?: number
  max?: number
  step?: number
  placeholder?: string
  required?: boolean
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  error?: boolean
  id?: string
  name?: string
}

withDefaults(defineProps<Props>(), {
  min: undefined,
  max: undefined,
  step: 1,
  placeholder: '',
  required: false,
  disabled: false,
  size: 'md',
  error: false,
  id: undefined,
  name: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  blur: [event: FocusEvent]
}>()

const handleUpdate = (value: string) => {
  const numValue = Number(value)
  emit('update:modelValue', Number.isNaN(numValue) ? 0 : numValue)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>
