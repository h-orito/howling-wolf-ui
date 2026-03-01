<template>
  <section class="bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="mb-4 text-xl font-semibold">キャラチップ一覧</h1>
      <div class="text-sm">
        <LoadingSpinner
          v-if="loading"
          message="キャラチップ一覧を読み込み中..."
        />

        <div
          v-else-if="displayCharachips.length > 0"
          class="overflow-hidden rounded-lg bg-white shadow"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  キャラチップ名
                </th>
                <th
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  作者
                </th>
                <th
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  例
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="charachip in displayCharachips" :key="charachip.id">
                <td
                  class="p-2 text-left text-sm whitespace-nowrap text-gray-900"
                >
                  <NuxtLink
                    :to="`/charachip?id=${charachip.id}`"
                    class="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {{ charachip.name }}
                  </NuxtLink>
                </td>
                <td
                  class="p-2 text-left text-sm whitespace-nowrap text-gray-900"
                >
                  {{ charachip.designer.name }}
                </td>
                <td class="p-2 whitespace-nowrap">
                  <PagesVillageCharaImage
                    v-for="chara in charachip.chara_list.slice(0, 1)"
                    :key="chara.id"
                    :chara="chara"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="rounded-lg bg-white p-8 shadow">
          <div class="text-center text-gray-500">
            <p>キャラチップがありません</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CharachipsView, CharachipView } from '~/lib/api/types'

const config = useRuntimeConfig()

const charachips = ref<CharachipView[]>([])
const loading = ref(true)

const displayCharachips = computed(() =>
  charachips.value.filter((c) => c.chara_list && c.chara_list.length > 0)
)

onMounted(async () => {
  try {
    const response = await $fetch<CharachipsView>(
      `${config.public.apiBaseUrl}/charachip/list`
    )
    charachips.value = response.list ?? []
  } catch {
    console.error('Failed to fetch charachip list')
  } finally {
    loading.value = false
  }
})

useSeoMeta({
  title: 'キャラチップ一覧 | HOWLING WOLF',
  description: 'HOWLING WOLFで使用できるキャラチップの一覧です。'
})
</script>
