<template>
  <div class="space-y-6 text-left">
    <!-- 発言種別 -->
    <section>
      <p class="mb-2 font-bold">発言種別</p>
      <div class="mb-2 flex gap-2 text-sm">
        <UiButton
          size="xs"
          variant="link"
          class="p-0"
          @click="handleAllMessageTypeOn"
        >
          全てON
        </UiButton>
        <span>/</span>
        <UiButton
          size="xs"
          variant="link"
          class="p-0"
          @click="handleAllMessageTypeOff"
        >
          全てOFF
        </UiButton>
        <span>/</span>
        <UiButton
          size="xs"
          variant="link"
          class="p-0"
          @click="handleReverseMessageType"
        >
          反転
        </UiButton>
      </div>

      <!-- 発言種別チェックボックス -->
      <div class="space-y-2">
        <FormCheckGroup
          :model-value="selectedMessageTypeGroups"
          :options="messageTypeOptionsRow1"
          @update:model-value="
            $emit('update:selectedMessageTypeGroups', $event)
          "
        />
        <FormCheckGroup
          :model-value="selectedMessageTypeGroups"
          :options="messageTypeOptionsRow2"
          @update:model-value="
            $emit('update:selectedMessageTypeGroups', $event)
          "
        />
        <FormCheckGroup
          :model-value="selectedMessageTypeGroups"
          :options="messageTypeOptionsRow3"
          @update:model-value="
            $emit('update:selectedMessageTypeGroups', $event)
          "
        />
      </div>
    </section>

    <!-- 発言者 -->
    <section>
      <p class="mb-2 font-bold">発言者</p>
      <div class="mb-2 flex gap-2 text-sm">
        <UiButton
          size="xs"
          variant="link"
          class="p-0"
          @click="handleAllParticipantOn"
        >
          全てON
        </UiButton>
        <span>/</span>
        <UiButton
          size="xs"
          variant="link"
          class="p-0"
          @click="handleAllParticipantOff"
        >
          全てOFF
        </UiButton>
        <span>/</span>
        <UiButton
          size="xs"
          variant="link"
          class="p-0"
          @click="handleReverseParticipant"
        >
          反転
        </UiButton>
      </div>

      <!-- 参加者リスト -->
      <div
        class="grid gap-0"
        :class="props.participantColumns === 1 ? 'grid-cols-1' : 'grid-cols-2'"
      >
        <div
          v-for="participant in participantList"
          :key="participant.id"
          class="border-t border-gray-300 py-1 dark:border-gray-600"
        >
          <FormCheckbox
            :model-value="isParticipantSelected(participant.id)"
            @update:model-value="toggleParticipant(participant.id, $event)"
          >
            <div class="flex items-center gap-2">
              <CharaImage :chara="participant.chara" :is-small="true" />
              <span class="text-xs">{{
                participant.chara.chara_name.name
              }}</span>
            </div>
          </FormCheckbox>
        </div>
      </div>
    </section>

    <!-- キーワード -->
    <section>
      <p class="mb-2 font-bold">キーワード</p>
      <FormInput
        :model-value="keyword ?? ''"
        size="sm"
        placeholder="スペース区切り"
        class="w-full"
        @update:model-value="$emit('update:keyword', $event || null)"
      />
    </section>

    <!-- 宛先 -->
    <section>
      <p class="mb-2 font-bold">宛先</p>
      <div class="mb-2 flex gap-1 text-sm">
        <UiButton
          size="xs"
          variant="link"
          class="p-0"
          @click="handleAllToParticipantOn"
        >
          全てON
        </UiButton>
        <span>/</span>
        <UiButton
          size="xs"
          variant="link"
          class="p-0"
          @click="handleAllToParticipantOff"
        >
          全てOFF
        </UiButton>
        <span>/</span>
        <UiButton
          size="xs"
          variant="link"
          class="p-0"
          @click="handleReverseToParticipant"
        >
          反転
        </UiButton>
        <template v-if="myself">
          <span>/</span>
          <UiButton
            size="xs"
            variant="link"
            class="p-0"
            @click="handleToMyParticipant"
          >
            自分宛
          </UiButton>
        </template>
      </div>

      <!-- 宛先参加者リスト -->
      <div
        class="grid gap-0"
        :class="props.participantColumns === 1 ? 'grid-cols-1' : 'grid-cols-2'"
      >
        <div
          v-for="participant in participantList"
          :key="participant.id"
          class="border-t border-gray-300 py-1 dark:border-gray-600"
        >
          <FormCheckbox
            :model-value="isToParticipantSelected(participant.id)"
            @update:model-value="toggleToParticipant(participant.id, $event)"
          >
            <div class="flex items-center gap-2">
              <CharaImage :chara="participant.chara" :is-small="true" />
              <span class="text-xs">{{
                participant.chara.chara_name.name
              }}</span>
            </div>
          </FormCheckbox>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  MESSAGE_TYPE_GROUP,
  ALL_MESSAGE_TYPE_GROUPS,
  type MessageTypeGroup
} from '~/lib/api/message-constants'
import { useVillage } from '~/composables/village/useVillage'
import { useSituation } from '~/composables/village/useSituation'
import UiButton from '~/components/ui/button/index.vue'
import FormInput from '~/components/ui/form/FormInput.vue'
import FormCheckbox from '~/components/ui/form/FormCheckbox.vue'
import FormCheckGroup from '~/components/ui/form/FormCheckGroup.vue'
import CharaImage from '../CharaImage.vue'

// Props
interface Props {
  selectedMessageTypeGroups: MessageTypeGroup[]
  selectedParticipantIds: number[]
  selectedToParticipantIds: number[]
  keyword: string | null
  /** 参加者リストの列数（1 or 2）。デフォルト: 2 */
  participantColumns?: 1 | 2
}

const props = withDefaults(defineProps<Props>(), {
  participantColumns: 2
})

// Emits
const emit = defineEmits<{
  'update:selectedMessageTypeGroups': [value: MessageTypeGroup[]]
  'update:selectedParticipantIds': [value: number[]]
  'update:selectedToParticipantIds': [value: number[]]
  'update:keyword': [value: string | null]
}>()

// Composables
const { allParticipants, allParticipantIds } = useVillage()
const { situation } = useSituation()

// Computed
const myself = computed(() => situation.value?.participate.myself ?? null)

const participantList = computed(() => allParticipants.value)

// メッセージタイプのオプション (3行×3列に分割)
const messageTypeOptionsRow1 = [
  { value: MESSAGE_TYPE_GROUP.NORMAL_SAY, label: '通常' },
  { value: MESSAGE_TYPE_GROUP.MONOLOGUE_SAY, label: '独り言' },
  { value: MESSAGE_TYPE_GROUP.SECRET_SAY, label: '秘話' }
]

const messageTypeOptionsRow2 = [
  { value: MESSAGE_TYPE_GROUP.CREATOR_SAY, label: '村建て' },
  { value: MESSAGE_TYPE_GROUP.WEREWOLF_SAY, label: '囁き' },
  { value: MESSAGE_TYPE_GROUP.GRAVE_SAY, label: '墓下見学' }
]

const messageTypeOptionsRow3 = [
  { value: MESSAGE_TYPE_GROUP.SYSTEM, label: '公開システム' },
  { value: MESSAGE_TYPE_GROUP.PRIVATE_SYSTEM, label: '非公開システム' }
]

// 発言種別の操作
const handleAllMessageTypeOn = () => {
  emit('update:selectedMessageTypeGroups', [...ALL_MESSAGE_TYPE_GROUPS])
}

const handleAllMessageTypeOff = () => {
  emit('update:selectedMessageTypeGroups', [])
}

const handleReverseMessageType = () => {
  emit(
    'update:selectedMessageTypeGroups',
    ALL_MESSAGE_TYPE_GROUPS.filter(
      (type) => !props.selectedMessageTypeGroups.includes(type)
    )
  )
}

// 発言者の選択状態確認と操作
const isParticipantSelected = (id: number): boolean => {
  return props.selectedParticipantIds.includes(id)
}

const toggleParticipant = (id: number, checked: boolean | string) => {
  const isChecked = typeof checked === 'boolean' ? checked : checked === 'true'
  if (isChecked) {
    if (!props.selectedParticipantIds.includes(id)) {
      emit('update:selectedParticipantIds', [
        ...props.selectedParticipantIds,
        id
      ])
    }
  } else {
    emit(
      'update:selectedParticipantIds',
      props.selectedParticipantIds.filter((i) => i !== id)
    )
  }
}

const handleAllParticipantOn = () => {
  emit('update:selectedParticipantIds', [...allParticipantIds.value])
}

const handleAllParticipantOff = () => {
  emit('update:selectedParticipantIds', [])
}

const handleReverseParticipant = () => {
  emit(
    'update:selectedParticipantIds',
    allParticipantIds.value.filter(
      (id) => !props.selectedParticipantIds.includes(id)
    )
  )
}

// 宛先の選択状態確認と操作
const isToParticipantSelected = (id: number): boolean => {
  return props.selectedToParticipantIds.includes(id)
}

const toggleToParticipant = (id: number, checked: boolean | string) => {
  const isChecked = typeof checked === 'boolean' ? checked : checked === 'true'
  if (isChecked) {
    if (!props.selectedToParticipantIds.includes(id)) {
      emit('update:selectedToParticipantIds', [
        ...props.selectedToParticipantIds,
        id
      ])
    }
  } else {
    emit(
      'update:selectedToParticipantIds',
      props.selectedToParticipantIds.filter((i) => i !== id)
    )
  }
}

const handleAllToParticipantOn = () => {
  emit('update:selectedToParticipantIds', [...allParticipantIds.value])
}

const handleAllToParticipantOff = () => {
  emit('update:selectedToParticipantIds', [])
}

const handleReverseToParticipant = () => {
  emit(
    'update:selectedToParticipantIds',
    allParticipantIds.value.filter(
      (id) => !props.selectedToParticipantIds.includes(id)
    )
  )
}

const handleToMyParticipant = () => {
  if (myself.value) {
    emit('update:selectedToParticipantIds', [myself.value.id])
  }
}
</script>
