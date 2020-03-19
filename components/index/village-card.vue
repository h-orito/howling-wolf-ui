<template>
  <div class="column is-half-tablet">
    <nuxt-link
      :to="{ path: 'village', query: { id: village.id } }"
      class="spotlight-shadow"
    >
      <div class="card village-card">
        <header class="card-header village-card-header">
          <p class="card-header-title village-card-header-title">
            {{ village.name }}
          </p>
        </header>
        <div class="card-content">
          <div class="content has-text-left is-size-7">
            <p>状態: {{ status }}</p>
            <p>参加人数: {{ participantStatus }}</p>
            <p v-if="daychangeDatetime">更新: {{ daychangeDatetime }}</p>
          </div>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// type
import Village from '~/components/type/village'
import VillageDay from '~/components/type/village-day'
import { VILLAGE_STATUS } from '~/components/const/consts'

@Component({})
export default class VillageCard extends Vue {
  @Prop({ type: Object })
  private village!: Village

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
}
</script>

<style lang="scss" scoped>
.village-card {
  background-color: rgba(0, 0, 0, 0);
  color: $white;
  border: 1px solid $white;
  border-radius: 4px;

  .village-card-header {
    border-bottom: 1px solid $white;

    .village-card-header-title {
      color: $white !important;
    }
  }
}
</style>
