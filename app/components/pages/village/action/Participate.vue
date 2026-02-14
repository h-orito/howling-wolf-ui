<template>
  <ActionPanel title="入村" panel-key="participate">
    <!-- キャラ選択 -->
    <FormGroup label="キャラ" required>
      <div class="flex gap-2">
        <FormSelect
          v-model="form.charaId"
          :options="charaOptions"
          class="flex-1"
          size="sm"
          placeholder="選択してください"
          @change="onCharaChange"
        />
        <UiButton size="sm" @click="openCharaSelectModal">
          画像で選択
        </UiButton>
      </div>
    </FormGroup>

    <!-- 役職希望（available_skill_request時のみ） -->
    <template v-if="availableSkillRequest">
      <FormGroup label="役職第1希望" required>
        <FormSelect
          v-model="form.firstRequestSkill"
          :options="skillOptions"
          size="sm"
        />
      </FormGroup>
      <FormGroup label="役職第2希望" required>
        <FormSelect
          v-model="form.secondRequestSkill"
          :options="skillOptions"
          size="sm"
        />
      </FormGroup>
    </template>

    <!-- 入村発言 -->
    <FormGroup label="入村発言" required>
      <MessageDecorators
        v-model="form.joinMessage"
        :textarea-ref="textareaRef"
        class="mb-2"
      />
      <div class="flex flex-col items-start gap-2 sm:flex-row">
        <!-- キャラ画像 -->
        <div class="shrink-0">
          <CharaImage
            v-if="selectedChara"
            :chara="selectedChara"
            face-type="NORMAL"
            :is-small="false"
          />
          <div
            v-else
            class="flex h-20 w-16 items-center justify-center rounded-md bg-gray-200 text-xs text-gray-500 dark:bg-gray-600 dark:text-gray-400"
          >
            未選択
          </div>
        </div>

        <!-- メッセージ入力エリア -->
        <div class="w-full flex-1">
          <FormTextarea
            ref="formTextareaRef"
            v-model="form.joinMessage"
            size="sm"
            :rows="4"
            class="w-full"
          />
          <div class="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">
            <span :class="{ 'text-red-600 dark:text-red-400': isLineExceeded }"
              >行数: {{ lineCount }}/{{ maxLineCount }}</span
            >,
            <span :class="{ 'text-red-600 dark:text-red-400': isCharExceeded }"
              >文字数: {{ charCountWithoutNewlines }}/{{
                maxMessageLength
              }}</span
            >
          </div>
        </div>
      </div>
    </FormGroup>

    <!-- 入村パスワード（必要時のみ） -->
    <FormGroup v-if="requiredJoinPassword" label="入村パスワード" required>
      <FormInput v-model="form.joinPassword" type="text" size="sm" />
    </FormGroup>

    <!-- エラーメッセージ -->
    <div
      v-if="participateError"
      class="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ participateError }}
    </div>

    <!-- 入村確認ボタン / 見学ボタン -->
    <div class="flex justify-end gap-2">
      <UiButton
        v-if="availableSpectate"
        :disabled="!canSubmitSpectate || confirming"
        :loading="confirming"
        variant="outline"
        @click="handleConfirmSpectate"
      >
        見学確認
      </UiButton>
      <UiButton
        :disabled="!canSubmit || confirming"
        :loading="confirming"
        @click="handleConfirm"
      >
        入村確認
      </UiButton>
    </div>

    <!-- キャラ選択モーダル -->
    <CharaSelectModal
      :is-open="isCharaSelectModalOpen"
      :charas="selectableCharaList"
      @select="onCharaSelect"
      @close="isCharaSelectModalOpen = false"
    />

    <!-- 入村確認モーダル -->
    <ParticipateConfirmModal
      v-model="isConfirmModalOpen"
      :confirm-message="confirmMessage"
      :submitting="submitting"
      @participate="handleParticipate"
    />
  </ActionPanel>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { MessageView, Chara } from '~/lib/api/types'
import ActionPanel from './ActionPanel.vue'
import FormGroup from '~/components/ui/form/FormGroup.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import FormInput from '~/components/ui/form/FormInput.vue'
import FormTextarea from '~/components/ui/form/FormTextarea.vue'
import UiButton from '~/components/ui/button/index.vue'
import CharaImage from '~/components/pages/village/CharaImage.vue'
import MessageDecorators from './decorator/MessageDecorators.vue'
import {
  useParticipate,
  type ParticipateForm
} from '~/composables/village/action/useParticipate'
import { useSituation } from '~/composables/village/useSituation'
import { useVillage } from '~/composables/village/useVillage'
import { MESSAGE_TYPE } from '~/lib/api/message-constants'

// 遅延ローディング: モーダルはボタンクリック時まで不要
const CharaSelectModal = defineAsyncComponent(
  () => import('~/components/ui/chara-select/CharaSelectModal.vue')
)
const ParticipateConfirmModal = defineAsyncComponent(
  () => import('./participate/ParticipateConfirmModal.vue')
)

const emit = defineEmits<{
  complete: []
}>()

// Composables
const { situation } = useSituation()
const { village } = useVillage()
const {
  confirming,
  submitting,
  error: participateError,
  confirmParticipate,
  participate
} = useParticipate()

// FormTextareaへのref
const formTextareaRef = ref<InstanceType<typeof FormTextarea> | null>(null)
// MessageDecorators用のtextarea要素への参照
const textareaRef = computed(
  () => formTextareaRef.value?.textareaElement ?? null
)

// フォーム入力値（HW固有: chara_name/chara_short_nameなし）
const form = reactive({
  charaId: null as number | null,
  firstRequestSkill: 'LEFTOVER',
  secondRequestSkill: 'LEFTOVER',
  joinMessage: '',
  joinPassword: ''
})

// UI状態
const isCharaSelectModalOpen = ref(false)
const isConfirmModalOpen = ref(false)
const confirmMessage = ref<MessageView | null>(null)
// 見学モードかどうか
const isSpectatorMode = ref(false)

// 選択可能なキャラリスト
const selectableCharaList = computed(
  () => situation.value?.participate.selectable_chara_list ?? []
)

// 選択中のキャラ
const selectedChara = computed(() => {
  if (!form.charaId) return null
  return selectableCharaList.value.find((c) => c.id === form.charaId) ?? null
})

// 通常発言の制限を村設定から取得
const normalSayRestrict = computed(() => {
  const restrictList =
    village.value?.setting.rules.message_restrict?.restrict_list ?? []
  return (
    restrictList.find((r) => r.type.code === MESSAGE_TYPE.NORMAL_SAY) ?? null
  )
})

// 入村発言の最大文字数・行数（村設定から取得、デフォルト値を設定）
const maxMessageLength = computed(() => normalSayRestrict.value?.length ?? 400)
const maxLineCount = computed(() => normalSayRestrict.value?.line ?? 20)

// 改行を除いた文字数
const charCountWithoutNewlines = computed(() => {
  return form.joinMessage.replace(/\n/g, '').length
})

// 行数（改行数 + 1）
const lineCount = computed(() => {
  if (!form.joinMessage) return 0
  return form.joinMessage.split('\n').length
})

// 行数超過判定
const isLineExceeded = computed(() => lineCount.value > maxLineCount.value)

// 文字数超過判定
const isCharExceeded = computed(
  () => charCountWithoutNewlines.value > maxMessageLength.value
)

// キャラ選択用オプション
const charaOptions = computed(() =>
  selectableCharaList.value.map((chara) => ({
    label: chara.chara_name.name,
    value: chara.id
  }))
)

// 選択可能な役職リスト
const selectableSkillList = computed(
  () => situation.value?.skill_request.selectable_skill_list ?? []
)

// 役職選択用オプション
const skillOptions = computed(() =>
  selectableSkillList.value.map((skill) => ({
    label: skill.name,
    value: skill.code
  }))
)

// 役職希望が可能か
const availableSkillRequest = computed(
  () => situation.value?.skill_request.available_skill_request ?? false
)

// 見学が可能か（HW固有）
const availableSpectate = computed(
  () => situation.value?.participate.available_spectate ?? false
)

// 入村パスワードが必要か
const requiredJoinPassword = computed(
  () => village.value?.setting.password.join_password_required ?? false
)

// 参加ボタンを押下できるか
const canSubmit = computed(() => {
  if (form.charaId === null) return false
  if (!form.joinMessage || form.joinMessage.length < 1) return false
  if (isLineExceeded.value) return false
  if (isCharExceeded.value) return false
  if (requiredJoinPassword.value && !form.joinPassword) return false
  return true
})

// 見学ボタンを押下できるか
const canSubmitSpectate = computed(() => {
  if (form.charaId === null) return false
  if (!form.joinMessage || form.joinMessage.length < 1) return false
  if (isLineExceeded.value) return false
  if (isCharExceeded.value) return false
  return true
})

// キャラ選択モーダルを開く
const openCharaSelectModal = () => {
  isCharaSelectModalOpen.value = true
}

// キャラ選択時（モーダルから）
const onCharaSelect = (chara: DeepReadonly<Chara> | Chara) => {
  form.charaId = chara.id
  isCharaSelectModalOpen.value = false
}

// キャラ変更時（セレクトボックスから）
const onCharaChange = () => {
  // FormSelect経由の変更 — 特に追加処理なし
}

/**
 * フォームデータからParticipateFormを生成
 */
const createFormData = (spectator: boolean): ParticipateForm => ({
  charaId: form.charaId!,
  firstRequestSkill: form.firstRequestSkill,
  secondRequestSkill: form.secondRequestSkill,
  joinMessage: form.joinMessage,
  joinPassword: form.joinPassword,
  spectator
})

// 入村確認
const handleConfirm = async () => {
  if (!canSubmit.value || form.charaId === null) return

  isSpectatorMode.value = false
  const formData = createFormData(false)

  const message = await confirmParticipate(formData)
  if (message) {
    confirmMessage.value = message
    isConfirmModalOpen.value = true
  }
}

// 見学確認（HW固有）
const handleConfirmSpectate = async () => {
  if (!canSubmitSpectate.value || form.charaId === null) return

  isSpectatorMode.value = true
  const formData = createFormData(true)

  const message = await confirmParticipate(formData)
  if (message) {
    confirmMessage.value = message
    isConfirmModalOpen.value = true
  }
}

// 入村/見学実行
const handleParticipate = async () => {
  if (form.charaId === null) return

  const formData = createFormData(isSpectatorMode.value)

  const success = await participate(formData)
  if (success) {
    isConfirmModalOpen.value = false
    emit('complete')
  }
}
</script>
