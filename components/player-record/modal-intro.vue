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
        <p class="modal-card-title has-text-left">自己紹介編集</p>
      </header>
      <section class="modal-card-body has-text-left">
        <section>
          <p style="font-weight: 700; margin-bottom: 6px;">他人狼サイトのID</p>
          <b-field>
            <b-input v-model="otherSiteName" size="is-small" />
          </b-field>
          <p class="has-text-danger is-size-7" v-if="!validOtherSiteName">
            20字以内で入力してください
          </p>
        </section>
        <section class="m-t-20">
          <p style="font-weight: 700; margin-bottom: 6px;">自己紹介</p>
          <b-input
            size="is-small"
            type="textarea"
            :rows="15"
            v-model="intro"
          ></b-input>
          <p class="has-text-right" v-html="counter"></p>
        </section>
      </section>
      <footer
        class="modal-card-foot"
        style="justify-content: flex-end !important;"
      >
        <b-button type="is-secondary" size="is-small" @click="close">
          キャンセル
        </b-button>
        <b-button
          type="is-primary"
          size="is-small"
          @click="save"
          :disabled="!canSave"
          >保存する</b-button
        >
      </footer>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// component
// type

@Component({
  components: {}
})
export default class ModalIntro extends Vue {
  // ----------------------------------------------------------------
  // prop
  // ----------------------------------------------------------------
  @Prop({ type: Boolean })
  private isOpen: boolean = false

  @Prop({ type: String })
  private currentOtherSiteName!: string | null

  @Prop({ type: String })
  private currentIntro!: string | null

  // ----------------------------------------------------------------
  // data
  // ----------------------------------------------------------------
  private otherSiteName: string | null = this.currentOtherSiteName
  private intro: string | null = this.currentIntro

  // ----------------------------------------------------------------
  // computed
  // ----------------------------------------------------------------
  private get validOtherSiteName(): boolean {
    return !this.otherSiteName || this.otherSiteName.length <= 20
  }

  private get canSave(): boolean {
    const validIntro: boolean = !this.intro || this.intro.length <= 2000
    return this.validOtherSiteName && validIntro
  }

  private get counter(): string {
    const current = !this.intro ? 0 : this.intro.length
    if (current > 2000) {
      return `文字数: <span class="has-text-danger">${current.toString()}/2000}</span>`
    } else {
      return `文字数: ${current.toString()}/2000`
    }
  }

  // ----------------------------------------------------------------
  // method
  // ----------------------------------------------------------------
  private async save(): Promise<void> {
    await this.$axios.$post(`/player/detail`, {
      other_site_name: this.otherSiteName,
      introduction: this.intro
    })
    this.close()
    this.$emit('refresh')
  }

  private close(): void {
    this.$emit('close-modal')
  }
}
</script>

<style lang="scss" scoped></style>
