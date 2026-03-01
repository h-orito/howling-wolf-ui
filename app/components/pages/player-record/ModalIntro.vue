<template>
  <Modal v-model="isOpen" title="自己紹介編集">
    <div class="space-y-4">
      <UiFeedbackAlert type="default">
        <ul class="list-disc pl-4 text-sm">
          <li>
            戦績サイトに登録されるIDは以下の優先度となります。
            <ul class="list-disc pl-4">
              <li>他人狼サイトのID</li>
              <li>Twitterアカウントのユーザー名</li>
              <li>ニックネーム</li>
            </ul>
          </li>
        </ul>
      </UiFeedbackAlert>

      <!-- ニックネーム -->
      <div>
        <label class="mb-1 block text-sm font-semibold text-gray-700">
          ニックネーム
        </label>
        <p class="mb-2 text-xs text-gray-500">
          エピローグで全員に公開されます。
        </p>
        <FormInput
          v-model="nickname"
          size="sm"
          :maxlength="50"
          :error="!validNickname"
        />
        <p v-if="!validNickname" class="mt-1 text-xs text-red-500">
          50字以内で入力してください
        </p>
      </div>

      <!-- 他人狼サイトのID -->
      <div>
        <label class="mb-1 block text-sm font-semibold text-gray-700">
          他人狼サイトのID
        </label>
        <p class="mb-2 text-xs text-gray-500">
          エピローグまでにこのIDを入力しておくと、戦績サイトにこのIDで登録されます。
        </p>
        <FormInput
          v-model="otherSiteName"
          size="sm"
          :maxlength="20"
          :error="!validOtherSiteName"
        />
        <p v-if="!validOtherSiteName" class="mt-1 text-xs text-red-500">
          20字以内で入力してください
        </p>
      </div>

      <!-- 自己紹介 -->
      <div>
        <label class="mb-1 block text-sm font-semibold text-gray-700">
          自己紹介
        </label>
        <FormTextarea v-model="intro" size="sm" :rows="10" :maxlength="2000" />
        <p class="mt-1 text-right text-xs" :class="introCountClass">
          文字数: {{ introLength }}/2000
        </p>
      </div>

      <!-- ブラックリスト管理 -->
      <div v-if="blacklistPlayers.length > 0">
        <label class="mb-1 block text-sm font-semibold text-gray-700">
          ブラックリスト
        </label>
        <div class="rounded border p-2">
          <div
            v-for="player in blacklistPlayers"
            :key="player.id"
            class="flex items-center justify-between border-b py-1 last:border-b-0"
          >
            <span class="text-sm">{{ player.nickname }}</span>
            <UiButton
              size="xs"
              color="error"
              @click="removeBlacklist(player.id)"
            >
              解除
            </UiButton>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <UiButton color="secondary" size="sm" @click="close">
        キャンセル
      </UiButton>
      <UiButton
        color="primary"
        size="sm"
        :disabled="!canSave || isSaving"
        @click="save"
      >
        保存する
      </UiButton>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/ui/modal/Modal.vue'
import FormInput from '~/components/ui/form/FormInput.vue'
import FormTextarea from '~/components/ui/form/FormTextarea.vue'
import type { PlayerView } from '~/lib/api/types'

interface Props {
  modelValue: boolean
  currentNickname: string
  currentOtherSiteName?: string | null
  currentIntro?: string | null
  blacklistPlayers: PlayerView[]
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'refresh'): void
  (e: 'remove-blacklist', playerId: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { apiCall } = useApi()

const nickname = ref(props.currentNickname)
const otherSiteName = ref(props.currentOtherSiteName ?? '')
const intro = ref(props.currentIntro ?? '')
const isSaving = ref(false)

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      nickname.value = props.currentNickname
      otherSiteName.value = props.currentOtherSiteName ?? ''
      intro.value = props.currentIntro ?? ''
    }
  }
)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const validNickname = computed(() => nickname.value.length <= 50)
const validOtherSiteName = computed(
  () => !otherSiteName.value || otherSiteName.value.length <= 20
)
const introLength = computed(() => intro.value?.length ?? 0)
const validIntro = computed(() => introLength.value <= 2000)
const canSave = computed(
  () => validNickname.value && validOtherSiteName.value && validIntro.value
)

const introCountClass = computed(() => {
  return introLength.value > 2000 ? 'text-red-500' : 'text-gray-500'
})

const close = () => {
  isOpen.value = false
}

const save = async () => {
  if (!canSave.value || isSaving.value) return

  isSaving.value = true
  try {
    await apiCall('/player/detail', {
      method: 'POST',
      body: {
        nickname: nickname.value,
        other_site_name: otherSiteName.value || null,
        introduction: intro.value || null
      }
    })
    close()
    emit('refresh')
  } catch (error) {
    console.error('自己紹介の保存に失敗しました:', error)
  } finally {
    isSaving.value = false
  }
}

const removeBlacklist = (playerId: number) => {
  emit('remove-blacklist', playerId)
}
</script>
