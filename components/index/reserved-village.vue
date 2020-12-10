<template>
  <div class="menu-area">
    <div class="m-b-50">
      <p class="is-size-5 spotlight-shadow">
        作成される予定の村
      </p>
    </div>
    <div class="m-b-30">
      <div v-if="isLoading" style="display:block; width: 100%; height: 300px;">
        <loading :message="'村情報を読み込み中'" />
      </div>
      <div v-if="!isLoading && reservedVillages.list.length > 0">
        <div
          v-for="chunkVillages in chunk(reservedVillages.list, 2)"
          :key="chunkVillages[0].id"
          class="columns"
        >
          <reserved-village-card
            v-for="village in chunkVillages"
            :key="village.key"
            :reserved-village="village"
          />
        </div>
      </div>
      <div v-if="!isLoading && reservedVillages.list.length === 0">
        <p class="is-size-5-tablet is-size-6-mobile spotlight-shadow">
          作成予定の村はありません
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// components
import loading from '~/components/loading.vue'
import reservedVillageCard from '~/components/index/reserved-village-card.vue'
// type
import ReservedVillages from '~/components/type/reserved-villages'
import ReservedVillage from '~/components/type/reserved-village'
import VillageDay from '~/components/type/village-day'
import MyselfPlayer from '~/components/type/myself-player'
import { VILLAGE_STATUS } from '~/components/const/consts'

@Component({
  components: {
    loading,
    reservedVillageCard
  }
})
export default class ReservedVillageList extends Vue {
  @Prop({ type: Object })
  private reservedVillages!: ReservedVillages | null

  @Prop({ type: Boolean })
  private isLoading!: boolean

  /** data */

  /** computed */

  /** methods */
  private chunk<T extends any[]>(arr: T, size: number): Array<Array<T>> {
    return arr.reduce(
      (newarr, _, i) =>
        i % size ? newarr : [...newarr, arr.slice(i, i + size)],
      [] as T[][]
    )
  }
}
</script>
