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
        <p class="modal-card-title has-text-left">入村確認</p>
      </header>
      <section class="modal-card-body has-text-left">
        <message-card :message="confirmMessage" :is-progress="true" />
      </section>
      <section class="modal-card-body has-text-left">
        <div class="field">
          <b-checkbox v-model="confirm1"
            ><a @click="openTermModal">利用規約</a>および<nuxt-link
              target="_blank"
              :to="{ path: '/rule' }"
              >ルール</nuxt-link
            >を確認し、禁止事項について理解しました。</b-checkbox
          >
          <term-modal
            :is-open="isTermModalOpen"
            @close-modal="closeTermModal"
          />
        </div>
        <div class="field">
          <b-checkbox v-model="confirm2"
            >他者への礼節を欠いたり、正常な運営を妨げるような行為を行なった場合、管理人の裁量により処罰される可能性があることについて理解しました。</b-checkbox
          >
        </div>
        <div class="field">
          <b-checkbox v-model="confirm3"
            >発言可能時間および突然死の設定を確認し、進行中該当の時間に発言しなければ突然死してしまう可能性があることを理解しました。</b-checkbox
          >
        </div>
      </section>
      <footer
        class="modal-card-foot"
        style="justify-content: flex-end !important;"
      >
        <b-button type="is-secondary" size="is-small" @click="close">
          キャンセル
        </b-button>
        <b-button
          :disabled="submitting || !canParticipate"
          type="is-primary"
          size="is-small"
          @click="participate"
          >入村する</b-button
        >
      </footer>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import messageCard from '~/components/village/message/message-card.vue'
// type
import Message from '~/components/type/message'
const termModal = () => import('~/components/index/modal-term.vue')

@Component({
  components: { messageCard, termModal }
})
export default class ModalParticipate extends Vue {
  // ----------------------------------------------------------------
  // props
  // ----------------------------------------------------------------
  @Prop({ type: Boolean })
  private isOpen!: boolean

  @Prop({ type: Object })
  private confirmMessage!: Message | null

  // ----------------------------------------------------------------
  // data
  // ----------------------------------------------------------------
  private submitting: boolean = false
  private confirm1: boolean = false
  private confirm2: boolean = false
  private confirm3: boolean = false
  private isTermModalOpen: boolean = false

  // ----------------------------------------------------------------
  // computed
  // ----------------------------------------------------------------
  private get canParticipate(): boolean {
    return this.confirm1 && this.confirm2 && this.confirm3
  }

  // ----------------------------------------------------------------
  // method
  // ----------------------------------------------------------------
  private close(): void {
    this.$emit('close')
  }

  private async participate(): Promise<void> {
    this.submitting = true
    await this.$emit('participate')
    this.submitting = false
    this.close()
  }

  private openTermModal(): void {
    this.isTermModalOpen = true
  }

  private closeTermModal(): void {
    this.isTermModalOpen = false
  }
}
</script>
