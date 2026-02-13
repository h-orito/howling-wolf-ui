<template>
  <section class="bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="mb-4 text-xl font-semibold">
        キャラチップ: {{ charachip ? charachip.name : '' }}
      </h1>

      <div v-if="charachip" class="mb-5">
        <p class="text-sm text-gray-700">作者: {{ charachip.designer.name }}</p>
        <a
          v-if="charachip.designer.name"
          :href="`https://google.com/search?q=${encodeURIComponent(charachip.designer.name)}`"
          target="_blank"
          class="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          作者を検索
        </a>
      </div>

      <div class="text-sm">
        <LoadingSpinner v-if="loading" message="キャラチップを読み込み中..." />

        <div
          v-if="!loading && charachip"
          class="flex flex-wrap justify-center gap-4"
        >
          <div
            v-for="chara in charachip.chara_list"
            :key="chara.id"
            class="rounded-2xl border border-gray-300 bg-white p-3 text-center shadow-sm"
            style="width: 300px"
          >
            <div class="mb-2 flex justify-center gap-1">
              <PagesVillageCharaImage
                v-for="face in chara.face_list"
                :key="face.type"
                :chara="chara"
                :face-type="face.type"
              />
            </div>
            <p class="text-xs">{{ chara.chara_name.name }}</p>
          </div>
        </div>

        <div
          v-if="!loading && !charachip"
          class="rounded-lg bg-white p-8 shadow"
        >
          <div class="text-center text-gray-500">
            <p>キャラチップが見つかりませんでした</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CharachipView } from '~/lib/api/types'

const config = useRuntimeConfig()
const route = useRoute()
const charachipId = computed(() => route.query.id as string | undefined)

const charachip = ref<CharachipView | null>(null)
const loading = ref(true)

onMounted(async () => {
  if (!charachipId.value) {
    loading.value = false
    return
  }

  try {
    const response = await $fetch<CharachipView>(
      `${config.public.apiBaseUrl}/charachip/${charachipId.value}`
    )
    charachip.value = response
  } catch {
    console.error('Failed to fetch charachip')
    charachip.value = null
  } finally {
    loading.value = false
  }
})

useSeoMeta({
  title: computed(() =>
    charachip.value
      ? `キャラチップ: ${charachip.value.name} | HOWLING WOLF`
      : 'キャラチップ | HOWLING WOLF'
  ),
  description: 'HOWLING WOLFで使用できるキャラチップの詳細です。'
})
</script>
