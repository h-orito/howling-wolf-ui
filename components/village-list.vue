<template>
  <div>
    <p v-if="villages == null || villages.length == 0" class="content">
      現在部屋がありません。
    </p>
    <br />
    <div class="columns">
      <village-card
        v-for="village in villages"
        :key="village['key']"
        :village="village"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import VillageCard from '~/components/village-card.vue'

@Component({
  components: {
    VillageCard
  }
})
export default class VillageList extends Vue {
  /** data */
  private villages: any = [
    {
      id: 1,
      name: '村名XXXXXXXX',
      status: '進行中',
      talkType: 'BBS',
      progress: '1日目',
      parcicipateNum: 12,
      participateCapacity: 16,
      spectateNum: 5,
      creator: 'ort',
      comment: '22時開始です。誰でも来てください。'
    },
    {
      id: 1,
      name: '村名YYYYYYY',
      status: '進行中',
      talkType: 'BBS',
      progress: '1日目',
      parcicipateNum: 12,
      participateCapacity: 16,
      spectateNum: 5,
      creator: 'ort',
      comment: '22時開始です。誰でも来てください。'
    }
  ]

  /** head() */
  // private head() {
  //   return { title: 'タイトル' }
  // }

  /** computed */
  // public get hasVillage(): boolean {
  //   return this.villages && this.villages.length > 0
  // }

  /** methods() */
  private printVillageNum(): void {
    console.log(this.villages.length)
  }
}
</script>
