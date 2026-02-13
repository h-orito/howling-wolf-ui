<template>
  <Modal v-model="isOpenModel" title="メモ" @close="$emit('close')">
    <div class="space-y-2">
      <FormTextarea
        v-model="memoText"
        label="メモ"
        placeholder="自由にメモを残せます（ブラウザに保存）"
        :rows="10"
      />
      <p class="text-xs text-gray-500">
        メモはブラウザのローカルストレージに保存されます。
      </p>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/ui/modal/Modal.vue'
import FormTextarea from '~/components/ui/form/FormTextarea.vue'
import { useVillage } from '~/composables/village/useVillage'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const isOpenModel = computed({
  get: () => props.isOpen,
  set: () => emit('close')
})

const { villageId } = useVillage()

const STORAGE_KEY_PREFIX = 'village-memo-'

const memoText = ref('')

const storageKey = computed(
  () => `${STORAGE_KEY_PREFIX}${villageId.value ?? ''}`
)

onMounted(() => {
  const saved = localStorage.getItem(storageKey.value)
  if (saved) {
    memoText.value = saved
  }
})

watch(memoText, (value) => {
  localStorage.setItem(storageKey.value, value)
})
</script>
