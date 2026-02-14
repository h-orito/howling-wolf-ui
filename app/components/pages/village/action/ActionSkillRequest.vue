<template>
  <div v-if="situation" class="my-2 rounded border border-gray-300 p-3 text-xs">
    <h3 class="mb-2 font-bold">役職希望</h3>
    <div class="space-y-2">
      <FormSelect
        v-model="selectedSkillCode"
        label="第一希望"
        :options="skillOptions"
      />
      <FormSelect
        v-model="selectedSecondSkillCode"
        label="第二希望"
        :options="skillOptions"
      />
      <UiButton @click="handleSkillRequest">希望する</UiButton>
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

const selectedSkillCode = ref('')
const selectedSecondSkillCode = ref('')

const skillOptions = computed(() => {
  return [
    { value: '', label: 'おまかせ' },
    ...(situation.value?.skill_request.selectable_skill_list.map((skill) => ({
      value: skill.code,
      label: skill.name
    })) ?? [])
  ]
})

const handleSkillRequest = async () => {
  try {
    await apiCall(`/village/${villageId.value}/change-skill`, {
      method: 'POST',
      body: {
        first_request_skill: selectedSkillCode.value || '',
        second_request_skill: selectedSecondSkillCode.value || ''
      }
    })
    await refresh()
  } catch (error) {
    console.error('役職希望の変更に失敗しました:', error)
  }
}
</script>
