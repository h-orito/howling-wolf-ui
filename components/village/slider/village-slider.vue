<template>
  <div>
    <div class="village-side-menu" :class="isExpanded ? 'is-active' : ''">
      <h1 class="m-b-10 has-text-left is-size-6">
        {{ village ? village.name : '' }}
      </h1>
      <div class="has-text-left">
        <a class="side-item" @click="openVillageInfoModal">
          <b-icon
            pack="fas"
            icon="info-circle"
            size="is-small"
            type="is-white"
          />
          村の設定
        </a>
        <b-collapse :open="false" aria-id="participant-list-aria">
          <a class="side-item" slot="trigger" slot-scope="props">
            <b-icon pack="fas" icon="users" size="is-small" type="is-white" />
            参加者（{{ personCount }}人）
            <span style="float: right; padding-right: 5px;">
              <b-icon
                class=""
                pack="fas"
                :icon="props.open ? 'angle-down' : 'angle-right'"
                size="is-small"
                type="is-white"
              />
            </span>
          </a>
          <participant-list v-if="village" />
        </b-collapse>
        <a class="side-item" @click="openMemoModal">
          <b-icon
            pack="fas"
            icon="sticky-note"
            size="is-small"
            type="is-white"
          />
          メモ
        </a>
        <a class="side-item" @click="openUserSettingsModal">
          <b-icon pack="fas" icon="users-cog" size="is-small" type="is-white" />
          ユーザ設定
        </a>
        <nuxt-link :to="{ path: '/' }" class="side-item">
          <b-icon pack="fas" icon="home" size="is-small" type="is-white" />
          トップページ
        </nuxt-link>
        <div class="m-t-10">
          <a
            :href="
              `https://twitter.com/share?text=${village ? village.name : ''}`
            "
            class="twitter-share-button"
            data-hashtags="吠狼国"
            data-lang="ja"
            data-show-count="false"
          ></a>
          <script
            async
            src="https://platform.twitter.com/widgets.js"
            charset="utf-8"
          ></script>
        </div>
        <div class="slider-ads">
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          ></script>
          <!-- howling-wolf-slider -->
          <ins
            class="adsbygoogle"
            style="display:inline-block;width:260px;height:90px"
            data-ad-client="ca-pub-0917187897820609"
            data-ad-slot="2365194990"
          ></ins>
          <script>
            ;(adsbygoogle = window.adsbygoogle || []).push({})
          </script>
        </div>
      </div>
      <div v-if="$window.isMobile" class="close-icon">
        <b-button
          type="is-dark"
          icon-pack="fas"
          icon-left="times"
          @click="$emit('hide-slider')"
        />
      </div>
    </div>
    <div
      class="village-side-menu-outside"
      :class="isExpanded ? 'is-active' : ''"
      @click="$emit('hide-slider')"
    ></div>
    <modal-village-info
      :is-open="isOpenVillageInfoModal"
      :charachip-name="charachipName"
      @close="closeVillageInfoModal"
    />
    <modal-user-settings
      :is-open="isOpenUserSettingsModal"
      @refresh="refresh"
      @close-modal="closeUserSettingsModal"
      ref="settings"
    />
    <modal-memo
      :is-open="isOpenMemoModal"
      @close-modal="closeMemoModal"
      ref="memo"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

import Village from '~/components/type/village'
const modalVillageInfo = () =>
  import('~/components/village/slider/modal-village-info.vue')
const modalUserSettings = () =>
  import('~/components/village/slider/modal-user-settings.vue')
const modalMemo = () =>
  import('~/components/village/slider/memo/modal-memo.vue')
const participantList = () =>
  import('~/components/village/slider/participant-list.vue')

@Component({
  components: {
    modalVillageInfo,
    modalUserSettings,
    modalMemo,
    participantList
  }
})
export default class VillageSlider extends Vue {
  @Prop({ type: Boolean })
  private isExpanded!: boolean

  @Prop({ type: String })
  private charachipName?: string | null

  private isOpenVillageInfoModal: boolean = false
  private isOpenUserSettingsModal: boolean = false

  private get village(): Village | null {
    return this.$store.getters.getVillage
  }

  private get personCount(): number {
    if (!this.village) return 0
    return this.village.participant.count
  }

  private openVillageInfoModal(): void {
    this.isOpenVillageInfoModal = true
  }

  private closeVillageInfoModal(): void {
    this.isOpenVillageInfoModal = false
  }

  private openUserSettingsModal(): void {
    // @ts-ignore
    this.$refs.settings.refresh()
    this.isOpenUserSettingsModal = true
  }

  private closeUserSettingsModal(): void {
    this.isOpenUserSettingsModal = false
  }

  private isOpenMemoModal: boolean = false
  private openMemoModal(): void {
    // @ts-ignore
    if (this.$refs.memo) this.$refs.memo.initialize()
    this.isOpenMemoModal = true
  }

  private closeMemoModal(): void {
    this.isOpenMemoModal = false
  }

  private async refresh(): Promise<void> {
    this.$emit('hide-slider')
    await this.$emit('refresh')
  }
}
</script>

<style lang="scss" scoped>
.village-side-menu {
  background-color: $dark;
  color: $white;
  overflow-x: hidden;
  overflow-y: auto;

  .side-item {
    color: $white;
    display: block;
    line-height: 2.5rem;
    font-size: 14px;
  }

  .slider-ads {
    margin-top: 10px;
  }
}

@media screen and (max-width: 767px) {
  .village-side-menu {
    position: fixed;
    left: 0;
    top: $village-header-height;
    height: calc(100vh - #{$village-header-height} - #{$village-footer-height});
    width: 0%;
    transition-property: all;
    transition-duration: 200ms;
    transition-delay: 0s;
    transition-timing-function: ease;
    z-index: 5;

    .close-icon {
      position: absolute;
      top: 5px;
      right: 5px;
    }
  }
  .village-side-menu.is-active {
    width: 280px;
    padding: 10px;
  }
  .village-side-menu-outside {
    display: none;
    position: fixed;
    right: 0;
    top: 0;
    background-color: hsla(0, 0%, 21%, 0.4);
    height: 100vh;
    width: calc(100% - 280px);
  }
  .village-side-menu-outside.is-active {
    display: block;
    z-index: 5;
  }
}
@media screen and (min-width: 768px) {
  .village-side-menu {
    height: 100%;
    max-height: 100vh;
    width: 280px;
    padding: 10px;
  }
}
</style>
