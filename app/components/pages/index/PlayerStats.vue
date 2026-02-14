<template>
  <div class="menu-area">
    <div v-if="isLoading">
      <p class="spotlight-shadow">認証情報を読み込み中...</p>
    </div>
    <div v-else>
      <!-- 未ログイン時 -->
      <div v-if="!isLogin">
        <div class="mb-12">
          <p class="spotlight-shadow text-xl md:text-xl">
            アプリ連携すると参加できます
          </p>
        </div>
        <PagesIndexSpotlightButton @click="openSigninModal">
          <strong>ログイン</strong>
        </PagesIndexSpotlightButton>
      </div>

      <!-- ログイン時 -->
      <div v-else>
        <div class="spotlight-shadow mb-5">
          <p class="text-2xl">ようこそ</p>
          <p class="spotlight-shadow">{{ displayName }} さん</p>
          <p class="spotlight-shadow text-sm">
            ニックネームはマイページで変更できます
          </p>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <PagesIndexSpotlightButton :to="`/player-record?id=${user?.id}`">
            <Icon name="chart-bar" class="mr-2" />
            <strong>マイページ</strong>
          </PagesIndexSpotlightButton>
          <PagesIndexSpotlightButton @click="openLinkModal">
            <strong>他SNSアカウント連携</strong>
          </PagesIndexSpotlightButton>
          <PagesIndexSpotlightButton @click="handleLogout">
            <Icon name="right-from-bracket" class="mr-2" />
            <strong>ログアウト</strong>
          </PagesIndexSpotlightButton>
        </div>

        <!-- 参加中の村 -->
        <div v-if="participatingVillages.length > 0" class="mt-8">
          <div class="spotlight-shadow mb-5">
            <p class="text-xl">参加している村</p>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <PagesIndexVillageCard
              v-for="village in participatingVillages"
              :key="village.id"
              :village="village"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- モーダル -->
    <PagesIndexSigninModal v-model="isSigninModalOpen" @signin="handleSignin" />
    <PagesIndexLinkModal v-model="isLinkModalOpen" @link="handleLink" />
  </div>
</template>

<script setup lang="ts">
import Icon from '~/components/ui/icon/Icon.vue'
import type { MyselfPlayerView, VillageView } from '~/lib/api/types'
import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'

interface Props {
  user: MyselfPlayerView | null
  isLoading: boolean
  participateVillages: VillageView[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'signin-with-twitter': []
  'signin-with-google': []
  'link-with-twitter': []
  'link-with-google': []
  logout: []
}>()

const isLogin = computed(() => !!props.user)

const displayName = computed(() => {
  if (!props.user) return null
  const nickname = props.user.nickname
  const twitterUserName = props.user.twitter_user_name
  if (twitterUserName) {
    return `${nickname}@${twitterUserName}`
  }
  return nickname
})

const participatingVillages = computed<VillageView[]>(() => {
  return props.participateVillages.filter(
    (village) =>
      village.status.code === VILLAGE_STATUS.IN_PROGRESS ||
      village.status.code === VILLAGE_STATUS.EPILOGUE ||
      village.status.code === VILLAGE_STATUS.PROLOGUE
  )
})

// モーダル制御
const isSigninModalOpen = ref(false)
const isLinkModalOpen = ref(false)

const openSigninModal = () => {
  isSigninModalOpen.value = true
}

const openLinkModal = () => {
  isLinkModalOpen.value = true
}

const handleSignin = (provider: 'twitter' | 'google') => {
  isSigninModalOpen.value = false
  if (provider === 'twitter') {
    emit('signin-with-twitter')
  } else {
    emit('signin-with-google')
  }
}

const handleLink = (provider: 'twitter' | 'google') => {
  isLinkModalOpen.value = false
  if (provider === 'twitter') {
    emit('link-with-twitter')
  } else {
    emit('link-with-google')
  }
}

const handleLogout = () => {
  emit('logout')
}
</script>

<style scoped>
.menu-area {
  background: linear-gradient(#0a0a1a 0%, #112 50%, #0a0a1a 100%);
  color: white;
  padding: 30px;
  margin-bottom: 50px;
}
</style>
