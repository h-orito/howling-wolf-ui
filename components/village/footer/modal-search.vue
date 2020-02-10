<template>
  <b-modal
    :active="isOpenSearchModal"
    has-modal-card
    trap-focus
    aria-role="dialog"
    aria-modal
    :on-cancel="close"
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title has-text-left">発言抽出</p>
      </header>
      <section class="modal-card-body has-text-left" v-if="village">
        <div class="filter-chara-content">
          <p class="has-text-left">未実装です</p>
          <!-- <div
            v-for="chara in participantCharaList"
            :key="chara.id"
            class="has-text-centered filter-chara-select-box"
            @click="selected(chara.id)"
          >
            <img
              :src="normalImageUrl(chara)"
              :alt="chara.chara_name.name"
              :width="chara.display.width"
              :height="chara.display.height"
            />
            <p class="is-size-7">{{ chara.chara_name.name }}</p>
          </div> -->
        </div>
      </section>
      <footer
        class="modal-card-foot"
        style="justify-content: flex-end !important;"
      >
        <b-button type="is-secondary" size="is-small" @click="close">
          キャンセル
        </b-button>
        <b-button type="is-primary" size="is-small" @click="search"
          >抽出する（未実装）</b-button
        >
      </footer>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// component
// type
import Village from '~/components/type/village'
import Chara from '~/components/type/chara'

@Component({
  components: {}
})
export default class ModalSearch extends Vue {
  @Prop({ type: Object })
  private village?: Village | null

  @Prop({ type: Boolean })
  private isOpenSearchModal!: boolean

  private get participantCharaList(): Chara[] {
    return this.village!.participant.member_list.map(
      participant => participant.chara
    )
  }

  private get spectatorCharaList(): Chara[] {
    return this.village!.spectator.member_list.map(
      participant => participant.chara
    )
  }

  private normalImageUrl(chara: Chara): string {
    return chara.face_list.find(face => face.type === 'NORMAL')!.image_url
  }

  private search(): void {
    this.$emit('search', {
      hoge: 'fuga'
    })
  }

  private close(): void {
    this.$emit('close-search-modal')
  }
}
</script>

<style lang="scss">
.filter-chara-content {
  display: flex;
  flex-wrap: wrap;

  .filter-chara-select-box {
    border: 1px solid #cccccc;
    border-radius: 16px;
    padding: 5px;
    margin: 5px auto;
    width: 160px;
  }
  .filter-chara-select-box:hover {
    cursor: pointer;
    border: 1px solid $primary;
    font-weight: 700;
  }
}
</style>
