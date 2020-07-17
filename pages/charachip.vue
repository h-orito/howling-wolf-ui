<template>
  <div>
    <section class="section has-background-light">
      <div class="container has-text-left">
        <h1 class="title is-5">
          キャラチップ: {{ charachip ? charachip.name : '' }}
        </h1>
        <div v-if="charachip" class="m-b-20">
          <p>作者: {{ charachip.designer.name }}</p>
          <a :href="charachip.description_url" target="_blank">作者HP</a>
        </div>
        <div class="content is-size-7">
          <loading
            v-if="loadingCharachip"
            :message="'キャラチップを読み込み中...'"
          ></loading>
          <div v-if="!loadingCharachip" class="chara-select-content">
            <div
              v-for="chara in charachip.chara_list"
              :key="chara.id"
              class="has-text-centered chara-select-box"
            >
              <chara-image
                v-for="face in chara.face_list"
                :key="face.type"
                :chara="chara"
                :face-type="face.type"
                :alt="chara.chara_name.name"
              />
              <p class="is-size-7">{{ chara.chara_name.name }}</p>
            </div>
          </div>
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
import Charachip from '~/components/type/charachip'
import Chara from '~/components/type/chara'
import { FACE_TYPE } from '~/components/const/consts'
const charaImage = () => import('~/components/village/chara-image.vue')

@Component({
  components: {
    loading,
    charaImage
  },
  asyncData({ query }) {
    return { charachipId: query.id }
  }
})
export default class CharachipDetail extends Vue {
  /** head */
  private head() {
    return {
      title: ` | キャラチップ${
        this.charachip ? ': ' + this.charachip.name : ''
      }`
    }
  }

  /** data */
  // 村一覧
  private charachipId: number | null = null
  private charachip: Charachip | null = null
  private loadingCharachip: boolean = false

  /** computed */

  /** created */
  async created() {
    // キャラチップ
    this.loadingCharachip = true
    this.charachip = await this.$axios.$get(`/charachip/${this.charachipId}`)
    this.loadingCharachip = false
  }
}
</script>

<style lang="scss" scoped>
.chara-select-content {
  display: flex;
  flex-wrap: wrap;

  .chara-select-box {
    border: 1px solid #cccccc;
    border-radius: 16px;
    padding: 5px;
    margin: 5px auto;
    width: 300px;
  }
}
</style>
