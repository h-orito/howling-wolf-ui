<template>
  <div class="column is-half-tablet">
    <nuxt-link
      :to="{ path: 'village', query: { id: village.id } }"
      class="spotlight-shadow"
    >
      <div class="card village-card">
        <header class="card-header village-card-header">
          <p class="card-header-title village-card-header-title">
            {{ villageName }}
          </p>
        </header>
        <div class="card-content">
          <div class="content has-text-left is-size-7">
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
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// type
import SimpleVillage from '~/components/type/simple-village'
import VillageDay from '~/components/type/village-day'
import VillageTime from '~/components/type/village-time'
import {
  VILLAGE_STATUS,
  ORGANIZATION_TEMPLATE
} from '~/components/const/consts'

@Component({})
export default class VillageCard extends Vue {
  @Prop({ type: Object })
  private village!: SimpleVillage

  private get villageName(): string {
    const name = this.village.name
    const isForBeginner = this.village.setting.rules.for_beginner
    return `${name}${isForBeginner ? '（初心者村）' : ''}`
  }

  private get status(): string {
    const villageStatus = this.village.status.name
    if (this.village.status.code !== VILLAGE_STATUS.PROGRESS)
      return villageStatus
    return `${villageStatus} ${this.nowDate}`
  }

  private get latestday(): VillageDay {
    return this.village.day.day_list.slice(-1)[0]
  }

  private get nowDate(): string | null {
    if (this.village.status.code !== VILLAGE_STATUS.PROGRESS) return null
    return `${this.latestday.day}日目`
  }

  private get daychangeDatetime(): string | null {
    if (
      [VILLAGE_STATUS.COMPLETE, VILLAGE_STATUS.CANCEL].includes(
        this.village.status.code
      )
    )
      return null
    return this.latestday.day_change_datetime.substring(0, 16)
  }

  private get participantStatus(): string {
    const participantCount: number = this.village.participant.count
    const spectatorCount: number = this.village.spectator.count
    if (this.village.status.code === VILLAGE_STATUS.PROLOGUE) {
      return (
        `${participantCount}` +
        `/${this.village.setting.capacity.max}` +
        `${spectatorCount === 0 ? '' : '+' + spectatorCount}`
      )
    } else {
      return (
        `${participantCount}` +
        `${spectatorCount === 0 ? '' : '+' + spectatorCount}`
      )
    }
  }

  private get sayableTime(): string {
    const timeSetting: VillageTime = this.village.setting.time
    const silentHours: number | null = timeSetting.silent_hours
    if (!silentHours) return '24時間'
    const start: string = timeSetting.sayable_start
    const end: string = timeSetting.sayable_end
    if (start === end) return '24時間'
    return `${start.substring(0, 5)} - ${end.substring(0, 5)}（${24 -
      silentHours}時間）`
  }

  private get organization(): string {
    const org = this.village.setting.organizations.organization[
      this.village.setting.capacity.max
    ]
    const shortOrg = ORGANIZATION_TEMPLATE.get(org)
    return shortOrg ? `${org}（${shortOrg}編成）` : `${org.length}人: ${org}`
  }

  private get dummySkill(): string {
    return this.village.setting.rules.available_dummy_skill ? 'あり' : 'なし'
  }

  private get skillRequest(): string {
    return this.village.setting.rules.available_skill_request ? '可能' : '不可'
  }
}
</script>

<style lang="scss" scoped>
.village-card {
  background-image: url('~static/image/top-bg.jpg');
  background-size: cover;
  color: $white;
  border: 1px solid $white;
  border-radius: 4px;
  cursor: pointer;

  .village-card-header {
    border-bottom: 1px solid $white;

    .village-card-header-title {
      color: $white !important;
    }
  }
}
</style>
