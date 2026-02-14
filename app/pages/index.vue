<template>
  <div class="menu-wrap">
    <!-- スポットライト -->
    <PagesIndexSpotlight />

    <!-- イントロ -->
    <PagesIndexIntro />

    <!-- プレイヤー統計 -->
    <PagesIndexPlayerStats
      :user="auth.myselfPlayer.value"
      :is-loading="loadingAuth"
      :participate-villages="participateVillages"
      @signin-with-twitter="signinWithTwitter"
      @signin-with-google="signinWithGoogle"
      @link-with-twitter="linkWithTwitter"
      @link-with-google="linkWithGoogle"
      @logout="handleLogout"
    />

    <!-- 村一覧 -->
    <div class="menu-area">
      <div v-if="isLoadingVillages" class="flex justify-center py-8">
        <Icon name="spinner" class="animate-spin text-4xl" />
      </div>
      <div v-else>
        <h2 class="spotlight-shadow mb-8 text-2xl font-semibold">開催中の村</h2>
        <div v-if="villages.length > 0" class="mb-8 grid gap-4 md:grid-cols-2">
          <PagesIndexVillageCard
            v-for="village in villages"
            :key="village.id"
            :village="village"
          />
        </div>
        <p v-else class="mb-8 text-gray-400">現在開催中の村はありません</p>

        <div class="grid gap-4 md:grid-cols-2">
          <PagesIndexSpotlightButton to="/village-list">
            終了した村
          </PagesIndexSpotlightButton>
        </div>
      </div>
    </div>

    <!-- 予約村 -->
    <div class="menu-area">
      <div v-if="isLoadingReservedVillages" class="flex justify-center py-8">
        <Icon name="spinner" class="animate-spin text-4xl" />
      </div>
      <div v-else>
        <h2 class="spotlight-shadow mb-8 text-2xl font-semibold">
          作成される予定の村
        </h2>
        <div
          v-if="reservedVillages.length > 0"
          class="mb-4 grid gap-4 md:grid-cols-2"
        >
          <PagesIndexReservedVillageCard
            v-for="rv in reservedVillages"
            :key="rv.id"
            :reserved-village="rv"
          />
        </div>
        <p v-else class="text-gray-400">作成予定の村はありません</p>
      </div>
    </div>

    <!-- キャラチップ -->
    <PagesIndexCharachip />

    <!-- フッター -->
    <IndexFooter />
  </div>
</template>

<script setup lang="ts">
import Icon from '~/components/ui/icon/Icon.vue'
import IndexFooter from '~/components/pages/index/IndexFooter.vue'
import type {
  VillagesView,
  VillageView,
  ReservedVillagesView,
  ReservedVillageView
} from '~/lib/api/types'
import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'

// トップページはtitleTemplateを無効化
useHead({
  title: 'HOWLING WOLF',
  titleTemplate: ''
})

useSeoMeta({
  description:
    'HOWLING WOLFで長期人狼ゲームを無料でプレイ。進行中の村への参加、過去の村の閲覧ができます。',
  ogTitle: 'HOWLING WOLF',
  ogDescription:
    'HOWLING WOLFで長期人狼ゲームを無料でプレイ。進行中の村への参加、過去の村の閲覧ができます。'
})

const { apiCall } = useApi()

// State
const isLoadingVillages = ref(false)
const isLoadingReservedVillages = ref(false)
const villages = ref<VillageView[]>([])
const reservedVillages = ref<ReservedVillageView[]>([])
const loadingAuth = ref(true)
const participateVillages = ref<VillageView[]>([])

// 村データ取得
const fetchVillages = async () => {
  isLoadingVillages.value = true
  try {
    const response = await apiCall<VillagesView>('/village/list', {
      params: {
        village_status: [
          VILLAGE_STATUS.PROLOGUE,
          VILLAGE_STATUS.IN_PROGRESS,
          VILLAGE_STATUS.EPILOGUE
        ],
        is_auto_generate: true
      }
    })
    villages.value = response.list ?? []
  } catch (err) {
    console.error('Failed to fetch villages:', err)
  } finally {
    isLoadingVillages.value = false
  }
}

// 予約村取得
const fetchReservedVillages = async () => {
  isLoadingReservedVillages.value = true
  try {
    const response = await apiCall<ReservedVillagesView>(
      '/reserved-village/list?limit=3'
    )
    reservedVillages.value = response.list ?? []
  } catch (err) {
    console.error('Failed to fetch reserved villages:', err)
  } finally {
    isLoadingReservedVillages.value = false
  }
}

// 参加中の村取得
const fetchParticipateVillages = async () => {
  try {
    const response = await apiCall<VillagesView>('/village/list', {
      params: {
        village_status: [
          VILLAGE_STATUS.PROLOGUE,
          VILLAGE_STATUS.IN_PROGRESS,
          VILLAGE_STATUS.EPILOGUE
        ],
        is_auto_generate: true
      }
    })
    participateVillages.value = response.list ?? []
  } catch {
    // 参加中の村の取得失敗は無視
  }
}

// 認証処理
const auth = useAuth()

const signinWithTwitter = async () => {
  try {
    const result = await auth.signInWithTwitter()
    if (result?.user) {
      await auth.registerUserIfNeeded(result)
      await auth.refreshAuth()
      window.location.reload()
    }
  } catch (err) {
    console.error('Twitter sign in failed:', err)
  }
}

const signinWithGoogle = async () => {
  try {
    const result = await auth.signInWithGoogle()
    if (result?.user) {
      await auth.registerUserIfNeeded(result)
      await auth.refreshAuth()
      window.location.reload()
    }
  } catch (err) {
    console.error('Google sign in failed:', err)
  }
}

const linkWithTwitter = async () => {
  try {
    const result = await auth.linkWithTwitter()
    if (result) {
      await auth.refreshAuth()
      window.location.reload()
    }
  } catch (err) {
    console.error('Twitter link failed:', err)
  }
}

const linkWithGoogle = async () => {
  try {
    const result = await auth.linkWithGoogle()
    if (result) {
      await auth.refreshAuth()
      window.location.reload()
    }
  } catch (err) {
    console.error('Google link failed:', err)
  }
}

const handleLogout = async () => {
  try {
    await auth.logout()
    window.location.reload()
  } catch (err) {
    console.error('Logout failed:', err)
  }
}

// 初期データ取得
onMounted(async () => {
  // 認証を初期化して待機
  auth.initializeAuth()
  const firebaseUser = await auth.waitForAuth()

  // 認証済みの場合、プレイヤー情報を取得
  if (firebaseUser) {
    await auth.refreshAuth()
    await fetchParticipateVillages()
  }

  loadingAuth.value = false

  // 村一覧と予約村を並行取得
  await Promise.all([fetchVillages(), fetchReservedVillages()])
})
</script>

<style scoped>
.menu-wrap {
  background-color: #0a0a1a;
}

.menu-area {
  background: linear-gradient(#0a0a1a 0%, #112 50%, #0a0a1a 100%);
  color: white;
  padding: 30px;
  margin-bottom: 50px;
}

.menu-area:last-child {
  margin-bottom: 0;
}
</style>

<style>
.spotlight-shadow {
  text-shadow:
    2px 2px 5px rgba(69, 97, 133, 1),
    -2px 2px 5px rgba(69, 97, 133, 1),
    2px -2px 5px rgba(69, 97, 133, 1),
    -2px -2px 5px rgba(69, 97, 133, 1);
}
</style>
