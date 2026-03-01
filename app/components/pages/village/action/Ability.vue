<template>
  <ActionPanel :title="ability.type.name" :panel-key="panelKey">
    <!-- 襲撃担当者選択（attacker_listがある場合のみ表示） -->
    <template v-if="ability.attacker_list.length > 0">
      <p class="text-sm text-gray-700 dark:text-gray-300">
        現在の襲撃担当者: {{ currentAttackerName }}
      </p>
      <FormGroup label="襲撃担当者">
        <template #help>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            猫又を襲撃した場合、襲撃担当者が道連れとなります。
          </p>
        </template>
        <FormSelect
          v-model="selectedAttackerId"
          :options="attackerOptions"
          :disabled="!ability.usable"
          size="sm"
        />
      </FormGroup>
      <hr class="border-gray-300 dark:border-gray-600" />
    </template>

    <!-- 現在のセット先 -->
    <p class="text-sm text-gray-700 dark:text-gray-300">
      現在の{{ ability.type.name }}先: {{ currentTargetName }}
    </p>

    <!-- エラーメッセージ -->
    <div
      v-if="abilityError"
      class="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ abilityError }}
    </div>

    <!-- ターゲット選択 -->
    <FormGroup label="対象">
      <FormSelect
        v-model="selectedTargetId"
        :options="targetOptions"
        :disabled="!canSelectTarget"
        placeholder="選択してください"
        size="sm"
      />
    </FormGroup>

    <!-- セットボタン -->
    <div class="flex justify-end">
      <UiButton
        :disabled="!canSubmit"
        :loading="submitting"
        @click="handleSetAbility"
      >
        {{ ability.type.name }}セットする
      </UiButton>
    </div>
  </ActionPanel>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import ActionPanel from './ActionPanel.vue'
import FormGroup from '~/components/ui/form/FormGroup.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import UiButton from '~/components/ui/button/index.vue'
import { useAbility } from '~/composables/village/action/useAbility'
import { useActionReset } from '~/composables/village/action/useActionReset'
import type { VillageAbilitySituation } from '~/lib/api/types'

interface Props {
  ability: DeepReadonly<VillageAbilitySituation> | VillageAbilitySituation
}

const props = defineProps<Props>()

const emit = defineEmits<{
  complete: [abilityName: string]
}>()

// Composables
const { submitting, error: abilityError, setAbility, clearError } = useAbility()
const { onReset } = useActionReset()

// パネルキー（能力タイプコードを使用）
const panelKey = computed(() => `ability-${props.ability.type.code}`)

// 現在の襲撃担当者の名前
const currentAttackerName = computed(() => {
  if (!props.ability.attacker) return 'なし'
  return props.ability.attacker.chara.chara_name.name
})

// 現在のターゲットの名前
const currentTargetName = computed(() => {
  if (!props.ability.target) return 'なし'
  return props.ability.target.chara.chara_name.name
})

// 襲撃担当者リスト（セレクトボックス用）
const attackerOptions = computed(() => {
  return props.ability.attacker_list.map((p) => ({
    label: p.chara.chara_name.name,
    value: p.id
  }))
})

// ターゲットリスト（セレクトボックス用）
// 「なし」オプションがある場合は先頭に追加
const targetOptions = computed(() => {
  const options: Array<{ label: string; value: number | string }> = []

  // 「なし」オプションを追加
  if (props.ability.available_no_target) {
    options.push({
      label: 'なし',
      value: 'none'
    })
  }

  // ターゲットリストを追加
  props.ability.target_list.forEach((p) => {
    options.push({
      label: p.chara.chara_name.name,
      value: p.id
    })
  })

  return options
})

// 選択された襲撃担当者ID（初期値は現在のセット先）
const selectedAttackerId = ref<number | null>(
  props.ability.attacker?.id ?? null
)

// 選択されたターゲットID（初期値は現在のセット先、またはnone）
const selectedTargetId = ref<number | string | null>(
  props.ability.target?.id ??
    (props.ability.available_no_target ? 'none' : null)
)

// 能力状況が変わったら選択をリセット
watch(
  () => props.ability.target?.id,
  (newTargetId) => {
    selectedTargetId.value =
      newTargetId ?? (props.ability.available_no_target ? 'none' : null)
  }
)

watch(
  () => props.ability.attacker?.id,
  (newAttackerId) => {
    selectedAttackerId.value = newAttackerId ?? null
  }
)

// ターゲット選択可能かどうか
const canSelectTarget = computed(() => {
  if (!props.ability.usable) return false
  return props.ability.target_list.length > 0
})

// 送信可能かどうか
const canSubmit = computed(() => {
  if (submitting.value) return false
  if (!props.ability.usable) return false
  if (props.ability.target_list.length === 0) return false
  // 「なし」が許可されている場合は、ターゲット未選択でもOK
  if (props.ability.available_no_target) {
    return true
  }
  // 「なし」が許可されていない場合は、ターゲットが選択されている必要がある
  return selectedTargetId.value != null && selectedTargetId.value !== 'none'
})

// 能力セット実行
const handleSetAbility = async () => {
  if (!canSubmit.value) return

  clearError()

  // 'none'の場合はnullとして送信
  const targetId =
    selectedTargetId.value === 'none'
      ? null
      : (selectedTargetId.value as number | null)
  const attackerId =
    props.ability.attacker_list.length > 0 ? selectedAttackerId.value : null

  const success = await setAbility(
    props.ability.type.code,
    targetId,
    attackerId
  )

  if (success) {
    emit('complete', props.ability.type.name)
  }
}

// リセット処理を登録
onReset(() => {
  clearError()
  selectedTargetId.value =
    props.ability.target?.id ??
    (props.ability.available_no_target ? 'none' : null)
  selectedAttackerId.value = props.ability.attacker?.id ?? null
})
</script>
