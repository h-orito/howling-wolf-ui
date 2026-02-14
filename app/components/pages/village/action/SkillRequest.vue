<template>
  <ActionPanel title="役職希望" panel-key="skill-request">
    <!-- 現在の希望表示 -->
    <p class="text-sm text-gray-700 dark:text-gray-300">
      現在の希望: {{ currentRequest }}
    </p>

    <!-- エラーメッセージ -->
    <div
      v-if="error"
      class="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ error }}
    </div>

    <!-- 役職第1希望 -->
    <FormGroup label="役職第1希望">
      <FormSelect
        v-model="form.firstRequestSkillCode"
        :options="skillOptions"
        placeholder="選択してください"
        size="sm"
      />
    </FormGroup>

    <!-- 役職第2希望 -->
    <FormGroup label="役職第2希望">
      <FormSelect
        v-model="form.secondRequestSkillCode"
        :options="skillOptions"
        placeholder="選択してください"
        size="sm"
      />
    </FormGroup>

    <!-- 変更ボタン -->
    <div class="flex justify-end">
      <UiButton
        :disabled="!canSubmit"
        :loading="submitting"
        @click="handleChangeSkill"
      >
        役職希望変更する
      </UiButton>
    </div>
  </ActionPanel>
</template>

<script setup lang="ts">
import ActionPanel from './ActionPanel.vue'
import FormGroup from '~/components/ui/form/FormGroup.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import UiButton from '~/components/ui/button/index.vue'
import { useSkillRequest } from '~/composables/village/action/useSkillRequest'
import { useActionReset } from '~/composables/village/action/useActionReset'
import { useSituation } from '~/composables/village/useSituation'

const emit = defineEmits<{
  complete: []
}>()

// Composables
const { situation } = useSituation()
const { onReset } = useActionReset()
const { submitting, error, requestSkill, clearError } = useSkillRequest()

// フォーム状態
const form = reactive({
  firstRequestSkillCode: '',
  secondRequestSkillCode: ''
})

// 初期化済みフラグ
const isInitialized = ref(false)

// 現在の役職希望を初期値として設定（一度だけ）
watchEffect(() => {
  if (isInitialized.value) return

  const skillRequest = situation.value?.skill_request?.skill_request
  if (skillRequest) {
    form.firstRequestSkillCode = skillRequest.first.code
    form.secondRequestSkillCode = skillRequest.second.code
    isInitialized.value = true
  }
})

// 選択可能な役職リスト
const selectableSkillList = computed(
  () => situation.value?.skill_request?.selectable_skill_list ?? []
)

// セレクトボックスのオプション
const skillOptions = computed(() =>
  selectableSkillList.value.map((skill) => ({
    label: skill.name,
    value: skill.code
  }))
)

// 現在の希望表示
const currentRequest = computed(() => {
  const skillRequest = situation.value?.skill_request?.skill_request
  if (!skillRequest) return '-'
  return `${skillRequest.first.name} / ${skillRequest.second.name}`
})

// 変更ボタンを押下できるか
const canSubmit = computed(() => {
  return form.firstRequestSkillCode !== '' && form.secondRequestSkillCode !== ''
})

// 役職希望変更
const handleChangeSkill = async () => {
  const success = await requestSkill(
    String(form.firstRequestSkillCode),
    String(form.secondRequestSkillCode)
  )
  if (success) {
    emit('complete')
  }
}

// リセット処理を登録
onReset(() => {
  clearError()
})
</script>
