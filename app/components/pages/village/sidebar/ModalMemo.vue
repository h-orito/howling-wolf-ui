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
            :class="
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'cursor-pointer border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            "
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- メモ入力エリア -->
      <div class="space-y-2">
        <FormTextarea
          v-model="memoTexts[activeTab]"
          :rows="15"
          :maxlength="1000"
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
import { useVillage } from '~/composables/village/useVillage'
import { useVillageMemo } from '~/composables/village/useVillageMemo'
import { useToast } from '~/composables/useToast'

type TabId = 1 | 2 | 3

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

const { villageId } = useVillage()
const { getMemo, saveMemo } = useVillageMemo()
const toast = useToast()

// タブ定義
const tabs: { id: TabId; label: string }[] = [
  { id: 1, label: 'メモ1' },
  { id: 2, label: 'メモ2' },
  { id: 3, label: 'メモ3' }
]

// State
const activeTab = ref<TabId>(1)
const memoTexts = reactive<Record<TabId, string>>({
  1: '',
  2: '',
  3: ''
})

// 現在の文字数（改行を除く）
const currentCharCount = computed(() => {
  return memoTexts[activeTab.value].replace(/\n/g, '').length
})

// 文字数超過判定
const isCharExceeded = computed(() => currentCharCount.value > 1000)

// 文字数カウンター
const counter = computed(() => {
  const text = memoTexts[activeTab.value]
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
}

/**
 * メモを保存
 */
const save = () => {
  if (!villageId.value) return
  saveMemo(villageId.value, 1, memoTexts[1])
  saveMemo(villageId.value, 2, memoTexts[2])
  saveMemo(villageId.value, 3, memoTexts[3])
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
 * クリップボードにコピー
 */
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(memoTexts[activeTab.value])
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
</script>
