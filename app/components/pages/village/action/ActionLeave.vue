<template>
  <div v-if="situation" class="my-2 rounded border border-gray-300 p-3 text-xs">
    <h3 class="mb-2 font-bold">退出</h3>
    <p class="mb-2 text-red-500">
      村から退出します。この操作は取り消せません。
    </p>
    <UiButton color="error" @click="handleLeave">退出する</UiButton>
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

const handleLeave = async () => {
  try {
    await apiCall(`/village/${villageId.value}/leave`, {
      method: 'POST'
    })
    await refresh()
  } catch (error) {
    console.error('退出に失敗しました:', error)
  }
}
</script>
