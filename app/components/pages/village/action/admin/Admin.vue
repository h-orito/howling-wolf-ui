<template>
  <ActionPanel title="管理者メニュー" panel-key="admin">
    <!-- 強制退出（available_kickの場合のみ表示） -->
    <div v-if="adminSituation?.available_kick" class="space-y-2">
      <p class="text-sm font-bold text-gray-700 dark:text-gray-300">強制退村</p>

      <!-- エラーメッセージ -->
      <div
        v-if="kickError"
        class="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
      >
        {{ kickError }}
      </div>

      <div class="flex items-center gap-2">
        <FormSelect
          v-model="selectedKickTargetId"
          :options="kickTargetOptions"
          placeholder="選択してください"
          size="sm"
          class="flex-1"
        />
        <UiButton
          color="error"
          size="sm"
          :disabled="selectedKickTargetId == null || kicking"
          :loading="kicking"
          @click="handleKick"
        >
          強制退村
        </UiButton>
      </div>

      <hr class="border-gray-300 dark:border-gray-600" />
    </div>

    <!-- 参加者がいない場合 -->
    <p
      v-if="!participantList.length"
      class="text-center text-gray-500 dark:text-gray-400"
    >
      参加者がいません
    </p>

    <!-- 参加者テーブル -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
              キャラ名
            </th>
            <th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
              Twitter
            </th>
            <th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
              役職
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in participantList"
            :key="p.name"
            class="border-t border-gray-200 dark:border-gray-600"
          >
            <td class="px-4 py-2">{{ p.name }}</td>
            <td class="px-4 py-2">
              <a
                v-if="p.twitter_user_name"
                :href="`https://twitter.com/${p.twitter_user_name}`"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:underline dark:text-(--ui-primary)"
              >
                {{ p.nickname }}@{{ p.twitter_user_name }}
              </a>
              <span v-else>{{ p.nickname }}</span>
            </td>
            <td class="px-4 py-2">{{ p.skill_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </ActionPanel>
</template>

<script setup lang="ts">
import type { FetchError } from 'ofetch'
import ActionPanel from '../ActionPanel.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import UiButton from '~/components/ui/button/index.vue'
import { useSituation } from '~/composables/village/useSituation'
import { useVillage } from '~/composables/village/useVillage'

const emit = defineEmits<{
  complete: []
}>()

// Composables
const { situation } = useSituation()
const { villageId, village } = useVillage()
const { apiCall } = useApi()

// 管理者状況
const adminSituation = computed(() => situation.value?.admin ?? null)

// 参加者一覧
const participantList = computed(
  () => adminSituation.value?.participant_list ?? []
)

// 強制退出関連
const selectedKickTargetId = ref<number | null>(null)
const kicking = ref(false)
const kickError = ref<string | null>(null)

// 強制退出対象リスト（村の参加者メンバーリスト）
const kickTargetOptions = computed(() => {
  const members = village.value?.participant.member_list ?? []
  return members.map((m) => ({
    value: m.id,
    label: m.chara.chara_name.full_name
  }))
})

// 強制退出実行
const handleKick = async () => {
  if (selectedKickTargetId.value == null) return

  kicking.value = true
  kickError.value = null

  try {
    await apiCall(`/admin/village/${villageId.value}/kick`, {
      method: 'POST',
      body: {
        target_id: selectedKickTargetId.value
      }
    })
    selectedKickTargetId.value = null
    emit('complete')
  } catch (err) {
    if (err instanceof Error) {
      const fetchError = err as FetchError<{
        message?: string
        status?: number
      }>
      if (fetchError.statusCode === 499 || fetchError.data?.status === 499) {
        kickError.value = fetchError.data?.message ?? 'エラーが発生しました'
      } else {
        kickError.value = err.message
      }
    } else {
      kickError.value = 'エラーが発生しました'
    }
    console.error('Kick API error:', err)
  } finally {
    kicking.value = false
  }
}
</script>
