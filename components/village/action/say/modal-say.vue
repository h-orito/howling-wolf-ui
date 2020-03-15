<template>
  <b-modal
    :active="isOpen"
    has-modal-card
    trap-focus
    aria-role="dialog"
    aria-modal
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title has-text-left">発言確認</p>
      </header>
      <section class="modal-card-body has-text-left">
        <p>この内容で発言しますか？</p>
        <message-card
          :message="confirmMessage"
          :village="village"
          :is-progress="true"
        />
      </section>
      <footer
        class="modal-card-foot"
        style="justify-content: flex-end !important;"
      >
        <b-button type="is-secondary" size="is-small" @click="close">
          キャンセル
        </b-button>
        <b-button
          :disabled="submitting"
          type="is-primary"
          size="is-small"
          @click="say"
          >発言する</b-button
        >
      </footer>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import messageCard from '~/components/village/message/message-card.vue'
import Village from '~/components/type/village'
import Message from '~/components/type/message'

@Component({
  components: { messageCard }
})
export default class ModalSay extends Vue {
  // ----------------------------------------------------------------
  // props
  // ----------------------------------------------------------------
  @Prop({ type: Boolean })
  private isOpen!: boolean

  @Prop({ type: Object })
  private confirmMessage!: Message | null

  @Prop({ type: Object })
  private village!: Village

  // ----------------------------------------------------------------
  // data
  // ----------------------------------------------------------------
  private submitting: boolean = false

  // ----------------------------------------------------------------
  // computed
  // ----------------------------------------------------------------

  // ----------------------------------------------------------------
  // method
  // ----------------------------------------------------------------
  private close(): void {
    this.$emit('close')
  }

  private async say(): Promise<void> {
    this.submitting = true
    await this.$emit('say')
    this.submitting = false
    this.close()
  }
}
</script>

<style lang="scss"></style>
