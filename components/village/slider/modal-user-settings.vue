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
        <p class="title is-6">ページ分割</p>
        <div class="field">
          <b-switch v-model="isPaging">ページ分割する</b-switch>
        </div>
        <div class="field">
          <p class="is-7">1ページあたりの発言数</p>
          <b-slider
            class="p-l-5 p-r-10"
            size="is-small"
            :min="10"
            :max="200"
            v-model="messagePerPage"
            style="max-width: 300px;"
            :step="10"
          >
            <template v-for="val in [10, 20, 50, 100, 200]">
              <b-slider-tick :value="val" :key="val">{{ val }}</b-slider-tick>
            </template>
          </b-slider>
        </div>
      </section>
      <footer
        class="modal-card-foot"
        style="justify-content: flex-end !important;"
      >
        <b-button type="is-secondary" size="is-small" @click="close">
          閉じる
        </b-button>
        <b-button type="is-primary" size="is-small" @click="save"
          >保存する</b-button
        >
      </footer>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// type
import Village from '~/components/type/village'
// component
import villageUserSettings, {
  VillageUserSettings,
  PagingSettings
} from '~/components/village/user-settings/village-user-settings'

@Component({
  components: {}
})
export default class ModalUserSettings extends Vue {
  @Prop({ type: Object })
  private village?: Village | null

  @Prop({ type: Boolean })
  private isOpen!: boolean

  private isPaging: boolean = true
  private messagePerPage: number = 10

  private save(): void {
    villageUserSettings.setPaging(this, {
      is_paging: this.isPaging,
      message_per_page: this.messagePerPage
    })
    this.$emit('refresh')
    this.close()
  }

  private close(): void {
    this.$emit('close-modal')
  }

  private refresh(): void {
    const pagingSettings = villageUserSettings.getPaging(this)
    this.isPaging = pagingSettings.is_paging
    this.messagePerPage = pagingSettings.message_per_page
  }
}
</script>

<style lang="scss" scoped>
/** header, footerを隠さない */
.modal-card {
  max-height: calc(100vh - 6.5rem);
}
</style>
