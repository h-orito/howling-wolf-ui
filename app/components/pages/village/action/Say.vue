<template>
  <ActionPanel id="say-panel" title="発言" panel-key="say">
    <!-- 死亡通知 -->
    <Alert v-if="myself?.dead" type="info" class="mb-4">
      あなたは死亡しました。
    </Alert>

    <!-- 役職説明 -->
    <Alert
      v-if="myself?.skill?.description"
      type="default"
      class="mb-4 whitespace-pre-line"
    >
      {{ skillDescription }}
    </Alert>

    <!-- 参加者情報 -->
    <div v-if="myself" class="mb-4 text-sm">
      <span class="font-bold">
        {{ myself.chara.chara_name.full_name }}
      </span>
      <span v-if="myself.skill" class="text-gray-600 dark:text-gray-400">
        （{{ myself.skill.name }}）
      </span>
    </div>

    <!-- エラーメッセージ -->
    <div
      v-if="sayError"
      class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ sayError }}
    </div>

    <!-- メッセージ種別選択 -->
    <div v-if="availableMessageTypes.length > 1" class="mb-4">
      <FormRadioGroup
        v-model="selectedMessageType"
        :options="messageTypeOptions"
      />
    </div>

    <!-- 秘話対象選択 -->
    <div v-if="isSecretSay" class="mb-4">
      <FormGroup label="秘話相手">
        <div class="flex items-center gap-1">
          <FormSelect
            v-model="targetParticipantId"
            :options="secretTargetOptions"
            placeholder="秘話相手を選択してください"
            class="flex-1"
          />
          <UiButton
            variant="solid"
            color="primary"
            @click="openSecretTargetModal"
          >
            画像で選択
          </UiButton>
        </div>
      </FormGroup>
    </div>

    <!-- 文字装飾ボタン -->
    <MessageDecorators v-model="messageText" :textarea-ref="textareaRef" />

    <!-- キャラクター表情選択 + メッセージ入力 -->
    <div class="mb-4 flex items-start gap-2">
      <div class="shrink-0">
        <button
          type="button"
          class="focus:ring-primary-500 cursor-pointer rounded focus:ring-2 focus:outline-none"
          :aria-label="`現在の表情: ${selectedFaceType}。クリックして表情を変更`"
          @click="openFaceModal"
        >
          <CharaImage
            v-if="chara"
            :chara="chara"
            :face-type="selectedFaceType"
            :is-large="false"
            :is-small="false"
          />
        </button>
      </div>

      <!-- メッセージ入力エリア -->
      <div class="min-w-0 flex-1">
        <FormGroup>
          <FormTextarea
            ref="formTextareaRef"
            v-model="messageText"
            :rows="10"
            :size="messageDisplay.isCharLarge ? 'md' : 'sm'"
            :class="textareaStyleClass"
          />
          <template #help>
            <div class="text-right text-sm">
              <span
                v-if="maxMessageCount != null"
                :class="{ 'text-red-600 dark:text-red-400': isCountExceeded }"
                >残り回数: {{ remainingMessageCount }}/{{ maxMessageCount }},
              </span>
              <span
                :class="{ 'text-red-600 dark:text-red-400': isLineExceeded }"
                >行数: {{ currentLineCount }}/{{ maxLineCount }}</span
              >,
              <span
                :class="{ 'text-red-600 dark:text-red-400': isCharExceeded }"
                >文字数: {{ currentCharCount }}/{{ maxMessageLength }}</span
              >
            </div>
          </template>
        </FormGroup>
      </div>
    </div>

    <!-- アクションボタン -->
    <div class="mt-4 flex flex-col gap-2 sm:flex-row">
      <UiButton
        :disabled="!canSubmit"
        :loading="submitting"
        color="primary"
        block
        @click="handleConfirm"
      >
        {{ submitButtonText }}
      </UiButton>
    </div>

    <!-- 返信対象メッセージ表示 -->
    <div v-if="replyTargetMessage" class="mt-4">
      <div class="rounded-lg border-2 border-blue-500 p-3">
        <div class="mb-2 flex items-center justify-between">
          <span class="text-xs font-bold text-blue-600 dark:text-(--ui-primary)"
            >返信対象</span
          >
          <button
            type="button"
            class="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            @click="clearReplyTarget"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>
        <MessageCard
          :message="replyTargetMessage"
          :is-progress="isProgress"
          :is-img-large="false"
          :is-large-text="false"
          :can-reply="false"
          :can-secret="false"
        />
      </div>
    </div>

    <!-- 発言確認モーダル -->
    <SayConfirmModal
      v-model="showConfirmModal"
      :preview-message="previewMessage"
      :submitting="submitting"
      :selected-message-type="selectedMessageType"
      :message-type-options="messageTypeOptions"
      :skip-confirmation="skipSayConfirmation"
      @confirm="handleSay"
    />

    <!-- 表情選択モーダル -->
    <Modal v-model="showFaceModal" title="表情を選択">
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <button
          v-for="face in chara?.face_list || []"
          :key="face.type"
          type="button"
          class="flex cursor-pointer flex-col items-center rounded border p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="{
            'ring-primary-500 ring-2': selectedFaceType === face.type
          }"
          @click="selectFace(face.type)"
        >
          <CharaImage v-if="chara" :chara="chara" :face-type="face.type" />
          <p class="mt-1 text-center text-xs">{{ face.name }}</p>
        </button>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton
            variant="outline"
            color="secondary"
            @click="showFaceModal = false"
            >キャンセル</UiButton
          >
        </div>
      </template>
    </Modal>

    <!-- 秘話相手選択モーダル -->
    <SecretTargetSelectModal
      v-model="showSecretTargetModal"
      :participant-list="secretTargets"
      @select="handleSecretTargetSelect"
    />
  </ActionPanel>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import type { MessageView } from '~/lib/api/types'
import ActionPanel from './ActionPanel.vue'
import MessageCard from '../message/MessageCard.vue'
import SecretTargetSelectModal from './say/SecretTargetSelectModal.vue'
import FormGroup from '~/components/ui/form/FormGroup.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import FormTextarea from '~/components/ui/form/FormTextarea.vue'
import FormRadioGroup from '~/components/ui/form/FormRadioGroup.vue'
import Modal from '~/components/ui/modal/Modal.vue'
import UiButton from '~/components/ui/button/index.vue'
import Alert from '~/components/ui/feedback/Alert.vue'
import CharaImage from '../CharaImage.vue'
import MessageDecorators from './decorator/MessageDecorators.vue'
import { useSay } from '~/composables/village/action/useSay'
import { useSituation } from '~/composables/village/useSituation'
import { useUserSettings } from '~/composables/village/useUserSettings'
import { useSayInputRegister } from '~/composables/village/useSayInput'
import { useVillageSayStatus } from '~/composables/village/useVillageSayStatus'
import { useVillage } from '~/composables/village/useVillage'
import { useSayDraft } from '~/composables/village/action/useSayDraft'
import { useVillageNavigation } from '~/composables/village/useVillageNavigation'
import { MESSAGE_TYPE } from '~/lib/api/message-constants'

// 発言種別と表情のマッピング（HW固有: MASON_SAYあり、LOVERS_SAY/SYMPATHIZE_SAYなし）
const MESSAGE_TYPE_FACE_TYPE_MAP = new Map<string, string>([
  [MESSAGE_TYPE.NORMAL_SAY, 'NORMAL'],
  [MESSAGE_TYPE.WEREWOLF_SAY, 'WEREWOLF'],
  [MESSAGE_TYPE.MASON_SAY, 'MASON'],
  [MESSAGE_TYPE.SPECTATE_SAY, 'NORMAL'],
  [MESSAGE_TYPE.SECRET_SAY, 'SECRET'],
  [MESSAGE_TYPE.MONOLOGUE_SAY, 'MONOLOGUE'],
  [MESSAGE_TYPE.GRAVE_SAY, 'GRAVE']
])

// 遅延ローディング: 確認モーダルは確認ボタンクリック時まで不要
const SayConfirmModal = defineAsyncComponent(
  () => import('./say/SayConfirmModal.vue')
)

const emit = defineEmits<{
  complete: []
}>()

// Composables
const { submitting, error: sayError, say, sayConfirm } = useSay()
const { situation } = useSituation()
const { messageDisplay } = useUserSettings()
const { village, villageId } = useVillage()
const { loadDraft, saveDraft, clearDraft } = useSayDraft()
const { setHasInputText, setConfirmModalOpen, setSubmitting, reset } =
  useVillageSayStatus()
const { scrollToElement } = useVillageNavigation()

// 親からinjectしたSayInputのregisterHandlersを取得
const sayInputRegister = useSayInputRegister()

// リアクティブデータ
const selectedMessageType = ref('')
const messageText = ref('')
const selectedFaceType = ref('NORMAL')
const targetParticipantId = ref<string | number | null | undefined>('')
const showFaceModal = ref(false)
const showConfirmModal = ref(false)
const showSecretTargetModal = ref(false)
const previewMessage = ref<MessageView | null>(null)
const replyTargetMessage = ref<MessageView | null>(null)

// FormTextareaへの参照
const formTextareaRef = ref<InstanceType<typeof FormTextarea> | null>(null)

// HTMLTextAreaElementへの参照（MessageDecoratorsに渡す）
const textareaRef = computed(() => {
  return formTextareaRef.value?.textareaElement ?? null
})

// 進行中かどうか（プロローグまたは進行中）
const isProgress = computed(
  () =>
    village.value?.status.is_prologue === true ||
    village.value?.status.is_progress === true
)

// Situationから取得するデータ
const availableMessageTypes = computed(() => {
  return situation.value?.say.selectable_message_type_list ?? []
})

// 秘話対象リスト（SECRET_SAYのtarget_listから取得）
const secretTargets = computed(() => {
  const secretSayType = availableMessageTypes.value.find(
    (m) => m.message_type.code === MESSAGE_TYPE.SECRET_SAY
  )
  return secretSayType?.target_list ?? []
})

// 選択中のメッセージタイプの発言制限
const currentRestrict = computed(() => {
  const mt = availableMessageTypes.value.find(
    (m) => m.message_type.code === selectedMessageType.value
  )
  return mt?.restrict ?? null
})

// 最大発言回数
const maxMessageCount = computed(() => currentRestrict.value?.max_count ?? null)

// 残り発言回数
const remainingMessageCount = computed(
  () => currentRestrict.value?.remaining_count ?? null
)

// 最大文字数
const maxMessageLength = computed(
  () => currentRestrict.value?.max_length ?? 200
)

// 最大行数
const maxLineCount = computed(() => currentRestrict.value?.max_line ?? 20)

// 現在の行数
const currentLineCount = computed(() => {
  if (!messageText.value) return 1
  return messageText.value.split('\n').length
})

// 現在の文字数（改行を除く）
const currentCharCount = computed(
  () => messageText.value.replace(/\n/g, '').length
)

// 制限超過判定
const isCountExceeded = computed(
  () => remainingMessageCount.value != null && remainingMessageCount.value <= 0
)
const isLineExceeded = computed(
  () => currentLineCount.value > maxLineCount.value
)
const isCharExceeded = computed(
  () => currentCharCount.value > maxMessageLength.value
)

// Situationから取得する自分の参加者情報
const myself = computed(() => situation.value?.participate.myself)

// キャラクター情報
const chara = computed(() => myself.value?.chara)

// 役職説明（句点で改行を挿入）
const skillDescription = computed(() => {
  const desc = myself.value?.skill?.description
  if (!desc) return ''
  return desc.replaceAll('。', '。\n')
})

// 計算プロパティ
const messageTypeOptions = computed(() =>
  availableMessageTypes.value.map((mt) => ({
    value: mt.message_type.code,
    label: mt.message_type.name
  }))
)

const secretTargetOptions = computed(() =>
  secretTargets.value.map((p) => ({
    value: p.id.toString(),
    label: p.chara.chara_name.name
  }))
)

const isSecretSay = computed(
  () => selectedMessageType.value === MESSAGE_TYPE.SECRET_SAY
)

// エピローグかどうか（誤爆防止確認をスキップする判定用）
const skipSayConfirmation = computed(() => {
  const status = village.value?.status
  if (!status) return false
  return status.is_epilogue
})

// 発言種別に応じたテキストエリアのスタイルクラス（HW固有: MASON_SAYあり）
const textareaStyleClass = computed(() => {
  switch (selectedMessageType.value) {
    case MESSAGE_TYPE.WEREWOLF_SAY:
      return '!bg-[#f2cece] dark:!bg-[#f2aeae] !text-[#0a0a0a]'
    case MESSAGE_TYPE.MASON_SAY:
      return '!bg-[#cef2ce] dark:!bg-[#aef2ae] !text-[#0a0a0a]'
    case MESSAGE_TYPE.MONOLOGUE_SAY:
      return '!bg-[#dddddd] dark:!bg-[#aaaaaa] !text-[#0a0a0a]'
    case MESSAGE_TYPE.GRAVE_SAY:
      return '!bg-[#ceedf2] dark:!bg-[#a9edf7] !text-[#0a0a0a]'
    case MESSAGE_TYPE.SPECTATE_SAY:
      return '!bg-[#f2f2ce] dark:!bg-[#f2f2ae] !text-[#0a0a0a]'
    case MESSAGE_TYPE.SECRET_SAY:
      return '!bg-[#cecef2] dark:!bg-[#aeaef2] !text-[#0a0a0a]'
    default:
      return ''
  }
})

const canSubmit = computed(() => {
  if (!messageText.value.trim()) return false
  if (isSecretSay.value && !targetParticipantId.value) return false
  if (submitting.value) return false
  if (isCountExceeded.value) return false
  if (isLineExceeded.value) return false
  if (isCharExceeded.value) return false
  return true
})

const submitButtonText = computed(() => {
  if (submitting.value) return '送信中...'
  return '発言確認へ'
})

// メソッド

/**
 * 発言種別に応じたデフォルト表情タイプを取得
 * キャラクターがその表情を持っていない場合は'NORMAL'にフォールバック
 */
const getDefaultFaceType = (messageType: string): string => {
  const expectedFaceType = MESSAGE_TYPE_FACE_TYPE_MAP.get(messageType)
  if (!expectedFaceType) return 'NORMAL'

  // キャラクターがその表情を持っているか確認
  const hasFace = chara.value?.face_list?.some(
    (face) => face.type === expectedFaceType
  )
  return hasFace ? expectedFaceType : 'NORMAL'
}

const openFaceModal = () => {
  if (chara.value?.face_list?.length) {
    showFaceModal.value = true
  }
}

const selectFace = (faceType: string) => {
  selectedFaceType.value = faceType
  showFaceModal.value = false
}

const openSecretTargetModal = () => {
  showSecretTargetModal.value = true
}

const handleSecretTargetSelect = (participantId: number) => {
  targetParticipantId.value = participantId.toString()
}

/**
 * 発言リクエストボディを生成
 */
const createSayBody = () => {
  const body: {
    message_type: string
    message: string
    face_type: string
    target_id?: number
  } = {
    message_type: selectedMessageType.value,
    message: messageText.value,
    face_type: selectedFaceType.value
  }
  if (isSecretSay.value && targetParticipantId.value) {
    body.target_id = Number(targetParticipantId.value)
  }
  return body
}

/**
 * 発言確認へボタンのハンドラ
 * say-confirm API を呼び出してプレビューを取得し、確認モーダルを開く
 */
const handleConfirm = async () => {
  if (!canSubmit.value) return

  const preview = await sayConfirm(createSayBody())

  if (preview) {
    previewMessage.value = preview
    showConfirmModal.value = true
  }
}

/**
 * 発言確認モーダルで「発言する」を押した時のハンドラ
 */
const handleSay = async () => {
  if (!canSubmit.value) return

  const success = await say(createSayBody())

  if (success) {
    // 送信成功後、メッセージをクリアしてモーダルを閉じる
    messageText.value = ''
    showConfirmModal.value = false
    previewMessage.value = null
    replyTargetMessage.value = null
    // 下書きをクリア
    if (villageId.value) {
      clearDraft(villageId.value)
    }
    emit('complete')
  }
}

/**
 * 返信対象をクリア
 */
const clearReplyTarget = () => {
  replyTargetMessage.value = null
}

/**
 * アンカー文字列を発言欄に挿入
 */
const insertAnchor = (anchorString: string) => {
  const textarea = textareaRef.value
  if (!textarea) {
    // テキストエリアがない場合は末尾に追加
    messageText.value += anchorString
    return
  }

  const currentText = messageText.value
  const selectionStart = textarea.selectionStart
  const selectionEnd = textarea.selectionEnd

  // カーソル位置にアンカーを挿入
  messageText.value =
    currentText.slice(0, selectionStart) +
    anchorString +
    currentText.slice(selectionEnd)

  // カーソル位置を挿入後の位置に移動
  nextTick(() => {
    const newPosition = selectionStart + anchorString.length
    textarea.focus()
    textarea.setSelectionRange(newPosition, newPosition)
  })
}

/**
 * 秘話モードに切り替え、対象を設定
 */
const switchToSecret = (targetId: number) => {
  // 秘話が選択可能か確認
  const hasSecretType = availableMessageTypes.value.some(
    (m) => m.message_type.code === MESSAGE_TYPE.SECRET_SAY
  )
  if (!hasSecretType) return

  // 対象が秘話対象リストにあるか確認
  const targetExists = secretTargets.value.some((t) => t.id === targetId)
  if (!targetExists) return

  // 秘話モードに切り替え
  selectedMessageType.value = MESSAGE_TYPE.SECRET_SAY
  targetParticipantId.value = targetId.toString()

  // 発言パネルにスクロール
  scrollToSayPanel()
}

/**
 * 発言パネルへスクロール
 */
const scrollToSayPanel = () => {
  scrollToElement('say-panel', '#village-article-wrapper')
}

// 初期化
const initializeForm = () => {
  // 最初のメッセージタイプを選択
  if (availableMessageTypes.value.length > 0) {
    const firstMessageType = availableMessageTypes.value[0]
    if (firstMessageType) {
      selectedMessageType.value = firstMessageType.message_type.code
      // 発言種別に応じた表情を設定
      selectedFaceType.value = getDefaultFaceType(
        firstMessageType.message_type.code
      )
    }
  }
}

// マウント時に初期化
onMounted(() => {
  initializeForm()
})

// 下書き復元フラグ（初回のみ復元するため）
const draftRestored = ref(false)

/**
 * 下書きを復元する（初回のみ実行）
 */
const restoreDraft = () => {
  if (draftRestored.value) return
  if (availableMessageTypes.value.length === 0) return
  if (!villageId.value) return

  draftRestored.value = true
  const draft = loadDraft(villageId.value)
  if (!draft) return

  messageText.value = draft.messageText
  // 復元した発言種別が現在選択可能かチェック
  const isTypeAvailable = availableMessageTypes.value.some(
    (m) => m.message_type.code === draft.messageType
  )
  if (isTypeAvailable) {
    selectedMessageType.value = draft.messageType
  }
  // 表情はnextTickで設定（selectedMessageTypeのwatchによるデフォルト上書きを待つ）
  nextTick(() => {
    const hasFace = chara.value?.face_list?.some(
      (face) => face.type === draft.faceType
    )
    if (hasFace) {
      selectedFaceType.value = draft.faceType
    }
  })
}

// マウント時に下書き復元を試みる
onMounted(() => {
  restoreDraft()
})

// situation/villageの変更を監視して初期化
watch(
  () => [availableMessageTypes.value, chara.value],
  () => {
    // メッセージタイプが未選択または選択不可になった場合は再初期化
    if (
      !selectedMessageType.value ||
      !availableMessageTypes.value.some(
        (m) => m.message_type.code === selectedMessageType.value
      )
    ) {
      initializeForm()
    }

    // マウント時に未復元だった場合のフォールバック
    restoreDraft()
  },
  { deep: true }
)

// SayInputにハンドラを登録（親がprovideしている場合）
onMounted(() => {
  if (sayInputRegister) {
    sayInputRegister.registerHandlers({
      insertAnchor,
      switchToSecret,
      setReplyTarget: (message) => {
        replyTargetMessage.value = message
        // 返信対象設定時に発言パネルにスクロール
        if (message) {
          scrollToSayPanel()
        }
      }
    })
  }
})

// 発言種別変更時に表情を自動切り替え
watch(selectedMessageType, (newMessageType) => {
  if (newMessageType) {
    selectedFaceType.value = getDefaultFaceType(newMessageType)
  }
})

// 入力状態をストアに反映（自動更新制御用）
watch(messageText, (newValue) => {
  setHasInputText(newValue.length > 0)
})

// 下書き自動保存（1秒デバウンス）
let draftSaveTimer: ReturnType<typeof setTimeout> | null = null
watch([messageText, selectedMessageType, selectedFaceType], () => {
  if (!villageId.value) return
  if (draftSaveTimer) clearTimeout(draftSaveTimer)
  draftSaveTimer = setTimeout(() => {
    saveDraft(
      villageId.value!,
      messageText.value,
      selectedMessageType.value,
      selectedFaceType.value
    )
  }, 1000)
})

watch(showConfirmModal, (newValue) => {
  setConfirmModalOpen(newValue)
})

watch(submitting, (newValue) => {
  setSubmitting(newValue)
})

onUnmounted(() => {
  if (sayInputRegister) {
    sayInputRegister.unregisterHandlers()
  }
  reset()
})
</script>
