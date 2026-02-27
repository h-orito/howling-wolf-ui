<template>
  <div class="mb-4">
    <!-- 生存参加者 -->
    <div v-if="isProgress" class="border-t border-gray-600 pt-1 pb-1">
      生存（{{ aliveParticipantList.length }}人）
    </div>
    <div
      v-for="participant in aliveParticipantList"
      :key="participant.id"
      class="flex border-t border-gray-600 pt-1 pb-1"
    >
      <div class="mr-2 shrink-0">
        <CharaImage :chara="participant.chara" :is-small="true" />
      </div>
      <div class="flex flex-1 flex-col text-xs">
        <div class="mb-1 flex">
          <p>{{ charaName(participant) }}</p>
          <p
            v-if="comingout(participant)"
            class="ml-1 rounded border border-gray-400 px-1 py-0.5 text-xs"
          >
            {{ comingout(participant) }}
          </p>
          <p class="flex-1 text-right">
            <button
              type="button"
              class="text-blue-400 hover:font-bold hover:text-blue-300"
              @click="handleFilterClick(participant.id)"
            >
              抽出
            </button>
          </p>
        </div>
        <div class="mb-0 flex text-gray-400">
          <p :class="charaStatusClass(participant)">
            {{ charaStatus(participant) }}
          </p>
          <p class="flex-1 text-right">{{ remainingCount(participant) }}</p>
        </div>
      </div>
    </div>

    <!-- 死亡参加者 -->
    <div v-if="isProgress && deadParticipantList.length > 0">
      <div class="border-t border-gray-600 pt-1 pb-1">
        死亡（{{ deadParticipantList.length }}人）
      </div>
      <div
        v-for="participant in deadParticipantList"
        :key="participant.id"
        class="flex border-t border-gray-600 pt-1 pb-1"
      >
        <div class="mr-2 shrink-0">
          <CharaImage :chara="participant.chara" :is-small="true" />
        </div>
        <div class="flex flex-1 flex-col text-xs">
          <div class="mb-1 flex">
            <p>{{ charaName(participant) }}</p>
            <p
              v-if="comingout(participant)"
              class="ml-1 rounded border border-gray-400 px-1 py-0.5 text-xs"
            >
              {{ comingout(participant) }}
            </p>
            <p class="flex-1 text-right">
              <button
                type="button"
                class="text-blue-400 hover:font-bold hover:text-blue-300"
                @click="handleFilterClick(participant.id)"
              >
                抽出
              </button>
            </p>
          </div>
          <div class="mb-0 flex text-gray-400">
            <p :class="charaStatusClass(participant)">
              {{ charaStatus(participant) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 見学者 -->
    <div v-if="spectatorList.length > 0">
      <div class="border-t border-gray-600 pt-1 pb-1">
        見学（{{ spectatorList.length }}人）
      </div>
      <div
        v-for="participant in spectatorList"
        :key="participant.id"
        class="flex border-t border-gray-600 pt-1 pb-1"
      >
        <div class="mr-2 shrink-0">
          <CharaImage :chara="participant.chara" :is-small="true" />
        </div>
        <div class="flex flex-1 flex-col text-xs">
          <div class="mb-1 flex">
            <p>{{ charaName(participant) }}</p>
            <p class="flex-1 text-right">
              <button
                type="button"
                class="text-blue-400 hover:font-bold hover:text-blue-300"
                @click="handleFilterClick(participant.id)"
              >
                抽出
              </button>
            </p>
          </div>
          <div class="mb-0 flex text-gray-400">
            <p :class="charaStatusClass(participant)">
              {{ charaStatus(participant) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 参加者なし -->
    <p
      v-if="
        aliveParticipantList.length === 0 &&
        deadParticipantList.length === 0 &&
        spectatorList.length === 0
      "
      class="py-2 text-gray-500"
    >
      参加者なし
    </p>
  </div>
</template>

<script setup lang="ts">
import { useVillage } from '~/composables/village/useVillage'
import { useMessage } from '~/composables/village/useMessage'
import { useUserSettings } from '~/composables/village/useUserSettings'
import { useVillageMessageFilter } from '~/composables/village/useVillageMessageFilter'
import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'
import CharaImage from '~/components/pages/village/CharaImage.vue'
import type { VillageParticipantView, ComingOut } from '~/lib/api/types'

// 定数
const MAX_CHARA_NAME_LENGTH = 20

// Composables (トップレベルで定義)
const router = useRouter()

// Emits
const emit = defineEmits<{
  'chara-filter': [participantId: number]
}>()

// Composables
const { village, villageId } = useVillage()
const { messages } = useMessage()
const { operation } = useUserSettings()

// Computed
const isProgress = computed(() => {
  const statusCode = village.value?.status.code
  return (
    statusCode !== VILLAGE_STATUS.PROLOGUE &&
    statusCode !== VILLAGE_STATUS.CANCEL
  )
})

const participantList = computed(
  () =>
    (village.value?.participant.member_list ?? []) as VillageParticipantView[]
)

const aliveParticipantList = computed(() => {
  return participantList.value.filter((p) => !p.dead)
})

const deadParticipantList = computed(() => {
  return participantList.value
    .filter((p) => !!p.dead)
    .slice()
    .sort((vp1, vp2) => compareParticipant(vp1, vp2))
})

const spectatorList = computed(
  () => (village.value?.spectator.member_list ?? []) as VillageParticipantView[]
)

// Methods
const compareParticipant = (
  vp1: VillageParticipantView,
  vp2: VillageParticipantView
): number => {
  const vp1isDead = !!vp1.dead
  const vp2isDead = !!vp2.dead
  if (vp1isDead && !vp2isDead) return 1
  if (!vp1isDead && vp2isDead) return -1
  if (!vp1isDead && !vp2isDead) return 0
  const vp1DeadDay = vp1.dead!.village_day.day
  const vp2DeadDay = vp2.dead!.village_day.day
  if (vp1DeadDay !== vp2DeadDay) return vp1DeadDay - vp2DeadDay
  const vp1DeadReason = vp1.dead!.reason
  const vp2DeadReason = vp2.dead!.reason
  return deadReasonPriority(vp2DeadReason) - deadReasonPriority(vp1DeadReason)
}

const deadReasonPriority = (reason: string): number => {
  if (reason === '突然') return 2
  if (reason === '処刑') return 1
  return 0
}

const charaName = (participant: VillageParticipantView): string => {
  const fullName = participant.chara.chara_name.name
  if (fullName.length < MAX_CHARA_NAME_LENGTH) return fullName
  return fullName.substring(0, MAX_CHARA_NAME_LENGTH) + '...'
}

const comingout = (participant: VillageParticipantView): string | null => {
  const colist = participant.coming_outs.list
  if (colist.length === 0) return null
  return colist.map((co: ComingOut) => co.skill.short_name).join(',') + 'CO'
}

const charaStatus = (participant: VillageParticipantView): string => {
  if (!participant.dead) return ''
  const day = participant.dead.village_day.day
  const reason = participant.dead.reason
  return `${day}d${reason}`
}

const charaStatusClass = (participant: VillageParticipantView): string => {
  if (!participant.dead) return ''
  const reason = participant.dead.reason
  if (reason === '突然' || reason === '処刑') return 'text-blue-400'
  return 'text-red-400'
}

const remainingCount = (participant: VillageParticipantView): string => {
  const sayCount = getSayCount(participant.id)
  return `${sayCount}回発言`
}

const getSayCount = (participantId: number): number => {
  if (!messages.value) return 0
  return messages.value.today_message_count_map[participantId] ?? 0
}

const handleFilterClick = (participantId: number): void => {
  const isNewTab = operation.value.isOpenFilterNewtab

  if (isNewTab) {
    // 新規タブで開く
    const route = router.resolve({
      path: '/village',
      query: {
        id: villageId.value?.toString(),
        filterId: participantId.toString()
      }
    })
    window.open(route.href, '_blank')
  } else {
    // 同じタブで抽出
    const { filterByParticipant } = useVillageMessageFilter()
    const { loadMessages } = useMessage()
    filterByParticipant(participantId)
    loadMessages()
  }

  // サイドバーを閉じるためにイベントをemit
  emit('chara-filter', participantId)
}
</script>
