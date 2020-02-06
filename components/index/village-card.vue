<template>
  <div class="column is-half-tablet">
    <div v-if="village != null" class="card">
      <header class="card-header">
        <nuxt-link
          :to="{ path: 'village', query: { id: village.id } }"
          class="card-header-title has-text-grey"
          >{{ village.name }}</nuxt-link
        >
      </header>
      <div class="card-content">
        <div class="content has-text-left">
          <p class="has-text-left is-size-7">状態: {{ status }}</p>
          <p class="has-text-left is-size-7">
            参加人数: {{ participantStatus }}
          </p>
          <p v-if="daychangeDatetime" class="has-text-left is-size-7">
            更新: {{ daychangeDatetime }}
          </p>
        </div>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item has-text-left">
          <p class="content has-text-left is-size-7">{{ village.comment }}</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
// type
import Village from '~/components/type/village'
import VillageDay from '~/components/type/village-day'

@Component({})
export default class VillageCard extends Vue {
  @Prop({ type: Object })
  private village!: Village

  private get status(): string {
    const villageStatus = this.village.status.name
    if (this.village.status.code !== 'PROGRESS') return villageStatus
    return `${villageStatus} ${this.nowDate}`
  }

  private get latestday(): VillageDay {
    return this.village.day.day_list.slice(-1)[0]
  }

  private get nowDate(): string | null {
    if (this.village.status.code !== 'PROGRESS') return null
    return `${this.latestday.day}日目`
  }

  private get daychangeDatetime(): string | null {
    if (['COMPLETED', 'CANCEL'].includes(this.village.status.code)) return null
    return this.latestday.day_change_datetime.substring(0, 16)
  }

  private get participantStatus(): string {
    const participantCount: number = this.village.participant.count
    const spectatorCount: number = this.village.spectator.count
    if (this.village.status.code === 'PROLOGUE') {
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
