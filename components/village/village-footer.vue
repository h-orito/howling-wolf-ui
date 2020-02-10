<template>
  <div class="village-footer">
    <button class="village-footer-item" @click="refresh">
      <b-icon pack="fas" icon="sync-alt" size="is-medium" type="is-white" />
    </button>
    <button class="village-footer-item" @click="openSearchModal">
      <b-icon pack="fas" icon="search" size="is-medium" type="is-white" />
    </button>
    <button class="village-footer-item" @click="toBottom">
      <b-icon
        pack="fas"
        icon="long-arrow-alt-down"
        size="is-medium"
        type="is-white"
      />
    </button>
    <button class="village-footer-item" @click="openVillageInfoModal">
      <b-icon pack="fas" icon="info-circle" size="is-medium" type="is-white" />
    </button>
    <button class="village-footer-item" @click="openUserSettingModal">
      <b-icon pack="fas" icon="users-cog" size="is-medium" type="is-white" />
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import scrollTo from 'vue-scrollto'
// component
// type

@Component({
  components: {}
})
export default class VillageDayList extends Vue {
  // 発言更新
  private refresh(): void {
    // TODO その日の発言を更新すべきだが最新日になってる
    this.$emit('refresh')
  }

  private openSearchModal(): void {
    alert('未実装です')
  }

  private toBottom(): void {
    const element = document.getElementById('message-bottom')
    if (element == null) return
    this.$scrollTo(element, {
      offset: -window.innerHeight + this.convertRemToPx(3.25)
    })
  }

  private convertRemToPx(rem): number {
    const fontSize = getComputedStyle(document.documentElement).fontSize
    return rem * parseFloat(fontSize)
  }

  private openVillageInfoModal(): void {
    alert('未実装です')
  }

  private openUserSettingModal(): void {
    alert('未実装です')
  }
}
</script>

<style lang="scss">
.village-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3em;
  display: flex;
  z-index: 10;

  .village-footer-item {
    flex: 1;
    height: 100%;
    justify-content: center;
    align-content: center;
    cursor: pointer;
    background-color: $dark;
  }

  .village-footer-item:hover i {
    color: $primary !important;
  }
}
</style>
