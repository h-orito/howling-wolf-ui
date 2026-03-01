<template>
  <Modal v-model="isOpenModel" title="メモ" @close="$emit('close')">
    <div class="space-y-4">
      <!-- 説明文 -->
      <p class="text-sm text-gray-600 dark:text-gray-400">
        端末に保存され、ブラウザのデータを削除すると消えます。<br />
        自動保存されないため、下部の保存ボタンの押し忘れにご注意ください。
      </p>

      <!-- タブ -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-4" aria-label="メモタブ">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors"
            :class="[
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              tab.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            ]"
            :disabled="tab.disabled"
            @click="!tab.disabled && (activeTab = tab.id)"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- メモ入力エリア（メモ1-3用） -->
      <div v-if="activeTab !== 'matome'" class="space-y-2">
        <FormTextarea
          v-model="memoTexts[activeTab]"
          :rows="15"
          placeholder="1000文字まで保存できます。"
          size="sm"
        />
        <div class="flex items-center justify-between">
          <p
            class="text-right text-xs"
            :class="
              isCharExceeded
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400'
            "
          >
            {{ counter }}
          </p>
          <button
            type="button"
            class="rounded border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            @click="copyToClipboard"
          >
            クリップボードにコピー
          </button>
        </div>
      </div>

      <!-- まとめタブ -->
      <MemoMatome
        v-else-if="matomes"
        :matomes="matomes"
        @add-line="handleAddLine"
        @remove-line="handleRemoveLine"
        @to-left="handleToLeft"
        @to-right="handleToRight"
        @change-content="handleChangeContent"
      />
    </div>

    <template #footer>
      <div class="flex gap-2">
        <button
          type="button"
          class="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          @click="$emit('close')"
        >
          閉じる
        </button>
        <button
          type="button"
          class="rounded border border-blue-500 bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
          @click="save"
        >
          保存する
        </button>
        <button
          type="button"
          class="rounded border border-blue-500 bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
          @click="saveAndClose"
        >
          保存して閉じる
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/ui/modal/Modal.vue'
import FormTextarea from '~/components/ui/form/FormTextarea.vue'
import MemoMatome from './MemoMatome.vue'
import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'
import { useVillage } from '~/composables/village/useVillage'
import { useVillageMemo } from '~/composables/village/useVillageMemo'
import {
  useVillageMatome,
  type Matomes
} from '~/composables/village/useVillageMatome'
import { useToast } from '~/composables/useToast'

type TabId = 1 | 2 | 3 | 'matome'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const isOpenModel = computed({
  get: () => props.isOpen,
  set: () => emit('close')
})

const { villageId, village } = useVillage()
const { getMemo, saveMemo } = useVillageMemo()
const {
  saveMatome,
  initializeMatome,
  addLine,
  removeLine,
  toLeft,
  toRight,
  changeContent
} = useVillageMatome()
const toast = useToast()

// プロローグ判定
const isPrologue = computed(() => {
  return !village.value || village.value.status.code === VILLAGE_STATUS.PROLOGUE
})

// キャラクター名取得
const charaNames = computed(() => {
  if (!village.value) return []
  return village.value.participant.member_list.map(
    (m) => m.chara.chara_name.short_name
  )
})

// タブ定義（computedに変更、isPrologue依存のため）
const tabs = computed(() => [
  { id: 1 as const, label: 'メモ1', disabled: false },
  { id: 2 as const, label: 'メモ2', disabled: false },
  { id: 3 as const, label: 'メモ3', disabled: false },
  { id: 'matome' as const, label: 'まとめ', disabled: isPrologue.value }
])

// State
const activeTab = ref<TabId>(1)
const memoTexts = reactive<Record<1 | 2 | 3, string>>({
  1: '',
  2: '',
  3: ''
})
const matomes = ref<Matomes | null>(null)

// 現在の文字数（改行を除く）
const currentCharCount = computed(() => {
  const tabId = activeTab.value
  if (tabId === 'matome') return 0
  return memoTexts[tabId].replace(/\n/g, '').length
})

// 文字数超過判定
const isCharExceeded = computed(() => currentCharCount.value > 1000)

// 文字数カウンター（メモ1-3用）
const counter = computed(() => {
  const tabId = activeTab.value
  if (tabId === 'matome') return ''
  const text = memoTexts[tabId]
  const lineCount = text.split('\n').length
  return `行数: ${lineCount}, 文字数: ${currentCharCount.value}/1000`
})

// モーダル表示時にメモを読み込む
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      loadMemos()
    }
  }
)

/**
 * メモを読み込む
 */
const loadMemos = () => {
  if (!villageId.value) return

  memoTexts[1] = getMemo(villageId.value, 1)
  memoTexts[2] = getMemo(villageId.value, 2)
  memoTexts[3] = getMemo(villageId.value, 3)

  // まとめデータの初期化（プロローグでない場合のみ）
  if (!isPrologue.value && charaNames.value.length > 0) {
    matomes.value = initializeMatome(villageId.value, charaNames.value)
  }
}

/**
 * メモを保存
 */
const save = () => {
  if (!villageId.value) return

  saveMemo(villageId.value, 1, memoTexts[1])
  saveMemo(villageId.value, 2, memoTexts[2])
  saveMemo(villageId.value, 3, memoTexts[3])

  // まとめデータの保存
  if (matomes.value) {
    saveMatome(villageId.value, matomes.value)
  }

  toast.add({
    message: 'メモを保存しました',
    type: 'success'
  })
}

/**
 * メモを保存して閉じる
 */
const saveAndClose = () => {
  save()
  emit('close')
}

/**
 * クリップボードにコピー（メモ1-3用）
 */
const copyToClipboard = async () => {
  const tabId = activeTab.value
  if (tabId === 'matome') return

  try {
    await navigator.clipboard.writeText(memoTexts[tabId])
    toast.add({
      message: 'クリップボードにコピーしました',
      type: 'success'
    })
  } catch (err) {
    console.error('クリップボードへのコピーに失敗しました:', err)
    toast.add({
      message: 'クリップボードへのコピーに失敗しました',
      type: 'error'
    })
  }
}

// --- まとめタブ用イベントハンドラ ---

const handleAddLine = () => {
  if (matomes.value) {
    matomes.value = addLine(matomes.value)
  }
}

const handleRemoveLine = ({ lineIndex }: { lineIndex: number }) => {
  if (matomes.value) {
    matomes.value = removeLine(matomes.value, lineIndex)
  }
}

const handleToLeft = ({ index }: { index: number }) => {
  if (matomes.value) {
    matomes.value = toLeft(matomes.value, index)
  }
}

const handleToRight = ({ index }: { index: number }) => {
  if (matomes.value) {
    matomes.value = toRight(matomes.value, index)
  }
}

const handleChangeContent = ({
  lineIndex,
  contentIndex,
  content
}: {
  lineIndex: number
  contentIndex: number
  content: string
}) => {
  if (matomes.value) {
    matomes.value = changeContent(
      matomes.value,
      lineIndex,
      contentIndex,
      content
    )
  }
}
</script>
