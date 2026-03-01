<template>
  <div class="mb-2 flex flex-wrap gap-1">
    <!-- 太字 -->
    <DecorateButton @click="addTag('b')">
      <strong>B</strong>
    </DecorateButton>

    <!-- 大文字 -->
    <DecorateButton @click="addTag('large')"> 大 </DecorateButton>

    <!-- 小文字 -->
    <DecorateButton @click="addTag('small')">
      <small>小</small>
    </DecorateButton>

    <!-- 取り消し線 -->
    <DecorateButton @click="addTag('s')">
      <s>あ</s>
    </DecorateButton>

    <!-- ルビ -->
    <DecorateButton @click="addRubyTag"> rb </DecorateButton>

    <!-- 隠し文字 -->
    <DecorateButton @click="addTag('cw')"> 隠 </DecorateButton>

    <!-- 色付きボタン -->
    <DecorateButton @click="addTag('#ff0000', '#')">
      <span class="text-[#ff0000]">■</span>
    </DecorateButton>
    <DecorateButton @click="addTag('#ff8800', '#')">
      <span class="text-[#ff8800]">■</span>
    </DecorateButton>
    <DecorateButton @click="addTag('#ffff00', '#')">
      <span class="text-[#ffff00]">■</span>
    </DecorateButton>
    <DecorateButton @click="addTag('#00ff00', '#')">
      <span class="text-[#00ff00]">■</span>
    </DecorateButton>
    <DecorateButton @click="addTag('#00ffff', '#')">
      <span class="text-[#00ffff]">■</span>
    </DecorateButton>
    <DecorateButton @click="addTag('#0000ff', '#')">
      <span class="text-[#0000ff]">■</span>
    </DecorateButton>
    <DecorateButton @click="addTag('#ff00ff', '#')">
      <span class="text-[#ff00ff]">■</span>
    </DecorateButton>
  </div>
</template>

<script setup lang="ts">
import DecorateButton from './DecorateButton.vue'

interface Props {
  /** テキストエリア要素への参照 */
  textareaRef: HTMLTextAreaElement | null
  /** 現在のテキスト値 */
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

/**
 * 選択範囲にタグを挿入する
 */
const addTag = (tagPrefix: string, tagSuffix: string = tagPrefix) => {
  const textarea = props.textareaRef
  if (!textarea) return

  const currentText = props.modelValue
  const selectionStart = textarea.selectionStart
  const selectionEnd = textarea.selectionEnd

  const replaced =
    currentText.slice(0, selectionStart) +
    `[[${tagPrefix}]]` +
    currentText.slice(selectionStart, selectionEnd) +
    `[[/${tagSuffix}]]` +
    currentText.slice(selectionEnd)

  emit('update:modelValue', replaced)

  // カーソル位置を調整（タグ内にカーソルを移動）
  nextTick(() => {
    const newPosition =
      selectionStart +
      `[[${tagPrefix}]]`.length +
      (selectionEnd - selectionStart)
    textarea.focus()
    textarea.setSelectionRange(newPosition, newPosition)
  })
}

/**
 * ルビタグを挿入する
 */
const addRubyTag = () => {
  const textarea = props.textareaRef
  if (!textarea) return

  const currentText = props.modelValue
  const selectionStart = textarea.selectionStart
  const selectionEnd = textarea.selectionEnd

  const replaced =
    currentText.slice(0, selectionStart) +
    `[[ruby]]${currentText.slice(selectionStart, selectionEnd)}[[rt]][[/rt]][[/ruby]]` +
    currentText.slice(selectionEnd)

  emit('update:modelValue', replaced)

  // カーソル位置をルビ入力位置に移動
  nextTick(() => {
    const selectedText = currentText.slice(selectionStart, selectionEnd)
    const rtPosition = selectionStart + `[[ruby]]${selectedText}[[rt]]`.length
    textarea.focus()
    textarea.setSelectionRange(rtPosition, rtPosition)
  })
}
</script>
