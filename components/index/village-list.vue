<template>
  <div class="menu-area">
    <div class="m-b-50">
      <p class="is-size-5 spotlight-shadow">
        自動生成村
      </p>
    </div>
    <div class="m-b-30">
      <div
        v-if="loadingVillages"
        style="display:block; width: 100%; height: 300px;"
      >
        <loading :message="'村情報を読み込み中'" />
      </div>
      <div v-if="!loadingVillages && villages.length > 0">
        <div
          v-for="chunkVillages in chunk(villages, 2)"
          :key="chunkVillages[0].id"
          class="columns"
        >
          <village-card
            v-for="village in chunkVillages"
            :key="village.key"
            :village="village"
          />
        </div>
      </div>
      <div v-if="!loadingVillages && villages.length === 0">
        <p class="is-size-5-tablet is-size-6-mobile spotlight-shadow">
          開催中の村はありません
        </p>
      </div>
    </div>
    <div class="columns">
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
import SimpleVillage from '~/components/type/simple-village'
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
  private villages!: SimpleVillage[]

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
    return this.villages.map((village: SimpleVillage) => ({
      village_id: village.id,
      village_name: village.name,
      status: this.status(village),
      participant_count: this.participantStatus(village),
      daychange_datetime: this.daychangeDatetime(village)
    }))
  }

  private status(village: SimpleVillage): string {
    const villageStatus = village.status.name
    if (village.status.code !== VILLAGE_STATUS.PROGRESS) return villageStatus
    return `${villageStatus} ${this.nowDate(village)}`
  }

  private latestday(village: SimpleVillage): VillageDay {
    return village.day.day_list.slice(-1)[0]
  }

  private nowDate(village: SimpleVillage): string | null {
    if (village.status.code !== VILLAGE_STATUS.PROGRESS) return null
    return `${this.latestday(village).day}日目`
  }

  private daychangeDatetime(village: SimpleVillage): string | null {
    if (
      [VILLAGE_STATUS.COMPLETE, VILLAGE_STATUS.CANCEL].includes(
        village.status.code
      )
    )
      return null
    return this.latestday(village).day_change_datetime.substring(0, 16)
  }

  private participantStatus(village: SimpleVillage): string {
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

  private chunk<T extends any[]>(arr: T, size: number): Array<Array<T>> {
    return arr.reduce(
      (newarr, _, i) =>
        i % size ? newarr : [...newarr, arr.slice(i, i + size)],
      [] as T[][]
    )
  }
}
</script>

<style lang="scss" scoped></style>
