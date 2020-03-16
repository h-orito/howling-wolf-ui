<template>
  <b-modal
    :active="isOpen"
    has-modal-card
    trap-focus
    aria-role="dialog"
    aria-modal
    :on-cancel="close"
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title has-text-left">個人設定</p>
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
          >保存する（未実装）</b-button
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

@Component({
  components: {}
})
export default class ModalUserSettings extends Vue {
  @Prop({ type: Object })
  private village?: Village | null

  @Prop({ type: Boolean })
  private isOpen!: boolean

  private close(): void {
    this.$emit('close-modal')
  }
}
</script>

<style lang="scss"></style>
