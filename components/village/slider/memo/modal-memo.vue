<template>
  <b-modal
    :active="isOpen"
    has-modal-card
    trap-focus
    aria-role="dialog"
    aria-modal
    :on-cancel="close"
  >
    <div class="modal-card" :class="isDarkTheme ? 'dark-theme' : ''">
      <header class="modal-card-head">
        <p class="modal-card-title has-text-left">メモ</p>
      </header>
      <section class="modal-card-body has-text-left" v-if="village">
        <p class="m-b-5">
          端末に保存され、30日で削除されます。<br />自動保存されないため、下部の保存ボタンの押し忘れにご注意ください。
        </p>
        <b-tabs type="is-boxed" size="is-small">
          <b-tab-item label="メモ1">
            <memo-input v-model="memo1String" />
          </b-tab-item>
          <b-tab-item label="メモ2">
            <memo-input v-model="memo2String" />
          </b-tab-item>
          <b-tab-item label="メモ3">
            <memo-input v-model="memo3String" />
          </b-tab-item>
          <b-tab-item label="まとめ" :disabled="isPrologue">
            <memo-matome
              :matomes="matomes"
              ref="matome"
              @remove-line="removeLine($event)"
              @change-content="changeContent($event)"
              @add-line="addLine"
              @to-left="toLeft($event)"
              @to-right="toRight($event)"
            />
          </b-tab-item>
        </b-tabs>
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
        <b-button type="is-primary" size="is-small" @click="saveAndClose"
          >保存して閉じる</b-button
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
import memoInput from '~/components/village/slider/memo/memo-input.vue'
import memoMatome from '~/components/village/slider/memo/memo-matome.vue'
import matome, { Matomes } from '~/components/village/slider/memo/matome'
import textMemo from '~/components/village/slider/memo/text-memo'
import { VILLAGE_STATUS } from '~/components/const/consts'
import { VillageUserSettings } from '~/components/village/user-settings/village-user-settings'

@Component({
  components: { memoInput, memoMatome }
})
export default class ModalMemo extends Vue {
  @Prop({ type: Boolean })
  private isOpen!: boolean

  private memo1String: string = ''
  private memo2String: string = ''
  private memo3String: string = ''
  private matomes: Matomes = {
    chara_names: [],
    matomes: []
  }

  private get villageId(): number {
    return this.$store.getters.getVillageId
  }

  private get village(): Village | null {
    return this.$store.getters.getVillage
  }

  private get isPrologue(): boolean {
    return !this.village || this.village.status.code === VILLAGE_STATUS.PROLOGUE
  }

  private get isDarkTheme(): boolean {
    const settings: VillageUserSettings = this.$store.getters
      .getVillageUserSettings
    return settings.theme?.is_dark || false
  }

  private save(): void {
    textMemo.createCookieIfNeeded(this, this.villageId, 1)
    textMemo.setCookie(this, this.villageId, 1, this.memo1String)
    textMemo.createCookieIfNeeded(this, this.villageId, 2)
    textMemo.setCookie(this, this.villageId, 2, this.memo2String)
    textMemo.createCookieIfNeeded(this, this.villageId, 3)
    textMemo.setCookie(this, this.villageId, 3, this.memo3String)
    matome.setCookie(this, this.village!, this.matomes)
    this.$buefy.toast.open({
      message: '保存しました',
      type: 'is-info',
      position: 'is-top'
    })
  }

  private saveAndClose(): void {
    this.save()
    this.close()
  }

  private close(): void {
    this.$emit('close-modal')
  }

  private initialize(): void {
    this.memo1String = textMemo.getCookie(this, this.villageId, 1)
    this.memo2String = textMemo.getCookie(this, this.villageId, 2)
    this.memo3String = textMemo.getCookie(this, this.villageId, 3)
    if (this.isPrologue) return
    matome.createCookieIfNeeded(this, this.village!)
    this.refreshMatome()
  }

  private refreshMatome(): void {
    this.matomes = matome.getCookie(this, this.village!)
  }

  private addLine(): void {
    this.matomes = matome.addLine(this.matomes)
  }

  private removeLine({ lineIndex }): void {
    this.matomes = matome.removeLine(this.matomes, lineIndex)
  }

  private toLeft({ index }): void {
    if (index === 0) return
    this.matomes = matome.toLeft(this.matomes, index)
  }

  private toRight({ index }): void {
    if (index === this.village!.participant.count - 1) return
    this.matomes = matome.toRight(this.matomes, index)
  }

  private changeContent({ lineIndex, contentIndex, content }): void {
    this.matomes = matome.changeContent(
      this.matomes,
      lineIndex,
      contentIndex,
      content
    )
  }
}
</script>

<style lang="scss" scoped>
/** header, footerを隠さない */
.modal-card {
  max-height: calc(100vh - 6.5rem);
}
</style>

<style lang="scss">
.b-tabs .tab-content {
  padding-top: 5px !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.dark-theme {
  .b-tabs .tabs.is-boxed {
    li a {
      background-color: $dark;
      color: $white;
    }
    li:not(.is-active) a {
      border-bottom-color: rgb(219, 219, 219);
    }
  }
}
</style>
