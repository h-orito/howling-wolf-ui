<template>
  <div class="text-xs text-gray-300">
    <div
      v-for="participant in participants"
      :key="participant.id"
      class="flex cursor-pointer items-center py-1 hover:text-blue-400"
      @click="handleFilter(participant.id)"
    >
      <CharaImage
        v-if="findChara(participant)"
        :chara="findChara(participant)!"
        :is-small="true"
        class="mr-1.5"
      />
      <span>{{ participant.chara.chara_name.name }}</span>
    </div>
    <p v-if="participants.length === 0" class="py-2 text-gray-500">
      参加者なし
    </p>
  </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { Chara } from '~/lib/api/types'
import CharaImage from '~/components/pages/village/CharaImage.vue'
import { useVillage } from '~/composables/village/useVillage'
import { useVillageMessageFilter } from '~/composables/village/useVillageMessageFilter'
import { useMessage } from '~/composables/village/useMessage'

const emit = defineEmits<{
  'chara-filter': []
}>()

const { village, charachips } = useVillage()
const { filterByParticipant } = useVillageMessageFilter()
const { loadMessages } = useMessage()

const participants = computed(() => {
  if (!village.value) return []
  return [
    ...village.value.participant.member_list,
    ...village.value.spectator.member_list
  ]
})

const findChara = (participant: {
  chara: { id: number }
}): DeepReadonly<Chara> | Chara | null => {
  if (!charachips.value || charachips.value.length === 0) return null
  return (
    charachips.value[0]?.chara_list.find(
      (c) => c.id === participant.chara.id
    ) ?? null
  )
}

const handleFilter = (participantId: number) => {
  filterByParticipant(participantId)
  loadMessages()
  emit('chara-filter')
}
</script>
