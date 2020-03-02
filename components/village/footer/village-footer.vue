<template>
  <div class="village-footer">
    <button class="village-footer-item" @click="refresh">
      <b-icon
        pack="fas"
        icon="sync-alt"
        size="is-small"
        :type="existsNewMessages ? 'is-info' : 'is-white'"
        :custom-class="existsNewMessages ? 'rotate' : ''"
      />
    </button>
    <button class="village-footer-item" @click="openFilterModal">
      <b-icon pack="fas" icon="search" size="is-small" type="is-white" />
    </button>
    <b-button
      class="village-footer-item flex"
      icon-pack="fas"
      icon-left="long-arrow-alt-down"
      type="is-dark"
      size="is-small"
      @click="toBottom"
    >
      最下部
    </b-button>
    <button class="village-footer-item" @click="openVillageInfoModal">
      <b-icon pack="fas" icon="info-circle" size="is-small" type="is-white" />
    </button>
    <button class="village-footer-item" @click="openUserSettingsModal">
      <b-icon pack="fas" icon="users-cog" size="is-small" type="is-white" />
    </button>
    <modal-filter
      :is-open="isOpenFilterModal"
      :village="village"
      @filter="filter($event)"
      @close-modal="closeFilterModal"
      ref="filter"
    />
    <modal-village-info
      :is-open-village-info-modal="isOpenVillageInfoModal"
      :village="village"
      :charachip-name="charachipName"
      @close-village-info-modal="closeVillageInfoModal"
    />
    <modal-user-settings
      :is-open-user-settings-modal="isOpenUserSettingsModal"
      :village="village"
      @close-user-settings-modal="closeUserSettingsModal"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import scrollTo from 'vue-scrollto'
// type
import Village from '~/components/type/village'
// dynamic imports
const modalFilter = () => import('~/components/village/footer/modal-search.vue')
const modalVillageInfo = () =>
  import('~/components/village/footer/modal-village-info.vue')
const modalUserSettings = () =>
  import('~/components/village/footer/modal-user-settings.vue')

@Component({
  components: { modalFilter, modalVillageInfo, modalUserSettings }
})
export default class VillageFooter extends Vue {
  @Prop({ type: Object })
  private village?: Village | null

  @Prop({ type: String })
  private charachipName?: string | null

  @Prop({ type: Boolean })
  private existsNewMessages!: boolean

  private isOpenFilterModal: boolean = false
  private isOpenVillageInfoModal: boolean = false
  private isOpenUserSettingsModal: boolean = false

  // 発言更新
  private refresh(): void {
    this.$emit('refresh')
  }

  private openFilterModal(): void {
    this.isOpenFilterModal = true
  }

  private closeFilterModal(): void {
    this.isOpenFilterModal = false
  }

  private async filter({ messageTypeList, participantIdList }): Promise<void> {
    await this.$emit('filter', { messageTypeList, participantIdList })
    this.closeFilterModal()
  }

  private get isFiltering(): boolean {
    const refs = this.$refs as any
    return refs.filter.isFiltering
  }

  private filterRefresh(): void {
    const refs = this.$refs as any
    refs.filter.refresh()
  }

  private toBottom(): void {
    this.$emit('to-bottom')
  }

  private openVillageInfoModal(): void {
    this.isOpenVillageInfoModal = true
  }

  private closeVillageInfoModal(): void {
    this.isOpenVillageInfoModal = false
  }

  private openUserSettingsModal(): void {
    this.isOpenUserSettingsModal = true
  }

  private closeUserSettingsModal(): void {
    this.isOpenUserSettingsModal = false
  }
}
</script>

<style lang="scss">
.village-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2.5em;
  display: flex;
  z-index: 10;

  .village-footer-item {
    height: 100%;
    justify-content: center;
    align-content: center;
    cursor: pointer;
    background-color: $dark;
    border: 0;
    border-radius: 0;
    min-width: 60px;

    i.rotate {
      animation: rotate1 2s linear infinite;
    }

    @keyframes rotate1 {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }

  .flex {
    flex: 1;
  }
}
</style>
