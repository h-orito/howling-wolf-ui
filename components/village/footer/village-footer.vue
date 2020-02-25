<template>
  <div class="village-footer">
    <button class="village-footer-item" @click="refresh">
      <b-icon
        pack="fas"
        icon="sync-alt"
        size="is-medium"
        :type="existsNewMessages ? 'is-info' : 'is-white'"
        :custom-class="existsNewMessages ? 'rotate' : ''"
      />
    </button>
    <button class="village-footer-item" @click="openSearchModal">
      <b-icon pack="fas" icon="search" size="is-medium" type="is-white" />
    </button>
    <b-button
      class="village-footer-item flex"
      icon-pack="fas"
      icon-left="long-arrow-alt-down"
      type="is-dark"
      @click="toBottom"
    >
      最下部
    </b-button>
    <button class="village-footer-item" @click="openVillageInfoModal">
      <b-icon pack="fas" icon="info-circle" size="is-medium" type="is-white" />
    </button>
    <button class="village-footer-item" @click="openUserSettingsModal">
      <b-icon pack="fas" icon="users-cog" size="is-medium" type="is-white" />
    </button>
    <modal-search
      :is-open-search-modal="isOpenSearchModal"
      :village="village"
      @search="search($event)"
      @close-search-modal="closeSearchModal"
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
// component
import modalSearch from '~/components/village/footer/modal-search.vue'
import modalVillageInfo from '~/components/village/footer/modal-village-info.vue'
import modalUserSettings from '~/components/village/footer/modal-user-settings.vue'
// type
import Village from '~/components/type/village'

@Component({
  components: { modalSearch, modalVillageInfo, modalUserSettings }
})
export default class VillageFooter extends Vue {
  @Prop({ type: Object })
  private village?: Village | null

  @Prop({ type: String })
  private charachipName?: string | null

  @Prop({ type: Boolean })
  private existsNewMessages!: boolean

  private isOpenSearchModal: boolean = false
  private isOpenVillageInfoModal: boolean = false
  private isOpenUserSettingsModal: boolean = false

  // 発言更新
  private refresh(): void {
    this.$emit('refresh')
  }

  private openSearchModal(): void {
    this.isOpenSearchModal = true
  }

  private closeSearchModal(): void {
    this.isOpenSearchModal = false
  }

  private search({ hoge }): void {
    this.closeSearchModal()
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
  height: 3em;
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
