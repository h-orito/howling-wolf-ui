<template>
  <div class="column is-half-tablet">
    <div v-if="village != null" class="card">
      <header class="card-header">
        <nuxt-link
          :to="{ path: 'long-village', query: { id: village.id } }"
          class="card-header-title has-text-grey"
          >{{ village.name }}</nuxt-link
        >
      </header>
      <div class="card-content">
        <div class="content has-text-left">
          <b-tag rounded>{{ village.status.name }}</b-tag>
          <b-tag rounded>{{ '長期' }}</b-tag>
        </div>
        <div class="content has-text-left">
          <p class="has-text-left is-size-7">
            作成者: {{ village.creator_player_name }}
          </p>
          <p class="has-text-left is-size-7">
            参加人数:
            {{ participantStatus(village) }}
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
import Village from '~/components/type/village'
@Component({})
export default class VillageCard extends Vue {
  @Prop({ type: Object })
  private village!: Village

  private participantStatus(village: Village): string {
    const participantCount: number = village.participant.count
    const spectatorCount: number = village.spectator.count
    return (
      `${participantCount}` +
      `/${village.setting.capacity.max}` +
      `${spectatorCount === 0 ? '' : '+' + spectatorCount}`
    )
  }
}
</script>
