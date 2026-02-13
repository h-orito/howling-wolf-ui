<template>
  <div>
    <!-- サイドバー本体 -->
    <div
      class="fixed top-0 left-0 z-20 h-[calc(100dvh-2rem-env(safe-area-inset-bottom))] overflow-x-hidden overflow-y-auto bg-[#363636] text-white transition-all duration-200 md:static md:h-dvh md:w-[280px] md:p-2.5"
      :class="{ 'w-[280px] p-2.5': isOpen, 'w-0': !isOpen }"
    >
      <!-- 村名 -->
      <h1 class="mb-4 text-left text-base font-bold text-white">
        {{ village?.name ?? '' }}
      </h1>

      <!-- メニュー項目 -->
      <div class="text-left">
        <!-- 村の設定 -->
        <button
          class="flex w-full cursor-pointer items-center py-2.5 text-sm text-white no-underline hover:text-blue-400"
          @click="openVillageInfoModal"
        >
          <Icon name="i-heroicons-information-circle" class="h-4 w-4" />
          <span class="ml-2">村の設定</span>
        </button>

        <!-- 参加者リスト -->
        <Accordion
          :items="[
            {
              label: `参加者（${personCount}人）`,
              slot: 'participants',
              defaultOpen: false,
              icon: 'i-heroicons-users'
            }
          ]"
        >
          <template #participants>
            <ParticipantList @chara-filter="handleCharaFilter" />
          </template>
        </Accordion>

        <!-- メモ -->
        <button
          class="flex w-full cursor-pointer items-center py-2.5 text-sm text-white no-underline hover:text-blue-400"
          @click="openMemoModal"
        >
          <Icon name="i-heroicons-document-text" class="h-4 w-4" />
          <span class="ml-2">メモ</span>
        </button>

        <!-- ユーザ設定 -->
        <button
          class="flex w-full cursor-pointer items-center py-2.5 text-sm text-white no-underline hover:text-blue-400"
          @click="openUserSettingsModal"
        >
          <Icon name="i-heroicons-cog-6-tooth" class="h-4 w-4" />
          <span class="ml-2">ユーザ設定</span>
        </button>

        <!-- ツイート -->
        <a
          :href="twitterShareUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex w-full cursor-pointer items-center py-2.5 text-sm text-white no-underline hover:text-blue-400"
        >
          <Icon name="twitter" class="h-4 w-4" />
          <span class="ml-2">ツイート</span>
        </a>

        <!-- トップページ -->
        <NuxtLink
          :to="{ path: '/' }"
          class="flex w-full cursor-pointer items-center py-2.5 text-sm text-white no-underline hover:text-blue-400"
        >
          <Icon name="i-heroicons-home" class="h-4 w-4" />
          <span class="ml-2">トップページ</span>
        </NuxtLink>

        <!-- Google Adsense -->
        <GoogleAdsSidebar />
      </div>

      <!-- モバイル用閉じるボタン -->
      <div v-if="isMobile" class="absolute top-1 right-1">
        <UiButton
          color="secondary"
          variant="solid"
          icon="i-heroicons-x-mark-20-solid"
          @click="close"
        />
      </div>
    </div>

    <!-- サイドバー外側の背景（モバイルのみ） -->
    <div
      v-if="isMobile"
      class="fixed top-0 right-0 z-20 h-dvh w-[calc(100%-280px)] bg-gray-900/40"
      :class="{ block: isOpen, hidden: !isOpen }"
      @click="close"
    ></div>

    <!-- モーダル -->
    <ModalVillageInfo
      :is-open="isOpenVillageInfoModal"
      @close="closeVillageInfoModal"
    />
    <ModalUserSettings
      :is-open="isOpenUserSettingsModal"
      @close="closeUserSettingsModal"
    />
    <ModalMemo :is-open="isOpenMemoModal" @close="closeMemoModal" />
  </div>
</template>

<script setup lang="ts">
import Icon from '~/components/ui/icon/Icon.vue'
import UiButton from '~/components/ui/button/index.vue'
import Accordion from '~/components/ui/accordion/Accordion.vue'
import GoogleAdsSidebar from '~/components/layout/GoogleAdsSidebar.vue'
import { useVillage } from '~/composables/village/useVillage'
import { useVillageSlider } from '~/composables/village/useVillageSlider'
import { useWindowResize } from '~/composables/useWindowResize'

// 遅延ローディング
const ParticipantList = defineAsyncComponent(
  () => import('~/components/pages/village/sidebar/ParticipantList.vue')
)
const ModalVillageInfo = defineAsyncComponent(
  () => import('~/components/pages/village/sidebar/ModalVillageInfo.vue')
)
const ModalUserSettings = defineAsyncComponent(
  () => import('~/components/pages/village/sidebar/ModalUserSettings.vue')
)
const ModalMemo = defineAsyncComponent(
  () => import('~/components/pages/village/sidebar/ModalMemo.vue')
)

// Composables
const { village } = useVillage()
const { isOpen, close } = useVillageSlider()
const { isMobile } = useWindowResize()

// State
const isOpenVillageInfoModal = ref(false)
const isOpenUserSettingsModal = ref(false)
const isOpenMemoModal = ref(false)

// Computed
const personCount = computed(() => {
  if (!village.value) return '0'
  const participantCount = village.value.participant.count
  const spectatorCount = village.value.spectator.count
  if (spectatorCount > 0) {
    return `${participantCount}+${spectatorCount}`
  }
  return `${participantCount}`
})

const twitterShareUrl = computed(() => {
  const villageName = village.value?.name || ''
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const text = encodeURIComponent(`${villageName}\n${url}`)
  const hashtags = encodeURIComponent('人狼_HOWLING_WOLF')
  return `https://twitter.com/share?text=${text}&hashtags=${hashtags}`
})

// Methods
const openVillageInfoModal = () => {
  isOpenVillageInfoModal.value = true
}

const closeVillageInfoModal = () => {
  isOpenVillageInfoModal.value = false
}

const openUserSettingsModal = () => {
  isOpenUserSettingsModal.value = true
}

const closeUserSettingsModal = () => {
  isOpenUserSettingsModal.value = false
}

const openMemoModal = () => {
  isOpenMemoModal.value = true
}

const closeMemoModal = () => {
  isOpenMemoModal.value = false
}

const handleCharaFilter = () => {
  if (isMobile.value) {
    close()
  }
}
</script>
