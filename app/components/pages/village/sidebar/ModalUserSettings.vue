<template>
  <Modal v-model="isOpenModel" title="ユーザ設定">
    <div class="space-y-6">
      <!-- ページ分割 -->
      <section>
        <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          ページ分割
        </h4>
        <div class="space-y-3">
          <FormSwitch v-model="localSettings.isPaging" label="ページ分割する" />
          <div v-if="localSettings.isPaging" class="ml-1">
            <label class="mb-1 block text-xs text-gray-600 dark:text-gray-400">
              1ページあたりの発言数
            </label>
            <FormSelect
              v-model="localSettings.messagePerPage"
              :options="messagePerPageOptions"
              size="sm"
              class="max-w-37.5"
            />
          </div>
        </div>
      </section>

      <!-- 発言表示 -->
      <section>
        <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          発言表示
        </h4>
        <div class="space-y-3">
          <FormSwitch
            v-model="localSettings.isDispDate"
            label="日付を表示する"
          />
          <FormSwitch
            v-model="localSettings.isCharLarge"
            label="名前を大きく表示する"
          />
          <FormSwitch
            v-model="localSettings.isImgLarge"
            label="画像を大きく表示する"
          />
        </div>
      </section>

      <!-- テーマ -->
      <section>
        <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          テーマ
        </h4>
        <FormSwitch
          v-model="localSettings.isDarkTheme"
          label="ダークテーマにする"
        />
      </section>

      <!-- 操作 -->
      <section>
        <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          操作
        </h4>
        <div class="space-y-3">
          <FormSwitch
            v-model="localSettings.isOpenFilterNewtab"
            label="個人抽出を別タブで開く"
          />
          <FormSwitch
            v-model="localSettings.isPasteAnchor"
            label="アンカークリック時に発言欄に貼り付ける"
          />
        </div>
      </section>
    </div>

    <template #footer>
      <UiButton color="secondary" variant="outline" @click="close">
        閉じる
      </UiButton>
      <UiButton color="primary" :loading="saving" @click="save">
        保存する
      </UiButton>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/ui/modal/Modal.vue'
import FormSwitch from '~/components/ui/form/FormSwitch.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import UiButton from '~/components/ui/button/index.vue'
import { useUserSettings } from '~/composables/village/useUserSettings'
import { useMessage } from '~/composables/village/useMessage'
import { showSuccessToast } from '~/utils/toast'

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
  operation,
  setPaging,
  setTheme,
  setMessageDisplay,
  setOperation
} = useUserSettings()
const { loadMessages } = useMessage()

// ローカル設定（保存時にまとめて反映）
const localSettings = reactive({
  isPaging: true,
  messagePerPage: 50,
  isDispDate: false,
  isCharLarge: false,
  isImgLarge: false,
  isDarkTheme: false,
  isOpenFilterNewtab: false,
  isPasteAnchor: false
})

const saving = ref(false)

// 1ページあたりの発言数オプション
const messagePerPageOptions = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
  { label: '200', value: 200 }
]

// モーダル表示時に設定を読み込む
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      loadSettings()
    }
  }
)

const loadSettings = () => {
  localSettings.isPaging = paging.value.isPaging
  localSettings.messagePerPage = paging.value.messagePerPage
  localSettings.isDispDate = messageDisplay.value.isDispDate
  localSettings.isCharLarge = messageDisplay.value.isCharLarge
  localSettings.isImgLarge = messageDisplay.value.isImgLarge
  localSettings.isDarkTheme = theme.value.isDark
  localSettings.isOpenFilterNewtab = operation.value.isOpenFilterNewtab
  localSettings.isPasteAnchor = operation.value.isPasteAnchor
}

const save = () => {
  saving.value = true

  try {
    setPaging({
      isPaging: localSettings.isPaging,
      messagePerPage: localSettings.messagePerPage
    })

    setMessageDisplay({
      isDispDate: localSettings.isDispDate,
      isCharLarge: localSettings.isCharLarge,
      isImgLarge: localSettings.isImgLarge
    })

    setTheme({
      isDark: localSettings.isDarkTheme
    })

    setOperation({
      isOpenFilterNewtab: localSettings.isOpenFilterNewtab,
      isPasteAnchor: localSettings.isPasteAnchor
    })

    loadMessages()
    close()
    showSuccessToast('設定を保存しました')
  } finally {
    saving.value = false
  }
}

const close = () => {
  emit('close')
}
</script>
