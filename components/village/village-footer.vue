<template>
  <div class="village-footer">
    <button class="village-footer-item" @click="refresh">
      <i class="fas fa-2x fa-sync-alt has-text-white"></i>
    </button>
    <button class="village-footer-item" @click="openSearchModal">
      <i class="fas fa-2x fa-search has-text-white"></i>
    </button>
    <button class="village-footer-item" @click="toBottom">
      <i class="fas fa-2x fa-long-arrow-alt-down has-text-white"></i>
    </button>
    <button class="village-footer-item" @click="openVillageInfoModal">
      <i class="fas fa-2x fa-info-circle has-text-white"></i>
    </button>
    <button class="village-footer-item" @click="openUserSettingModal">
      <i class="fas fa-2x fa-users-cog has-text-white"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
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
    alert('未実装です')
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
  height: 3.25rem;
  background-color: $dark;
  display: flex;

  .village-footer-item {
    flex: 1;
    height: 100%;
    justify-content: center;
    align-content: center;
    cursor: pointer;
  }

  .village-footer-item:hover i {
    color: $primary !important;
  }
}
</style>
