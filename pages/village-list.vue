<template>
  <div>
    <section class="section has-background-light">
      <div class="container">
        <h1 class="title is-5">終了した村一覧</h1>
        <div class="content is-size-7">
          <loading
            v-if="loadingVillages"
            :message="'村一覧を読み込み中...'"
          ></loading>
          <b-table
            :data="tableVillages"
            :loading="loadingVillages"
            :mobile-cards="hasMobileCard"
          >
            <template slot-scope="props">
              <b-table-column field="village_name" label="村名">
                <nuxt-link
                  :to="{ path: 'village', query: { id: props.row.village_id } }"
                  >{{ props.row.village_name }}</nuxt-link
                >
              </b-table-column>

              <b-table-column field="participant_count" label="人数">
                {{ props.row.participant_count }}
              </b-table-column>

              <b-table-column field="organization" label="編成">
                {{ props.row.organization }}
              </b-table-column>

              <b-table-column field="win_camp" label="勝利">
                {{ props.row.win_camp }}
              </b-table-column>
            </template>

            <template slot="empty">
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <p>終了した村はありません</p>
                </div>
              </section>
            </template>
          </b-table>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import qs from 'qs'
// component
import loading from '~/components/loading.vue'
// type
import Villages from '~/components/type/villages'
import SimpleVillage from '~/components/type/simple-village'
import VillageDay from '~/components/type/village-day'
import { VILLAGE_STATUS } from '~/components/const/consts'

@Component({
  components: {
    loading
  }
})
export default class CompleteVillageList extends Vue {
  /** head */
  private head() {
    return { title: ' | 終了した村一覧' }
  }

  /** data */
  private hasMobileCard: boolean = false
  // 村一覧
  private villages: SimpleVillage[] | null = null

  /** computed */
  private get loadingVillages(): boolean {
    return this.villages == null
  }

  private get tableVillages(): any[] {
    if (this.villages == null) return []
    return this.villages.map((village: SimpleVillage) => ({
      village_id: village.id,
      village_name: village.name,
      participant_count: `${village.participant.count}人`,
      organization:
        village.setting.organizations.organization[village.participant.count],
      win_camp: village.win_camp!.name
    }))
  }

  /** created */
  async created() {
    // 自動生成村一覧
    const villages = await this.$axios.$get('/village/list', {
      params: {
        village_status: VILLAGE_STATUS.COMPLETE,
        is_auto_generate: true
      }
    })
    this.villages = (villages as Villages).list
  }

  /** methods */
}
</script>

<style lang="scss" scoped></style>
