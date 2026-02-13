<template>
  <section class="py-8">
    <div class="container mx-auto px-4">
      <LoadingSpinner
        v-if="loadingRecords"
        message="戦績を読み込み中..."
        :fixed="true"
      />
      <div v-if="!loadingRecords && playerRecords">
        <h1 v-if="playerName" class="mb-8 text-xl font-semibold">
          {{ playerName }}
        </h1>

        <!-- 自己紹介 -->
        <div class="mb-8">
          <h2 class="mb-4 text-lg font-semibold">自己紹介</h2>
          <div class="rounded-lg bg-white p-4 shadow">
            <p class="mb-4 text-sm text-gray-700">
              他人狼サイトでのID: {{ otherSiteName || '未登録' }}
            </p>
            <div v-if="introduction" class="text-sm text-gray-700">
              <p
                v-for="(intro, index) in escapeAndSplitMessage(introduction)"
                :key="index"
                class="wrap-break-word"
                v-html="intro"
              ></p>
            </div>
            <div v-else class="text-sm text-gray-500">
              自己紹介が登録されていません
            </div>
            <UiButton
              v-if="isMyself"
              class="mt-4"
              color="primary"
              size="sm"
              @click="isModalOpen = true"
            >
              編集する
            </UiButton>
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <!-- 総合戦績 -->
          <div>
            <h2 class="mb-4 text-lg font-semibold">総合戦績</h2>
            <div class="rounded-lg bg-white p-4 shadow">
              <div class="flex flex-col items-center">
                <DoughnutChart
                  :win-count="playerRecords.whole_record.win_count"
                  :lose-count="playerRecords.whole_record.lose_count"
                  label="全体"
                  :size="120"
                />
                <p class="mt-3 text-sm text-gray-700">{{ wholeResult }}</p>
              </div>
            </div>
          </div>

          <!-- 陣営戦績 -->
          <div>
            <h2 class="mb-4 text-lg font-semibold">陣営戦績</h2>
            <div class="rounded-lg bg-white p-4 shadow">
              <div class="grid grid-cols-2 gap-4">
                <div
                  v-for="campRecord in playerRecords.camp_record_list"
                  :key="campRecord.camp.code"
                  class="flex flex-col items-center"
                >
                  <DoughnutChart
                    :win-count="campRecord.win_count"
                    :lose-count="campRecord.lose_count"
                    :label="campRecord.camp.name"
                    :size="100"
                  />
                  <p class="mt-2 text-xs text-gray-600">
                    {{ campResult(campRecord) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 役職戦績 -->
        <div class="mt-8">
          <h2 class="mb-4 text-lg font-semibold">役職戦績</h2>
          <div class="rounded-lg bg-white p-4 shadow">
            <div class="grid grid-cols-4 gap-4">
              <div
                v-for="skillRecord in playerRecords.skill_record_list"
                :key="skillRecord.skill.code"
                class="flex flex-col items-center"
              >
                <DoughnutChart
                  :win-count="skillRecord.win_count"
                  :lose-count="skillRecord.lose_count"
                  :label="skillRecord.skill.name"
                  :size="80"
                />
                <p class="mt-2 text-xs text-gray-600">
                  {{ skillResult(skillRecord) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 参加した村 -->
        <div class="mt-8">
          <h2 class="mb-4 text-xl font-semibold">参加した村</h2>
          <div class="overflow-hidden rounded-lg bg-white shadow">
            <table class="min-w-full divide-y divide-gray-200 text-xs">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-2 py-2 text-left font-semibold text-gray-900">
                    村名
                  </th>
                  <th class="px-2 py-2 text-left font-semibold text-gray-900">
                    人数
                  </th>
                  <th class="px-2 py-2 text-left font-semibold text-gray-900">
                    キャラ
                  </th>
                  <th class="px-2 py-2 text-left font-semibold text-gray-900">
                    役職
                  </th>
                  <th class="px-2 py-2 text-left font-semibold text-gray-900">
                    生死
                  </th>
                  <th class="px-2 py-2 text-left font-semibold text-gray-900">
                    陣営
                  </th>
                  <th class="px-2 py-2 text-left font-semibold text-gray-900">
                    勝敗
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr
                  v-for="pv in playerRecords.participate_village_list"
                  :key="pv.village.village_id"
                >
                  <td class="px-2 py-2 text-left">
                    <NuxtLink
                      :to="`/village?id=${pv.village.village_id}`"
                      class="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {{ pv.village.village_name }}
                    </NuxtLink>
                  </td>
                  <td class="px-2 py-2 text-gray-900">
                    {{ pv.village.participant_count }}人
                  </td>
                  <td class="px-2 py-2 text-gray-900">
                    {{ pv.chara_name.name }}
                  </td>
                  <td class="px-2 py-2 text-gray-900">
                    {{ pv.skill_name ?? '-' }}
                  </td>
                  <td class="px-2 py-2 text-gray-900">
                    {{ getStatus(pv) }}
                  </td>
                  <td class="px-2 py-2 text-gray-900">
                    {{ pv.camp_name ?? '' }}
                  </td>
                  <td class="px-2 py-2">
                    <span
                      v-if="pv.win_status === '勝利'"
                      class="font-medium text-blue-600"
                    >
                      勝利
                    </span>
                    <span
                      v-else-if="pv.win_status === '敗北'"
                      class="font-medium text-red-600"
                    >
                      敗北
                    </span>
                    <span v-else class="text-gray-500">{{
                      pv.win_status
                    }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- データなし -->
      <div
        v-if="!loadingRecords && !playerRecords"
        class="rounded-lg bg-white p-8 shadow"
      >
        <div class="text-center text-gray-500">
          <p>プレイヤー情報が見つかりませんでした</p>
        </div>
      </div>
    </div>

    <!-- 自己紹介編集モーダル -->
    <ModalIntro
      v-if="playerRecords"
      v-model="isModalOpen"
      :current-nickname="playerRecords.player.nickname"
      :current-other-site-name="playerRecords.player.other_site_name"
      :current-intro="playerRecords.player.introduction"
      :blacklist-players="blacklistPlayers"
      @refresh="refresh"
      @remove-blacklist="removeBlacklist"
    />
  </section>
</template>

<script setup lang="ts">
import type {
  PlayerRecordsView,
  CampRecord,
  SkillRecord,
  ParticipateVillageView,
  PlayerView
} from '~/lib/api/types'

const DoughnutChart = defineAsyncComponent(
  () => import('~/components/pages/player-record/DoughnutChart.vue')
)
const ModalIntro = defineAsyncComponent(
  () => import('~/components/pages/player-record/ModalIntro.vue')
)

const route = useRoute()
const playerId = computed(() => route.query.id as string | undefined)

const { apiCall } = useApi()
const { myselfPlayer } = useAuth()

useHead({
  title: 'ユーザ戦績'
})

const playerRecords = ref<PlayerRecordsView | null>(null)
const loadingRecords = ref(false)
const isModalOpen = ref(false)

const playerName = computed(() => {
  if (!playerRecords.value) return ''
  const player = playerRecords.value.player
  if (player.twitter_user_name) {
    return `${player.nickname}@${player.twitter_user_name}`
  }
  return player.nickname
})

const otherSiteName = computed(() => {
  if (!playerRecords.value) return null
  return playerRecords.value.player.other_site_name
})

const introduction = computed(() => {
  if (!playerRecords.value) return null
  return playerRecords.value.player.introduction
})

const wholeResult = computed(() => {
  if (!playerRecords.value) return ''
  const r = playerRecords.value.whole_record
  return titleString(r.win_count, r.lose_count)
})

const isMyself = computed(() => {
  if (!myselfPlayer.value || !playerRecords.value) return false
  return myselfPlayer.value.id === playerRecords.value.player.id
})

const blacklistPlayers = computed<PlayerView[]>(() => {
  if (!isMyself.value || !myselfPlayer.value) return []
  return myselfPlayer.value.blacklist_players
})

const titleString = (winCount: number, loseCount: number) => {
  const total = winCount + loseCount
  const winRate = total > 0 ? Math.round((winCount / total) * 100) : 0
  return `${winCount}勝${loseCount}負 (${winRate}%)`
}

const campResult = (campRecord: CampRecord) => {
  return titleString(campRecord.win_count, campRecord.lose_count)
}

const skillResult = (skillRecord: SkillRecord) => {
  return titleString(skillRecord.win_count, skillRecord.lose_count)
}

const getStatus = (pv: ParticipateVillageView) => {
  if (!pv.dead) return '生存'
  return `${pv.dead.village_day.day}d ${pv.dead.reason}死`
}

const escapeAndSplitMessage = (message: string): string[] => {
  return message
    .replace(/(\r\n|\n|\r)/gm, '<br>')
    .split('<br>')
    .map((item) => {
      return item
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
    })
}

const loadRecord = async () => {
  if (!playerId.value) {
    console.error('プレイヤーIDが指定されていません')
    return
  }

  loadingRecords.value = true
  try {
    const response = await apiCall<PlayerRecordsView>(
      `/player/${playerId.value}/record`
    )
    playerRecords.value = response
  } catch (error) {
    console.error('プレイヤー戦績の取得に失敗しました:', error)
    playerRecords.value = null
  } finally {
    loadingRecords.value = false
  }
}

const refresh = async () => {
  await loadRecord()
}

const removeBlacklist = async (targetPlayerId: number) => {
  try {
    await apiCall(`/player/blacklist/${targetPlayerId}`, {
      method: 'DELETE'
    })
    // プレイヤー情報を更新
    const { refreshAuth } = useAuth()
    await refreshAuth()
  } catch (error) {
    console.error('ブラックリスト解除に失敗しました:', error)
  }
}

onMounted(async () => {
  await loadRecord()
})
</script>
