<template>
  <div v-if="situation" class="my-2 rounded border border-gray-300 p-3 text-xs">
    <h3 class="mb-2 font-bold">参加 / 見学</h3>
    <div class="space-y-2">
      <!-- キャラクター選択 -->
      <FormSelect
        v-model="selectedCharaId"
        label="キャラクター"
        :options="charaOptions"
      />

      <!-- 入村パスワード -->
      <FormInput
        v-model="joinPassword"
        label="入村パスワード"
        type="password"
      />

      <!-- ボタン -->
      <div class="flex gap-2">
        <UiButton
          v-if="situation.participate.available_participate"
          :disabled="!canParticipate"
          @click="handleParticipate"
        >
          参加する
        </UiButton>
        <UiButton
          v-if="situation.participate.available_spectate"
          :disabled="!canSpectate"
          color="secondary"
          @click="handleSpectate"
        >
          見学する
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/button/index.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import FormInput from '~/components/ui/form/FormInput.vue'
import { useVillage } from '~/composables/village/useVillage'
import { useVillageRefresh } from '~/composables/village/useVillageRefresh'
import { useSituation } from '~/composables/village/useSituation'

const { situation } = useSituation()
const { villageId } = useVillage()
const { refresh } = useVillageRefresh()
const { apiCall } = useApi()

const selectedCharaId = ref<string>('')
const joinPassword = ref('')

const charaOptions = computed(() => {
  return (
    situation.value?.participate.selectable_chara_list.map((chara) => ({
      value: String(chara.id),
      label: chara.chara_name.name
    })) ?? []
  )
})

const canParticipate = computed(
  () =>
    situation.value?.participate.available_participate && selectedCharaId.value
)
const canSpectate = computed(
  () => situation.value?.participate.available_spectate && selectedCharaId.value
)

const handleParticipate = async () => {
  await submitParticipation(false)
}

const handleSpectate = async () => {
  await submitParticipation(true)
}

const submitParticipation = async (isSpectate: boolean) => {
  try {
    await apiCall(`/village/${villageId.value}/participate`, {
      method: 'POST',
      body: {
        chara_id: Number(selectedCharaId.value),
        join_message: '',
        join_password: joinPassword.value || undefined,
        spectator: isSpectate
      }
    })
    await refresh()
  } catch (error) {
    console.error('参加に失敗しました:', error)
  }
}
</script>
