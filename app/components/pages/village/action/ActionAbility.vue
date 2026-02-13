<template>
  <div v-if="situation" class="my-2 rounded border border-gray-300 p-3 text-xs">
    <h3 class="mb-2 font-bold">能力行使</h3>
    <div
      v-for="ability in usableAbilities"
      :key="ability.type.code"
      class="mb-3"
    >
      <p class="mb-1 font-bold">{{ ability.type.name }}</p>
      <div class="space-y-2">
        <FormSelect
          :model-value="getSelectedTarget(ability.type.code)"
          label="対象"
          :options="getTargetOptions(ability)"
          @update:model-value="setSelectedTarget(ability.type.code, $event)"
        />
        <UiButton
          :disabled="!getSelectedTarget(ability.type.code)"
          @click="handleAbility(ability.type.code)"
        >
          {{ ability.type.name }}する
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { VillageAbilitySituation } from '~/lib/api/types'
import UiButton from '~/components/ui/button/index.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import { useVillage } from '~/composables/village/useVillage'
import { useVillageRefresh } from '~/composables/village/useVillageRefresh'
import { useSituation } from '~/composables/village/useSituation'

const { situation } = useSituation()
const { villageId } = useVillage()
const { refresh } = useVillageRefresh()
const { apiCall } = useApi()

const selectedTargets = ref<Record<string, string>>({})

const usableAbilities = computed(() => {
  return situation.value?.ability.list.filter((a) => a.usable) ?? []
})

const getSelectedTarget = (skillCode: string): string => {
  return selectedTargets.value[skillCode] ?? ''
}

const setSelectedTarget = (skillCode: string, value: string | number) => {
  selectedTargets.value = {
    ...selectedTargets.value,
    [skillCode]: String(value)
  }
}

const getTargetOptions = (
  ability: DeepReadonly<VillageAbilitySituation> | VillageAbilitySituation
) => {
  return [
    { value: '', label: '選択してください' },
    ...ability.target_list.map((t) => ({
      value: String(t.id),
      label: t.chara.chara_name.name
    }))
  ]
}

const handleAbility = async (skillCode: string) => {
  const targetId = selectedTargets.value[skillCode]
  if (!targetId) return

  try {
    await apiCall(`/village/${villageId.value}/ability`, {
      method: 'POST',
      body: {
        target_id: Number(targetId),
        ability_type: skillCode
      }
    })
    await refresh()
  } catch (error) {
    console.error('能力行使に失敗しました:', error)
  }
}
</script>
