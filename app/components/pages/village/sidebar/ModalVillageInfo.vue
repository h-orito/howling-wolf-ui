<template>
  <Modal v-model="isOpenModel" title="村の設定" @close="$emit('close')">
    <div v-if="village" class="space-y-3 text-sm">
      <div><span class="font-bold">村名:</span> {{ village.name }}</div>
      <div>
        <span class="font-bold">ステータス:</span> {{ village.status.name }}
      </div>
      <div>
        <span class="font-bold">定員:</span>
        {{ village.setting.capacity.min }}〜{{ village.setting.capacity.max }}人
      </div>
      <div>
        <span class="font-bold">沈黙時間:</span>
        {{ village.setting.time.silent_hours ?? 0 }}時間
      </div>
      <div v-if="village.setting.time.start_datetime">
        <span class="font-bold">開始予定:</span>
        {{ village.setting.time.start_datetime }}
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/ui/modal/Modal.vue'
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

const { village } = useVillage()
</script>
