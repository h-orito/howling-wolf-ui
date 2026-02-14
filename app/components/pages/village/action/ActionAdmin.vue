<template>
  <div
    v-if="situation"
    class="my-2 rounded border border-red-300 bg-red-50 p-3 text-xs"
  >
    <h3 class="mb-2 font-bold text-red-600">管理者操作</h3>
    <div class="space-y-2">
      <!-- 強制退出 -->
      <div v-if="situation.admin?.available_kick">
        <FormSelect
          v-model="selectedKickTargetId"
          label="強制退出対象"
          :options="kickTargetOptions"
        />
        <UiButton
          class="mt-2"
          color="error"
          :disabled="!selectedKickTargetId"
          @click="handleKick"
        >
          強制退出
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
const { villageId, village } = useVillage()
const { refresh } = useVillageRefresh()
const { apiCall } = useApi()

const selectedKickTargetId = ref<string>('')

const kickTargetOptions = computed(() => {
  const adminParticipantNames = new Set(
    situation.value?.admin?.participant_list.map((p) => p.name) ?? []
  )
  const members = village.value?.participant.member_list ?? []
  const options = members
    .filter((m) => adminParticipantNames.has(m.chara.chara_name.name))
    .map((m) => ({
      value: String(m.id),
      label: m.chara.chara_name.name
    }))
  return [{ value: '', label: '選択してください' }, ...options]
})

const handleKick = async () => {
  if (!selectedKickTargetId.value) return
  try {
    await apiCall(`/admin/village/${villageId.value}/kick`, {
      method: 'POST',
      body: {
        target_id: Number(selectedKickTargetId.value)
      }
    })
    selectedKickTargetId.value = ''
    await refresh()
  } catch (error) {
    console.error('強制退出に失敗しました:', error)
  }
}
</script>
