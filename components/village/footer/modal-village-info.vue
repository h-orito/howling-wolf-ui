<template>
  <b-modal
    :active="isOpenVillageInfoModal"
    has-modal-card
    trap-focus
    aria-role="dialog"
    aria-modal
    :on-cancel="close"
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title has-text-left">村の情報</p>
      </header>
      <section class="modal-card-body has-text-left" v-if="village">
        <div class="filter-chara-content">
          <p class="has-text-left">未実装です</p>
        </div>
      </section>
      <footer
        class="modal-card-foot"
        style="justify-content: flex-end !important;"
      >
        <b-button type="is-secondary" size="is-small" @click="close">
          閉じる
        </b-button>
        <b-button type="is-primary" size="is-small" @click="close"
          >村の設定を変更する（未実装）</b-button
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
export default class ModalVillageInfo extends Vue {
  @Prop({ type: Object })
  private village?: Village | null

  @Prop({ type: Boolean })
  private isOpenVillageInfoModal!: boolean

  private close(): void {
    this.$emit('close-village-info-modal')
  }
}
</script>

<style lang="scss"></style>
