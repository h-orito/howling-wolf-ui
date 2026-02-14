<template>
  <div v-if="situation" class="my-2 rounded border border-gray-300 p-3 text-xs">
    <h3 class="mb-2 font-bold">発言</h3>
    <div class="space-y-2">
      <!-- 発言タイプ選択 -->
      <FormSelect
        v-if="messageTypeOptions.length > 1"
        v-model="selectedMessageType"
        label="発言種別"
        :options="messageTypeOptions"
      />

      <!-- 秘話宛先 -->
      <FormSelect
        v-if="isSecretSay && targetOptions.length > 0"
        v-model="selectedTargetId"
        label="秘話宛先"
        :options="targetOptions"
      />

      <!-- 表情選択 -->
      <FormSelect
        v-if="faceOptions.length > 1"
        v-model="selectedFaceType"
        label="表情"
        :options="faceOptions"
      />

      <!-- 発言テキスト -->
      <FormTextarea
        v-model="messageText"
        label="発言内容"
        :rows="5"
        :placeholder="sayPlaceholder"
      />

      <!-- 残り発言数 -->
      <div v-if="currentRestrict" class="text-gray-500">
        残り{{ currentRestrict.remaining_count ?? 0 }}/{{
          currentRestrict.max_count ?? 0
        }}回 (最大{{ currentRestrict.max_length }}文字)
      </div>

      <!-- 送信ボタン -->
      <UiButton :disabled="!canSay" @click="handleSay">発言する</UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/button/index.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import FormTextarea from '~/components/ui/form/FormTextarea.vue'
import { useVillage } from '~/composables/village/useVillage'
import { useMessage } from '~/composables/village/useMessage'
import { useVillageSayStatus } from '~/composables/village/useVillageSayStatus'
import { useSituation } from '~/composables/village/useSituation'

const { situation } = useSituation()
const { villageId } = useVillage()
const { loadMessages } = useMessage()
const { setHasInputText } = useVillageSayStatus()
const { apiCall } = useApi()

const messageText = ref('')
const selectedMessageType = ref('')
const selectedTargetId = ref<string>('')
const selectedFaceType = ref('')

// 発言タイプ選択肢
const messageTypeOptions = computed(() => {
  return (
    situation.value?.say.selectable_message_type_list.map((mt) => ({
      value: mt.message_type.code,
      label: mt.message_type.name
    })) ?? []
  )
})

// 表情選択肢
const faceOptions = computed(() => {
  return (
    situation.value?.say.selectable_face_type_list.map((face) => ({
      value: face.type,
      label: face.type
    })) ?? []
  )
})

const isSecretSay = computed(() => selectedMessageType.value === 'SECRET_SAY')

// 秘話宛先
const targetOptions = computed(() => {
  const mt = situation.value?.say.selectable_message_type_list.find(
    (m) => m.message_type.code === selectedMessageType.value
  )
  if (!mt) return []
  return mt.target_list.map((t) => ({
    value: String(t.id),
    label: t.chara.chara_name.name
  }))
})

const currentRestrict = computed(() => {
  const mt = situation.value?.say.selectable_message_type_list.find(
    (m) => m.message_type.code === selectedMessageType.value
  )
  return mt?.restrict ?? null
})

const sayPlaceholder = computed(() => {
  const restrict = currentRestrict.value
  if (restrict) {
    return `最大${restrict.max_length}文字`
  }
  return ''
})

const canSay = computed(() => {
  if (!messageText.value.trim()) return false
  if (
    currentRestrict.value &&
    (currentRestrict.value.remaining_count ?? 0) <= 0
  )
    return false
  if (isSecretSay.value && !selectedTargetId.value) return false
  return true
})

// デフォルト値の設定
watch(
  () => situation.value?.say,
  (saySituation) => {
    if (!saySituation) return
    if (saySituation.default_message_type && !selectedMessageType.value) {
      selectedMessageType.value = saySituation.default_message_type.code
    }
    const firstFace = saySituation.selectable_face_type_list[0]
    if (firstFace && !selectedFaceType.value) {
      selectedFaceType.value = firstFace.type
    }
  },
  { immediate: true }
)

// 入力状態の管理
watch(messageText, (text) => {
  setHasInputText(text.length > 0)
})

const handleSay = async () => {
  try {
    await apiCall(`/village/${villageId.value}/say`, {
      method: 'POST',
      body: {
        message_type: selectedMessageType.value,
        message: messageText.value,
        face_type: selectedFaceType.value || 'NORMAL'
      }
    })
    messageText.value = ''
    setHasInputText(false)
    await loadMessages()
  } catch (error) {
    console.error('発言に失敗しました:', error)
  }
}
</script>
