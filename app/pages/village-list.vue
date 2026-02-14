<template>
  <section class="bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="mb-4 text-xl font-semibold">終了した村一覧</h1>

      <div class="mb-4 flex items-center justify-center">
        <FormCheckbox
          v-model="includeCancelVillage"
          label="廃村も表示する"
          @update:model-value="handleIncludeCancelChange"
        />
      </div>

      <div class="text-sm">
        <LoadingSpinner v-if="loading" message="村一覧を読み込み中..." />

        <div
          v-else-if="tableVillages.length > 0"
          class="overflow-hidden rounded-lg bg-white shadow"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  村名
                </th>
                <th
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  参加人数
                </th>
                <th
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  編成
                </th>
                <th
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  勝利陣営
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="village in tableVillages" :key="village.id">
                <td
                  class="p-2 text-left text-sm whitespace-nowrap text-gray-900"
                >
                  <NuxtLink
                    :to="`/village?id=${village.id}`"
                    class="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {{ village.name }}
                  </NuxtLink>
                </td>
                <td
                  class="p-2 text-left text-sm whitespace-nowrap text-gray-900"
                >
                  {{ village.participantCount }}
                </td>
                <td
                  class="p-2 text-left text-sm whitespace-nowrap text-gray-900"
                >
                  {{ village.organization }}
                </td>
                <td
                  class="p-2 text-left text-sm whitespace-nowrap text-gray-900"
                >
                  {{ village.winCamp }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="rounded-lg bg-white p-8 shadow">
          <div class="text-center text-gray-500">
            <p>終了した村はありません</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import FormCheckbox from '~/components/ui/form/FormCheckbox.vue'
import LoadingSpinner from '~/components/ui/feedback/LoadingSpinner.vue'
import type { VillagesView, SimpleVillageView } from '~/lib/api/types'
import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'
import { ORGANIZATION_TEMPLATE } from '~/lib/api/organization-constants'

const { apiCall } = useApi()

const villages = ref<SimpleVillageView[]>([])
const loading = ref(true)
const includeCancelVillage = ref(false)

interface TableVillage {
  id: number
  name: string
  participantCount: number
  organization: string
  winCamp: string
}

const tableVillages = computed<TableVillage[]>(() => {
  return villages.value.map((village) => {
    const participantCount = village.participant.count
    const maxCapacity = String(village.setting.capacity.max)
    const orgKey =
      village.status.code === VILLAGE_STATUS.CANCEL
        ? maxCapacity
        : String(participantCount)
    const org = village.setting.organizations.organization[orgKey] ?? ''
    const shortOrg = ORGANIZATION_TEMPLATE.get(org)
    const organization = shortOrg
      ? `${org}（${shortOrg}編成）`
      : org
        ? `${org.length}人: ${org}`
        : '不明'

    return {
      id: village.id,
      name: village.name,
      participantCount,
      organization,
      winCamp: village.win_camp?.name ?? '廃村'
    }
  })
})

const loadVillages = async () => {
  loading.value = true
  try {
    const villageStatusList: string[] = [VILLAGE_STATUS.COMPLETED]
    if (includeCancelVillage.value) {
      villageStatusList.push(VILLAGE_STATUS.CANCEL)
    }

    const response = await apiCall<VillagesView>('/village/list', {
      params: {
        village_status: villageStatusList,
        is_auto_generate: true
      }
    })
    villages.value = response.list ?? []
  } catch {
    console.error('Failed to fetch village list')
  } finally {
    loading.value = false
  }
}

const handleIncludeCancelChange = () => {
  loadVillages()
}

onMounted(() => {
  loadVillages()
})

useSeoMeta({
  title: '終了した村一覧 | HOWLING WOLF',
  description: 'HOWLING WOLFで終了した人狼ゲーム村の一覧を表示します。'
})
</script>
