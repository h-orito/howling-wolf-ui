<template>
  <div class="space-y-4">
    <!-- テーブル -->
    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse text-sm">
        <!-- ヘッダー行 -->
        <thead>
          <tr class="border-b border-gray-300 dark:border-gray-600">
            <th class="px-2 py-1"></th>
            <th
              v-for="charaName in matomes.charaNames"
              :key="charaName"
              class="px-2 py-1 text-center font-medium text-gray-700 dark:text-gray-300"
            >
              {{ charaName }}
            </th>
          </tr>
        </thead>

        <tbody>
          <template
            v-for="(matome, lineIndex) in matomes.matomes"
            :key="lineIndex"
          >
            <!-- データ行 -->
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <!-- 削除ボタン -->
              <td class="px-2 py-1">
                <UiButton
                  color="error"
                  size="xs"
                  icon="i-heroicons-trash-20-solid"
                  @click="emit('remove-line', { lineIndex })"
                >
                  削除
                </UiButton>
              </td>
              <!-- セル -->
              <td
                v-for="(content, contentIndex) in matome.contents"
                :key="`${lineIndex}-${contentIndex}`"
                class="px-1 py-1 text-center"
              >
                <button
                  type="button"
                  class="min-w-8 rounded border px-2 py-1 text-sm transition-colors"
                  :class="
                    selectingLineIndex === lineIndex &&
                    selectingContentIndex === contentIndex
                      ? 'border-[var(--ui-primary)] bg-[var(--ui-primary)]/10 text-[var(--ui-primary)]'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  "
                  @click="selectCell(lineIndex, contentIndex)"
                >
                  {{ content }}
                </button>
              </td>
            </tr>

            <!-- 記号パレット行（選択中の行にのみ表示） -->
            <tr
              v-if="selectingLineIndex === lineIndex"
              class="bg-gray-50 dark:bg-gray-800/50"
            >
              <td></td>
              <td :colspan="matome.contents.length" class="px-2 py-2">
                <div class="flex flex-wrap gap-1">
                  <button
                    v-for="symbol in MATOME_SYMBOLS"
                    :key="symbol"
                    type="button"
                    class="min-w-8 rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    @click="updateContent(symbol)"
                  >
                    {{ symbol }}
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>

        <!-- フッター -->
        <tfoot>
          <!-- 行追加ボタン -->
          <tr class="border-t border-gray-300 dark:border-gray-600">
            <td></td>
            <td :colspan="matomes.charaNames.length" class="px-2 py-2">
              <UiButton
                color="primary"
                size="sm"
                icon="i-heroicons-plus-20-solid"
                @click="emit('add-line')"
              >
                行を追加する
              </UiButton>
            </td>
          </tr>

          <!-- 左右移動ボタン -->
          <tr>
            <td></td>
            <td
              v-for="(_, index) in matomes.charaNames"
              :key="index"
              class="px-1 py-1 text-center"
            >
              <div class="flex flex-col gap-1">
                <UiButton
                  color="secondary"
                  variant="outline"
                  size="xs"
                  icon="i-heroicons-arrow-left-20-solid"
                  :disabled="index === 0"
                  @click="emit('to-left', { index })"
                />
                <UiButton
                  color="secondary"
                  variant="outline"
                  size="xs"
                  icon="i-heroicons-arrow-right-20-solid"
                  :disabled="index === matomes.charaNames.length - 1"
                  @click="emit('to-right', { index })"
                />
              </div>
            </td>
          </tr>

          <!-- クリップボードコピーボタン -->
          <tr class="border-t border-gray-300 dark:border-gray-600">
            <td></td>
            <td :colspan="matomes.charaNames.length" class="px-2 py-2">
              <UiButton
                color="primary"
                size="sm"
                icon="i-heroicons-clipboard-document-20-solid"
                @click="copyToClipboard"
              >
                表を出力してクリップボードにコピー
              </UiButton>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/button/index.vue'
import {
  MATOME_SYMBOLS,
  type Matomes,
  useVillageMatome
} from '~/composables/village/useVillageMatome'
import { useToast } from '~/composables/useToast'

// Props
interface Props {
  matomes: Matomes
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'add-line': []
  'remove-line': [{ lineIndex: number }]
  'to-left': [{ index: number }]
  'to-right': [{ index: number }]
  'change-content': [
    { lineIndex: number; contentIndex: number; content: string }
  ]
}>()

// Composables
const { outputText } = useVillageMatome()
const toast = useToast()

// 内部状態
const selectingLineIndex = ref<number | null>(null)
const selectingContentIndex = ref<number | null>(null)

/**
 * セルを選択
 */
const selectCell = (lineIndex: number, contentIndex: number) => {
  selectingLineIndex.value = lineIndex
  selectingContentIndex.value = contentIndex
}

/**
 * 記号パレットから内容を更新
 */
const updateContent = (content: string) => {
  if (
    selectingLineIndex.value !== null &&
    selectingContentIndex.value !== null
  ) {
    emit('change-content', {
      lineIndex: selectingLineIndex.value,
      contentIndex: selectingContentIndex.value,
      content
    })
    selectingLineIndex.value = null
    selectingContentIndex.value = null
  }
}

/**
 * クリップボードにコピー
 */
const copyToClipboard = async () => {
  const text = outputText(props.matomes)
  try {
    await navigator.clipboard.writeText(text)
    toast.add({
      message: '表をクリップボードにコピーしました',
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
