<template>
  <div>
    <section class="section has-background-light">
      <div class="container">
        <h1 class="title is-5">キャラチップ一覧</h1>
        <div class="content is-size-7">
          <loading
            v-if="loadingCharachips"
            :message="'キャラチップ一覧を読み込み中...'"
          ></loading>
          <b-table
            :data="tableCharachips"
            :loading="loadingCharachips"
            :mobile-cards="false"
          >
            <template slot-scope="props">
              <b-table-column field="charachip_name" label="キャラチップ名">
                <nuxt-link
                  :to="{
                    path: 'charachip',
                    query: { id: props.row.charachip_id }
                  }"
                  >{{ props.row.charachip_name }}</nuxt-link
                >
              </b-table-column>

              <b-table-column field="designer_name" label="作者">
                {{ props.row.designer_name }}
              </b-table-column>

              <b-table-column field="chara_list" label="例">
                <chara-image :chara="props.row.chara" />
              </b-table-column>
            </template>

            <template slot="empty">
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <p>キャラチップがありません</p>
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
import Charachips from '~/components/type/charachips'
import Charachip from '~/components/type/charachip'
import Chara from '~/components/type/chara'
import { FACE_TYPE } from '~/components/const/consts'
const charaImage = () => import('~/components/village/chara-image.vue')

@Component({
  components: {
    loading,
    charaImage
  }
})
export default class CharachipList extends Vue {
  /** head */
  private head() {
    return { title: ' | キャラチップ一覧' }
  }

  /** data */
  // 村一覧
  private charachips: Charachip[] | null = null
  private loadingCharachips: boolean = false

  /** computed */
  private get tableCharachips(): any[] {
    if (this.charachips == null) return []
    return this.charachips.map((charachip: Charachip) => ({
      charachip_id: charachip.id,
      charachip_name: charachip.name,
      designer_name: charachip.designer.name,
      chara: charachip.chara_list[0]
    }))
  }

  /** created */
  async created() {
    // キャラチップ一覧
    this.loadingCharachips = true
    const charachips: Charachips = await this.$axios.$get('/charachip/list')
    this.charachips = charachips.list
    this.loadingCharachips = false
  }

  /** methods */
}
</script>

<style lang="scss" scoped></style>
