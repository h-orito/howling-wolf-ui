<template>
  <div>
    <div v-if="!props.skillList || props.skillList.length === 0">
      <p>役職データを読み込み中...</p>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              役職
            </th>
            <th
              class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
            >
              略称
            </th>
            <th
              class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
            >
              所属陣営
            </th>
            <th
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              能力
            </th>
            <th
              class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
            >
              占い結果
            </th>
            <th
              class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
            >
              霊視結果
            </th>
            <th
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              発言可能
            </th>
            <th
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              可視
            </th>
            <th
              class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
            >
              勝敗判定
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <template v-for="skill in tableSkills" :key="skill.name">
            <tr>
              <td class="p-2 text-sm whitespace-nowrap text-gray-900">
                <button
                  v-if="skill.description"
                  class="text-left text-blue-600 hover:text-blue-800 hover:underline"
                  @click="toggleDetail(skill)"
                >
                  {{ skill.name }}
                </button>
                <span v-else>{{ skill.name }}</span>
              </td>
              <td
                class="p-2 text-center text-sm whitespace-nowrap text-gray-900"
              >
                {{ skill.short_name }}
              </td>
              <td
                class="p-2 text-center text-sm whitespace-nowrap text-gray-900"
              >
                {{ skill.camp }}
              </td>
              <td class="p-2 text-sm text-gray-900">
                <template
                  v-if="skill.ability_list && skill.ability_list.length > 0"
                >
                  <span
                    v-for="(ability, index) in skill.ability_list"
                    :key="index"
                  >
                    <span v-if="index > 0">, </span>
                    <a
                      :href="'#' + ability.code"
                      class="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {{ ability.name }}
                    </a>
                  </span>
                </template>
                <span v-else>-</span>
              </td>
              <td
                class="p-2 text-center text-sm whitespace-nowrap"
                :class="
                  skill.divine_result === '人狼'
                    ? 'font-semibold text-red-600'
                    : 'text-gray-900'
                "
              >
                {{ skill.divine_result }}
              </td>
              <td
                class="p-2 text-center text-sm whitespace-nowrap"
                :class="
                  skill.psychic_result === '人狼'
                    ? 'font-semibold text-red-600'
                    : 'text-gray-900'
                "
              >
                {{ skill.psychic_result }}
              </td>
              <td class="p-2 text-sm text-gray-900">
                {{ skill.sayable_message_types }}
              </td>
              <td class="p-2 text-sm text-gray-900">
                {{ skill.visible_message_types }}
              </td>
              <td
                class="p-2 text-center text-sm whitespace-nowrap"
                :class="
                  skill.count_camp === '人狼'
                    ? 'font-semibold text-red-600'
                    : 'text-gray-900'
                "
              >
                {{ skill.count_camp }}
              </td>
            </tr>
            <tr v-if="expandedSkills.has(skill.name)">
              <td colspan="9" class="bg-gray-50 p-2">
                <div class="text-sm whitespace-pre-wrap text-gray-700">
                  {{ skill.description }}
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SkillDetailView } from '~/lib/api/types'

const props = defineProps<{
  skillList: SkillDetailView[]
}>()

interface AbilityLink {
  name: string
  code: string
}

interface SkillTableRow {
  name: string
  short_name: string
  camp: string
  ability_list: AbilityLink[]
  divine_result: string
  psychic_result: string
  sayable_message_types: string
  visible_message_types: string
  count_camp: string
  description: string
}

const expandedSkills = ref(new Set<string>())

const tableSkills = computed<SkillTableRow[]>(() => {
  if (!props.skillList || props.skillList.length === 0) {
    return []
  }

  return props.skillList.map((skill): SkillTableRow => {
    let countCamp = '-'
    if (skill.count_camp) {
      if (skill.count_camp.name === '村人陣営') {
        countCamp = '人間'
      } else if (skill.count_camp.name === '人狼陣営') {
        countCamp = '人狼'
      }
    }

    return {
      name: skill.name,
      short_name: skill.short_name,
      camp: skill.win_judge_camp?.name ?? '-',
      ability_list: skill.manual_ability_list.map((ability) => ({
        name: ability.name,
        code: ability.code.toLowerCase()
      })),
      divine_result: skill.divine_result_wolf ? '人狼' : '人狼でない',
      psychic_result: skill.psychic_result_wolf ? '人狼' : '人狼でない',
      sayable_message_types:
        skill.sayable_skill_message_type_list
          .map((type) => type.name)
          .join(', ') || '-',
      visible_message_types:
        skill.viewable_skill_message_type_list
          .map((type) => type.name)
          .join(', ') || '-',
      count_camp: countCamp,
      description: skill.description
    }
  })
})

const toggleDetail = (skill: SkillTableRow) => {
  if (expandedSkills.value.has(skill.name)) {
    expandedSkills.value.delete(skill.name)
  } else {
    expandedSkills.value.add(skill.name)
  }
}
</script>
