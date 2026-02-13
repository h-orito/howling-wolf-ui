<template>
  <div class="village-card">
    <div class="card-content">
      <div class="text-left text-sm">
        <p>更新時間: {{ reservedVillage.start_time.substring(0, 5) }}</p>
        <p>編成: {{ organization }}</p>
        <p>発言可能時間: {{ sayableTime }}</p>
        <p>ダミー役欠け: {{ dummySkill }}</p>
        <p>初心者村か: {{ forBeginner }}</p>
        <p>役職希望: {{ skillRequest }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ReservedVillageView } from '~/lib/api/types'
import { ORGANIZATION_TEMPLATE } from '~/lib/api/organization-constants'

const props = defineProps<{
  reservedVillage: ReservedVillageView
}>()

const sayableTime = computed(() => {
  const silentHours = props.reservedVillage.silent_hours
  const start = props.reservedVillage.sayable_start
  const end = props.reservedVillage.sayable_end
  if (start === end) return '24時間'
  return `${start.substring(0, 5)} - ${end.substring(0, 5)}（${24 - silentHours}時間）`
})

const organization = computed(() => {
  const org = props.reservedVillage.organization
  const shortOrg = ORGANIZATION_TEMPLATE.get(org)
  return shortOrg ? `${org}（${shortOrg}編成）` : `${org.length}人: ${org}`
})

const dummySkill = computed(() => {
  return props.reservedVillage.available_dummy_skill ? 'あり' : 'なし'
})

const forBeginner = computed(() => {
  return props.reservedVillage.for_beginner ? 'はい' : 'いいえ'
})

const skillRequest = computed(() => {
  return props.reservedVillage.can_skill_request ? '可能' : '不可'
})
</script>

<style scoped>
.village-card {
  background-image: url('/image/top-bg.jpg');
  background-size: cover;
  color: white;
  border: 1px solid white;
  border-radius: 4px;
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
</style>
