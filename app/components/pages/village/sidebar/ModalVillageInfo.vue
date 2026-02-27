<template>
  <Modal v-model="isOpenModel" title="村の設定" @close="$emit('close')">
    <div v-if="village" class="space-y-4 text-left">
      <!-- 設定テーブル -->
      <div
        class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <table
          class="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700"
        >
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                class="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300"
              >
                設定
              </th>
              <th
                class="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300"
              ></th>
            </tr>
          </thead>
          <tbody
            class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
          >
            <template v-for="(setting, index) in settings" :key="index">
              <!-- 設定行 -->
              <tr
                class="transition-colors"
                :class="setting.description ? 'cursor-pointer' : ''"
                @click="setting.description && toggleDescription(index)"
              >
                <td
                  class="px-3 py-2 font-medium text-gray-900 dark:text-gray-100"
                >
                  <div class="flex items-center gap-1">
                    {{ setting.name }}
                    <button
                      v-if="setting.description"
                      type="button"
                      class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                      :aria-label="`${setting.name}の説明を${expandedRows[index] ? '閉じる' : '開く'}`"
                    >
                      <Icon
                        name="heroicons:question-mark-circle"
                        class="h-4 w-4"
                      />
                    </button>
                  </div>
                </td>
                <td
                  class="px-3 py-2 whitespace-pre-wrap text-gray-700 dark:text-gray-300"
                  v-html="formatValue(setting.value)"
                />
              </tr>
              <!-- 説明行（展開時） -->
              <tr v-if="setting.description && expandedRows[index]">
                <td
                  colspan="2"
                  class="bg-gray-50 px-3 py-2 text-gray-600 dark:bg-gray-900 dark:text-gray-400"
                  v-html="formatValue(setting.description)"
                />
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'
import { useVillage } from '~/composables/village/useVillage'
import Modal from '~/components/ui/modal/Modal.vue'
import Icon from '~/components/ui/icon/Icon.vue'
import type { DeepReadonly } from 'vue'
import type { VillageRules } from '~/lib/api/types'

interface SettingItem {
  name: string
  value: string
  description?: string | null
}

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

// Composables
const { village, charachips } = useVillage()

// State
const expandedRows = ref<Record<number, boolean>>({})

// プロローグまたは廃村かどうか
const isPrologueOrCancel = computed(() => {
  if (!village.value) return false
  return (
    village.value.status.code === VILLAGE_STATUS.PROLOGUE ||
    village.value.status.code === VILLAGE_STATUS.CANCEL
  )
})

// 設定一覧を生成
const settings = computed<SettingItem[]>(() => {
  if (!village.value) return []

  const items: SettingItem[] = []
  const v = village.value
  const charachipList = charachips.value

  // 村の作成者
  let creator = v.creator_player.nickname
  if (v.creator_player.twitter_user_name) {
    creator = `@${v.creator_player.twitter_user_name}`
  }
  items.push({
    name: '村の作成者',
    value: creator,
    description: '村の作成者です。'
  })

  // 人数設定
  if (isPrologueOrCancel.value) {
    const capacity = v.setting.capacity
    items.push({
      name: '最低人数',
      value: `${capacity.min}人`,
      description:
        '開始予定日時時点でこの人数が集まると進行中に遷移します（集まらなければ廃村となります）。\nダミーを含む人数です。'
    })
    items.push({
      name: '最大人数',
      value: `${capacity.max}人`,
      description:
        'この人数まで参加することができます。\nダミーを含む人数です。'
    })
  } else {
    items.push({
      name: '人数',
      value: `${v.participant.count}人`
    })
  }

  // 時間設定
  const timeSetting = v.setting.time
  if (v.status.code === VILLAGE_STATUS.PROLOGUE) {
    items.push({
      name: '開始日時',
      value: formatDatetime(timeSetting.start_datetime)
    })
  }
  items.push({
    name: '更新間隔',
    value: formatInterval(timeSetting.day_change_interval_seconds),
    description: '実際にこの時間が経過すると村の1日が進行します。'
  })
  items.push({
    name: '発言可能時間',
    value: formatSayableTime(
      timeSetting.silent_hours,
      timeSetting.sayable_start,
      timeSetting.sayable_end
    ),
    description:
      '進行中に通常発言が可能な時間です。\n24時間の場合はいつでも発言できます。\n通常発言以外（独り言や死者の呻き、人狼の囁き等）はいつでも発言できます。'
  })

  // キャラチップ設定
  if (charachipList && charachipList.length > 0) {
    items.push({
      name: 'キャラチップ',
      value: charachipList.map((c) => c.name).join('、')
    })

    // ダミーキャラを探す
    const dummyCharaId = v.setting.charachip.dummy_chara_id
    const dummyMember = v.participant.member_list.find(
      (member) => member.chara.id === dummyCharaId
    )

    if (dummyMember) {
      items.push({
        name: 'ダミーキャラ',
        value: dummyMember.chara.chara_name.name,
        description:
          '最初に人狼に襲撃されるキャラです。\n1日目の人狼の襲撃はこのキャラに固定されます。'
      })
    }
  }

  // 編成設定
  const organizations = v.setting.organizations.organization
  if (isPrologueOrCancel.value) {
    // プロローグ・廃村の場合は全編成を表示
    const org = Object.entries(organizations)
      .map(([count, roles]) => `${count}人: ${roles}`)
      .join('\n')
    items.push({
      name: '編成',
      value: org,
      description: '人数に応じた配役です。役職詳細は仕様ページを参照ください。'
    })
  } else {
    // それ以外は現在の人数の編成のみ表示
    const participantCount = v.participant.count
    const org = organizations[participantCount.toString()] || ''
    items.push({
      name: '編成',
      value: org,
      description: 'この村の配役です。役職詳細は仕様ページを参照ください。'
    })
  }

  // ルール設定
  addRuleSettings(items, v.setting.rules)

  // パスワード設定
  items.push({
    name: '入村パスワード',
    value: v.setting.password.join_password_required ? 'あり' : 'なし',
    description: '「あり」の場合、参加する際にパスワード入力が必要になります。'
  })

  return items
})

// ルール設定を追加
const addRuleSettings = (
  items: SettingItem[],
  rules: DeepReadonly<VillageRules> | VillageRules
) => {
  // 投票
  items.push({
    name: '投票',
    value: rules.open_vote ? '記名投票' : '無記名投票',
    description:
      '「記名投票」の場合、処刑の投票結果について、誰が誰に投票したかがわかります。\n「無記名投票」の場合、誰に何票入ったかのみがわかります。'
  })

  // 役職希望
  items.push({
    name: '役職希望',
    value: rules.available_skill_request ? '有効' : '無効',
    description:
      '「有効」の場合、割り当てられる役職の希望を出すことができます（自分以外の希望は見られません）。\n他に誰も希望していなかった場合はその役職が割り当てられます。'
  })

  // 見学
  items.push({
    name: '見学',
    value: rules.available_spectate ? '可能' : '不可',
    description:
      '「可能」の場合、見学者として参加できます。\n見学者は死亡した人とのみ会話することができます（プロローグとエピローグでは全員と会話できます）。'
  })

  // 墓下役職公開
  items.push({
    name: '墓下役職公開',
    value: rules.open_skill_in_grave ? '公開' : '非公開',
    description:
      '「公開」の場合、死亡した人と見学者は全員の役職を知ることができます。'
  })

  // 墓下会話公開
  items.push({
    name: '墓下会話公開',
    value: rules.visible_grave_message ? '公開' : '非公開',
    description:
      '「公開」の場合、生存している参加者が死者の呻きと見学者の発言を見られるようになります。'
  })

  // 突然死
  items.push({
    name: '突然死',
    value: rules.available_suddenly_death ? 'あり' : 'なし',
    description:
      '「あり」の場合、日付更新のタイミングで、前日に一度も通常発言をしなかった生存者が突然死します。'
  })

  // 時短希望
  items.push({
    name: '時短希望',
    value: rules.available_commit ? 'あり' : 'なし',
    description:
      '「あり」の場合、生存者全員が時短を希望すると、日付が更新されます。\n時短により余った時間は翌日に繰り越されます。'
  })

  // 発言制限
  const restricts = rules.message_restrict.restrict_list
    .map((restrict) => {
      return `${restrict.type.name}: 1発言ごとに${restrict.length}文字${restrict.line}行まで、1日に${restrict.count}回まで`
    })
    .join('\n')

  if (restricts) {
    items.push({
      name: '発言制限',
      value: restricts,
      description:
        '発言文字数や発言回数の制限です。\n記載がない発言種別は1発言ごとに200文字20行で、1日の回数は無制限となります。'
    })
  }

  // ダミー役欠け
  items.push({
    name: 'ダミー役欠け',
    value: rules.available_dummy_skill ? 'あり' : 'なし',
    description:
      '「あり」の場合、ダミーキャラに村人以外の役職が割り当てられる可能性があります。\n「なし」の場合、必ず村人が割り当てられます。'
  })
}

// 行の展開切り替え
const toggleDescription = (index: number) => {
  expandedRows.value = {
    ...expandedRows.value,
    [index]: !expandedRows.value[index]
  }
}

// 値のフォーマット（改行をBRタグに変換）
const formatValue = (value: string | null | undefined): string => {
  if (!value) return ''
  return escapeHtml(value).replace(/\n/g, '<br />')
}

// HTMLエスケープ
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (char) => map[char] || char)
}

// 日時フォーマット
const formatDatetime = (datetime: string): string => {
  const date = new Date(datetime)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}/${month}/${day} ${hours}:${minutes}`
}

// 秒数を時間表記に変換
const formatInterval = (seconds: number): string => {
  let result = ''
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  if (h !== 0) result += `${h}時間`
  if (m !== 0) result += `${m}分`
  if (s !== 0) result += `${s}秒`

  return result || '0秒'
}

interface LocalTime {
  hour?: number
  minute?: number
  second?: number
  nano?: number
}

// LocalTimeを時刻文字列に変換
const formatLocalTime = (time: LocalTime | string): string => {
  if (typeof time === 'string') {
    return time.substring(0, 5)
  }
  const hour = String(time.hour ?? 0).padStart(2, '0')
  const minute = String(time.minute ?? 0).padStart(2, '0')
  return `${hour}:${minute}`
}

// LocalTimeから時間を取得
const getHourFromLocalTime = (time: LocalTime | string): number => {
  if (typeof time === 'string') {
    return parseInt(time.substring(0, 2), 10)
  }
  return time.hour ?? 0
}

// 発言可能時間を計算
const formatSayableTime = (
  silentHours: number | undefined,
  sayableStart: LocalTime | string,
  sayableEnd: LocalTime | string
): string => {
  if (!silentHours || silentHours === 0) return '24時間'

  const start = formatLocalTime(sayableStart)
  const end = formatLocalTime(sayableEnd)
  const startHour = getHourFromLocalTime(sayableStart)
  const endHour = getHourFromLocalTime(sayableEnd)
  const isNextday = startHour > endHour

  return `${start} - ${isNextday ? '翌' : ''}${end}(${24 - silentHours}時間)`
}
</script>
