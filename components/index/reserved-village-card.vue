<template>
  <div class="column is-half-tablet">
    <div class="card village-card">
      <div class="card-content">
        <div class="content has-text-left is-size-7">
          <p>
            作成日時:
            {{ reservedVillage.village_create_datetime.substring(0, 16) }}
          </p>
          <p>
            開始日時:
            {{ reservedVillage.village_start_datetime.substring(0, 16) }}
          </p>
          <p>
            更新時間:
            {{ daychangeTime(reservedVillage.village_start_datetime) }}
          </p>
          <p>編成: {{ reservedVillage.organization }}</p>
          <p>発言可能時間: {{ sayableTime }}</p>
          <p>ダミー役欠け: {{ dummySkill }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// type
import ReservedVillage from '~/components/type/reserved-village'

@Component({})
export default class ReservedVillageCard extends Vue {
  @Prop({ type: Object })
  private reservedVillage!: ReservedVillage

  private get sayableTime(): string {
    const silentHours: number = this.reservedVillage.silent_hours
    const start: string = this.reservedVillage.sayable_start
    const end: string = this.reservedVillage.sayable_end
    if (start === end) return '24時間'
    return `${start.substring(0, 5)} - ${end.substring(0, 5)}（${24 -
      silentHours}時間）`
  }

  private daychangeTime(datetime: string): string {
    return datetime.substring(11, 16)
  }

  private get dummySkill(): string {
    return this.reservedVillage.available_dummy_skill ? 'あり' : 'なし'
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

  .village-card-header {
    border-bottom: 1px solid $white;

    .village-card-header-title {
      color: $white !important;
    }
  }
}
</style>
