<template>
  <div v-if="situation" class="my-2 rounded border border-gray-300 p-3 text-xs">
    <h3 class="mb-2 font-bold">投票</h3>
    <div class="space-y-2">
      <FormSelect
        v-model="selectedTargetId"
        label="投票先"
        :options="targetOptions"
      />
      <UiButton :disabled="!selectedTargetId" @click="handleVote">
        投票する
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/button/index.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import { useVillage } from '~/composables/village/useVillage'
import { useVillageRefresh } from '~/composables/village/useVillageRefresh'
import { useSituation } from '~/composables/village/useSituation'

const { situation } = useSituation()
const { villageId } = useVillage()
const { refresh } = useVillageRefresh()
const { apiCall } = useApi()

const selectedTargetId = ref<string>('')

const targetOptions = computed(() => {
  return [
    { value: '', label: '選択してください' },
    ...(situation.value?.vote.target_list.map((t) => ({
      value: String(t.id),
      label: t.chara.chara_name.name
    })) ?? [])
  ]
})

const handleVote = async () => {
  try {
    await apiCall(`/village/${villageId.value}/vote`, {
      method: 'POST',
      body: {
        target_id: Number(selectedTargetId.value)
      }
    })
    await refresh()
  } catch (error) {
    console.error('投票に失敗しました:', error)
  }
}
</script>
