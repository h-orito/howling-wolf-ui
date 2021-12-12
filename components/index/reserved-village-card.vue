<template>
  <div class="column is-half-tablet">
    <div class="card village-card">
      <div class="card-content">
        <div class="content has-text-left is-size-7">
          <p>更新時間: {{ reservedVillage.start_time.substring(0, 5) }}</p>
          <p>編成: {{ organization }}</p>
          <p>発言可能時間: {{ sayableTime }}</p>
          <p>ダミー役欠け: {{ dummySkill }}</p>
          <p>初心者村か: {{ forBeginner }}</p>
          <p>役職希望: {{ skillRequest }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// type
import ReservedVillage from '~/components/type/reserved-village'
import { ORGANIZATION_TEMPLATE } from '~/components/const/consts'

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

  private get organization(): string {
    const org = this.reservedVillage.organization
    const shortOrg = ORGANIZATION_TEMPLATE.get(org)
    return shortOrg ? `${org}（${shortOrg}編成）` : `${org.length}人: ${org}`
  }

  private get dummySkill(): string {
    return this.reservedVillage.available_dummy_skill ? 'あり' : 'なし'
  }

  private get forBeginner(): string {
    return this.reservedVillage.for_beginner ? 'はい' : 'いいえ'
  }

  private get skillRequest(): string {
    return this.reservedVillage.can_skill_request ? '可能' : '不可'
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
