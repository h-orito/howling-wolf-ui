<template>
  <div class="village-header">
    <b-button
      class="village-header-item is-size-7"
      type="is-dark"
      icon-left="chevron-left"
      icon-pack="fas"
      :disabled="!existPrevDay"
      @click="toPrevDay"
    >
      前日
    </b-button>
    <b-button
      class="village-header-item flex is-size-7"
      type="is-dark"
      icon-pack="fas"
      icon-left="long-arrow-alt-up"
      @click="$emit('to-head')"
      >最上部</b-button
    >
    <b-button
      class="village-header-item is-size-7"
      type="is-dark"
      icon-right="chevron-right"
      icon-pack="fas"
      :disabled="!existNextDay"
      @click="toNextDay"
    >
      翌日
    </b-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// component
// type
import Village from '~/components/type/village'
import VillageDay from '~/components/type/village-day'

@Component({
  components: {}
})
export default class VillageFooter extends Vue {
  @Prop({ type: Object })
  private village?: Village | null

  @Prop({ type: Object })
  private currentVillageDay?: VillageDay | null

  private get existPrevDay(): boolean {
    if (this.village == null || this.currentVillageDay == null) return false
    return this.currentVillageDayIndex !== 0
  }

  private get existNextDay(): boolean {
    if (this.village == null || this.currentVillageDay == null) return false
    return this.currentVillageDayIndex !== this.village.day.day_list.length - 1
  }

  private get currentVillageDayIndex(): number {
    return this.village!.day.day_list.findIndex(
      day => day.id === this.currentVillageDay!.id
    )
  }

  private get prevDayId(): number | null {
    if (!this.existPrevDay) return null
    return this.village!.day.day_list[this.currentVillageDayIndex - 1].id
  }

  private get nextDayId(): number | null {
    if (!this.existNextDay) return null
    return this.village!.day.day_list[this.currentVillageDayIndex + 1].id
  }

  private toPrevDay(): void {
    this.$emit('current-day-change', {
      villageDayId: this.prevDayId
    })
  }

  private toNextDay(): void {
    this.$emit('current-day-change', {
      villageDayId: this.nextDayId
    })
  }
}
</script>

<style lang="scss">
.village-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2.5em;
  display: flex;
  z-index: 10;

  .village-header-item {
    height: 100%;
    justify-content: center;
    align-content: center;
    cursor: pointer;
    border: 0;
    border-radius: 0;
  }

  .flex {
    flex: 1;
  }
}
</style>
