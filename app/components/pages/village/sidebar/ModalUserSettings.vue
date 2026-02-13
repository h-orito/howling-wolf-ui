<template>
  <Modal v-model="isOpenModel" title="ユーザ設定" @close="$emit('close')">
    <div class="space-y-4 text-sm">
      <!-- ページング設定 -->
      <div>
        <h3 class="mb-2 font-bold">ページング</h3>
        <FormSwitch
          :model-value="paging.isPaging"
          label="ページングを使用"
          @update:model-value="handlePagingToggle"
        />
        <div v-if="paging.isPaging" class="mt-2">
          <FormNumberInput
            :model-value="paging.messagePerPage"
            label="1ページの発言数"
            :min="10"
            :max="200"
            :step="10"
            @update:model-value="handleMessagePerPageChange"
          />
        </div>
      </div>

      <!-- テーマ設定 -->
      <div>
        <h3 class="mb-2 font-bold">テーマ</h3>
        <FormSwitch
          :model-value="theme.isDark"
          label="ダークモード"
          @update:model-value="handleDarkModeToggle"
        />
      </div>

      <!-- 表示設定 -->
      <div>
        <h3 class="mb-2 font-bold">表示</h3>
        <FormSwitch
          :model-value="messageDisplay.isDispDate"
          label="日時を表示"
          @update:model-value="handleDispDateToggle"
        />
        <FormSwitch
          :model-value="messageDisplay.isCharLarge"
          label="名前を大きく表示"
          @update:model-value="handleCharLargeToggle"
        />
        <FormSwitch
          :model-value="messageDisplay.isImgLarge"
          label="画像を大きく表示"
          @update:model-value="handleImgLargeToggle"
        />
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/ui/modal/Modal.vue'
import FormSwitch from '~/components/ui/form/FormSwitch.vue'
import FormNumberInput from '~/components/ui/form/FormNumberInput.vue'
import { useUserSettings } from '~/composables/village/useUserSettings'
import { useMessage } from '~/composables/village/useMessage'

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

const {
  paging,
  theme,
  messageDisplay,
  setPaging,
  setTheme,
  setMessageDisplay
} = useUserSettings()
const { loadMessages } = useMessage()

const handlePagingToggle = (value: boolean) => {
  setPaging({ ...paging.value, isPaging: value })
  loadMessages()
}

const handleMessagePerPageChange = (value: number) => {
  setPaging({ ...paging.value, messagePerPage: value })
  loadMessages()
}

const handleDarkModeToggle = (value: boolean) => {
  setTheme({ isDark: value })
}

const handleDispDateToggle = (value: boolean) => {
  setMessageDisplay({ ...messageDisplay.value, isDispDate: value })
}

const handleCharLargeToggle = (value: boolean) => {
  setMessageDisplay({ ...messageDisplay.value, isCharLarge: value })
}

const handleImgLargeToggle = (value: boolean) => {
  setMessageDisplay({ ...messageDisplay.value, isImgLarge: value })
}
</script>
