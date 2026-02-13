<template>
  <div v-if="situation" class="my-2 rounded border border-gray-300 p-3 text-xs">
    <h3 class="mb-2 font-bold">コミット</h3>
    <p v-if="situation.commit.committing" class="text-green-600">
      コミット済みです
    </p>
    <div class="flex gap-2">
      <UiButton v-if="!situation.commit.committing" @click="handleCommit(true)">
        コミットする
      </UiButton>
      <UiButton
        v-if="situation.commit.committing"
        color="secondary"
        @click="handleCommit(false)"
      >
        コミット取消
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/button/index.vue'
import { useVillage } from '~/composables/village/useVillage'
import { useVillageRefresh } from '~/composables/village/useVillageRefresh'
import { useSituation } from '~/composables/village/useSituation'

const { situation } = useSituation()
const { villageId } = useVillage()
const { refresh } = useVillageRefresh()
const { apiCall } = useApi()

const handleCommit = async (commit: boolean) => {
  try {
    await apiCall(`/village/${villageId.value}/commit`, {
      method: 'POST',
      body: { commit }
    })
    await refresh()
  } catch (error) {
    console.error('コミットに失敗しました:', error)
  }
}
</script>
