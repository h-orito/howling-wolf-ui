<template>
  <div>
    <ul class="daylist has-text-left m-t-5 m-b-5">
      <li v-for="(day, idx) in village.day.day_list" :key="day.village_day_id">
        <span v-if="idx !== 0"> &gt; </span>
        <a
          v-if="day.id !== displayVillageDayId"
          href="javascript:void(0);"
          @click="changeDay(day)"
          >{{ dayName(day) }}</a
        >
        <span v-if="day.id === displayVillageDayId">{{ dayName(day) }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// component
// type
import Village from '~/components/type/village'
import VillageDay from '~/components/type/village-day'
import { VILLAGE_STATUS } from '~/components/const/consts'

@Component({
  components: {}
})
export default class VillageDayList extends Vue {
  @Prop({ type: Number })
  private displayVillageDayId?: number | null

  private get village(): Village {
    return this.$store.getters.getVillage!
  }

  private get latestday(): VillageDay {
    return this.village.day.day_list.slice(-1)[0]
  }

  private dayName(villageDay: VillageDay): string {
    if (this.village.status.code === VILLAGE_STATUS.COMPLETE) {
      if (this.latestday.id === villageDay.id) {
        return '終了'
      } else if (this.village.day.day_list.slice(-2)[0].id === villageDay.id) {
        return 'エピローグ'
      }
    } else if (
      this.village.status.code === VILLAGE_STATUS.EPILOGUE &&
      this.latestday.id === villageDay.id
    ) {
      return 'エピローグ'
    }

    return villageDay.day === 0 ? 'プロローグ' : `${villageDay.day}日目`
  }

  private current(villageDay: VillageDay): boolean {
    return villageDay.id === this.displayVillageDayId
  }

  private changeDay(villageDay: VillageDay) {
    this.$emit('current-day-change', {
      villageDayId: villageDay.id
    })
  }
}
</script>

<style lang="scss" scoped>
.daylist {
  padding: 5px;

  li {
    display: inline;
  }
}
</style>
