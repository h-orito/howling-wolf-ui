<template>
  <NuxtLink :to="`/village?id=${village.id}`" class="spotlight-shadow block">
    <div class="village-card">
      <header class="card-header">
        <p class="card-header-title text-left">
          {{ villageName }}
        </p>
      </header>
      <div class="card-content">
        <div class="text-left text-sm">
          <p>状態: {{ status }}</p>
          <p>参加人数: {{ participantStatus }}</p>
          <p v-if="daychangeDatetime">更新: {{ daychangeDatetime }}</p>
          <p>編成: {{ organization }}</p>
          <p>発言可能時間: {{ sayableTime }}</p>
          <p>ダミー役欠け: {{ dummySkill }}</p>
          <p>役職希望: {{ skillRequest }}</p>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { VillageView } from '~/lib/api/types'
import { VILLAGE_STATUS } from '~/lib/api/village-status-constants'
import { ORGANIZATION_TEMPLATE } from '~/lib/api/organization-constants'

const props = defineProps<{
  village: VillageView
}>()

const villageName = computed(() => {
  const name = props.village.name
  const isForBeginner = props.village.setting.rules.for_beginner
  return `${name}${isForBeginner ? '（初心者村）' : ''}`
})

const status = computed(() => {
  const villageStatus = props.village.status.name
  if (props.village.status.code !== VILLAGE_STATUS.IN_PROGRESS) {
    return villageStatus
  }
  return `${villageStatus} ${nowDate.value ?? ''}`
})

const latestday = computed(() => {
  const dayList = props.village.day.day_list
  return dayList[dayList.length - 1]
})

const nowDate = computed(() => {
  if (props.village.status.code !== VILLAGE_STATUS.IN_PROGRESS) return null
  return latestday.value ? `${latestday.value.day}日目` : null
})

const daychangeDatetime = computed(() => {
  const statusCode = props.village.status.code
  if (
    statusCode === VILLAGE_STATUS.COMPLETED ||
    statusCode === VILLAGE_STATUS.CANCEL
  ) {
    return null
  }
  const datetime = latestday.value?.day_change_datetime
  return datetime ? datetime.substring(0, 16) : null
})

const participantStatus = computed(() => {
  const participantCount = props.village.participant.count
  const spectatorCount = props.village.spectator.count
  const maxCapacity = props.village.setting.capacity.max

  if (props.village.status.code === VILLAGE_STATUS.PROLOGUE) {
    return (
      `${participantCount}` +
      `/${maxCapacity}` +
      `${spectatorCount === 0 ? '' : '+' + String(spectatorCount)}`
    )
  }
  return (
    `${participantCount}` +
    `${spectatorCount === 0 ? '' : '+' + String(spectatorCount)}`
  )
})

const sayableTime = computed(() => {
  const timeSetting = props.village.setting.time
  const silentHours = timeSetting.silent_hours
  if (!silentHours) return '24時間'
  const start = timeSetting.sayable_start
  const end = timeSetting.sayable_end
  if (!start || !end || start === end) return '24時間'
  return `${start.substring(0, 5)} - ${end.substring(0, 5)}（${24 - silentHours}時間）`
})

const organization = computed(() => {
  const maxCapacity = String(props.village.setting.capacity.max)
  const org = props.village.setting.organizations.organization[maxCapacity]
  if (!org) return '不明'
  const shortOrg = ORGANIZATION_TEMPLATE.get(org)
  return shortOrg ? `${org}（${shortOrg}編成）` : `${org.length}人: ${org}`
})

const dummySkill = computed(() => {
  return props.village.setting.rules.available_dummy_skill ? 'あり' : 'なし'
})

const skillRequest = computed(() => {
  return props.village.setting.rules.available_skill_request ? '可能' : '不可'
})
</script>

<style scoped>
.village-card {
  background-image: url('/image/top-bg.jpg');
  background-size: cover;
  color: white;
  border: 1px solid white;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.village-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.card-header {
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid white;
  padding: 0.75rem 1rem;
}

.card-header-title {
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
}

.card-content {
  padding: 1rem;
}

.card-content p {
  margin: 0.25rem 0;
  color: white;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding-top: 5px;
  padding-bottom: 5px;
}

.spotlight-shadow {
  text-decoration: none;
  display: block;
}
</style>
