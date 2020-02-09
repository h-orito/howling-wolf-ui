<template>
  <section class="section has-background-light">
    <div class="container">
      <h1 class="title is-5">自動生成村一覧</h1>
      <loading
        v-if="loadingVillages"
        :message="'村一覧を読み込み中...'"
      ></loading>
      <div v-if="!loadingVillages" class="m-b-15">
        <p v-if="villages == null || villages.length === 0" class="content">
          進行中の村はありません
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
      <nuxt-link
        v-if="canCreateVillage"
        class="button is-primary"
        to="/create-village"
        >村を作成</nuxt-link
      >
      <div style="margin-top: 15px;">
        <nuxt-link :to="{ path: 'village-list' }">終了した村一覧</nuxt-link>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import loading from '~/components/loading.vue'
import VillageCard from '~/components/index/village-card.vue'
import Village from '~/components/type/village'
import MyselfPlayer from '~/components/type/myself-player.ts'

@Component({
  components: {
    loading,
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
}
</script>
