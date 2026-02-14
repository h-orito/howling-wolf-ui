<template>
  <div v-if="situation" class="my-2 rounded border border-gray-300 p-3 text-xs">
    <h3 class="mb-2 font-bold">カミングアウト</h3>
    <div class="space-y-2">
      <!-- 現在のCO -->
      <div v-if="currentComingOuts.length > 0">
        <p class="mb-1 text-gray-500">現在のCO:</p>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="co in currentComingOuts"
            :key="co.skill.code"
            class="rounded bg-gray-200 px-2 py-0.5"
          >
            {{ co.skill.name }}
          </span>
        </div>
      </div>

      <FormSelect
        v-model="selectedSkillCode"
        label="CO役職"
        :options="skillOptions"
      />
      <div class="flex gap-2">
        <UiButton :disabled="!selectedSkillCode" @click="handleComingOut">
          COする
        </UiButton>
        <UiButton
          v-if="currentComingOuts.length > 0"
          color="secondary"
          @click="handleCancelComingOut"
        >
          CO取消
        </UiButton>
      </div>
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

const currentComingOuts = computed(() => {
  return situation.value?.coming_out.current_coming_outs.list ?? []
})

const skillOptions = computed(() => {
  return [
    { value: '', label: '選択してください' },
    ...(situation.value?.coming_out.selectable_skill_list.map((skill) => ({
      value: skill.code,
      label: skill.name
    })) ?? [])
  ]
})

const handleComingOut = async () => {
  if (!selectedSkillCode.value) return
  try {
    const skillCodes = [
      ...currentComingOuts.value.map((co) => co.skill.code),
      selectedSkillCode.value
    ]
    await apiCall(`/village/${villageId.value}/comingout`, {
      method: 'POST',
      body: { skill_code: skillCodes }
    })
    selectedSkillCode.value = ''
    await refresh()
  } catch (error) {
    console.error('カミングアウトに失敗しました:', error)
  }
}

const handleCancelComingOut = async () => {
  try {
    await apiCall(`/village/${villageId.value}/comingout`, {
      method: 'POST',
      body: { skill_code: [] }
    })
    await refresh()
  } catch (error) {
    console.error('CO取消に失敗しました:', error)
  }
}
</script>
