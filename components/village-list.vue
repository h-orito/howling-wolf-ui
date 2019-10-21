<template>
  <div class="m-b-15">
    <p v-if="villages == null || villages.length == 0" class="content">
      現在部屋がありません。
    </p>
    <br />
    <div class="columns">
      <village-card
        v-for="village in villages"
        :key="village['id']"
        :village="village"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Village from '~/components/type/village'
import VillageCard from '~/components/village-card.vue'

@Component({
  components: {
    VillageCard
  }
})
export default class VillageList extends Vue {
  @Prop({ type: Array })
  private villages!: Village[]

  /** data */

  /** computed */
  // public get hasVillage(): boolean {
  //   return this.villages && this.villages.length > 0
  // }
  /** methods() */
  // private printVillageNum(): void {
  //   console.log(this.villages.length)
  // }
}
</script>
