<template>
  <div class="village-list-area">
    <div class="p-t-20 p-b-40">
      <div class="p-t-20 p-b-20">
        <p class="is-size-5-tablet is-size-6-mobile spotlight-shadow">
          自動生成村
        </p>
      </div>
      <div class="m-l-30 m-r-30">
        <div
          v-if="loadingVillages"
          style="display:block; width: 100%; height: 300px;"
        >
          <loading :message="'村情報を読み込み中'" />
        </div>
        <div v-if="!loadingVillages && villages.length > 0" class="columns">
          <village-card
            v-for="village in villages"
            :key="village.key"
            :village="village"
          />
        </div>
        <div v-if="!loadingVillages && villages.length === 0">
          <p class="is-size-5-tablet is-size-6-mobile spotlight-shadow">
            開催中の村はありません
          </p>
        </div>
      </div>
    </div>
    <div class="m-l-20 m-r-20 columns">
      <div v-if="canCreateVillage" class="column is-6">
        <shadow-button
          :link="'/create-village'"
          :text="'村を作成'"
          :icon="'plus-circle'"
        />
      </div>
      <div class="column" :class="canCreateVillage ? 'is-6' : 'is-12'">
        <shadow-button
          :link="'/village-list'"
          :text="'終了した村'"
          :icon="'th-list'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import shadowButton from '~/components/index/shadow-button.vue'
import loading from '~/components/loading.vue'
import VillageCard from '~/components/index/village-card.vue'
import Village from '~/components/type/village'
import VillageDay from '~/components/type/village-day'
import MyselfPlayer from '~/components/type/myself-player.ts'
import { VILLAGE_STATUS } from '~/components/const/consts'

@Component({
  components: {
    loading,
    shadowButton,
    VillageCard
  }
})
export default class VillageList extends Vue {
  @Prop({ type: Array })
  private villages!: Village[]

  @Prop({ type: Boolean })
  private loadingVillages!: boolean

  /** data */

  /** computed */
  private get user(): MyselfPlayer | null {
    return this.$store.getters.getPlayer
  }

  private get canCreateVillage(): boolean {
    const player = this.user
    if (player == null) return false
    return player.id === 1 // しばらくは管理者のみ建てられるようにする
    // return player.available_create_village
  }

  private get tableVillages(): any[] {
    if (this.villages == null) return []
    return this.villages.map((village: Village) => ({
      village_id: village.id,
      village_name: village.name,
      status: this.status(village),
      participant_count: this.participantStatus(village),
      daychange_datetime: this.daychangeDatetime(village)
    }))
  }

  private status(village: Village): string {
    const villageStatus = village.status.name
    if (village.status.code !== VILLAGE_STATUS.PROGRESS) return villageStatus
    return `${villageStatus} ${this.nowDate(village)}`
  }

  private latestday(village: Village): VillageDay {
    return village.day.day_list.slice(-1)[0]
  }

  private nowDate(village: Village): string | null {
    if (village.status.code !== VILLAGE_STATUS.PROGRESS) return null
    return `${this.latestday(village).day}日目`
  }

  private daychangeDatetime(village: Village): string | null {
    if (
      [VILLAGE_STATUS.COMPLETE, VILLAGE_STATUS.CANCEL].includes(
        village.status.code
      )
    )
      return null
    return this.latestday(village).day_change_datetime.substring(0, 16)
  }

  private participantStatus(village: Village): string {
    const participantCount: number = village.participant.count
    const spectatorCount: number = village.spectator.count
    if (village.status.code === VILLAGE_STATUS.PROLOGUE) {
      return (
        `${participantCount}` +
        `/${village.setting.capacity.max}` +
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
.village-list-area {
  background: linear-gradient(#0a0a1a 0%, #112 50%, #0a0a1a 100%);
  color: $white;
}
</style>
