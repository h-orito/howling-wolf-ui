<template>
  <div class="village-footer is-size-7">
    <button
      v-if="$window.isMobile"
      class="village-footer-item b-r"
      @click="$emit('toggle-slider')"
    >
      <b-icon pack="fas" icon="bars" type="is-white" />
    </button>
    <button
      class="village-footer-item b-r"
      :class="$window.isMobile ? '' : 'wide-item'"
      @click="refresh"
    >
      <b-icon
        pack="fas"
        icon="sync-alt"
        :type="existsNewMessages ? 'is-info' : 'is-white'"
        :custom-class="existsNewMessages ? 'rotate' : ''"
      />
    </button>
    <button class="village-footer-item flex" @click="toBottom">
      <b-icon
        pack="fas"
        icon="arrow-down"
        type="is-white"
        style="border-bottom: 1px solid #fff; margin-bottom: 3px;"
      />
    </button>
    <b-button
      class="village-footer-item b-l"
      :class="
        ($window.isMobile ? '' : 'wide-item') +
          (isFiltering ? ' filter-refresh' : ' filter-button')
      "
      @click="openFilterModalOrRefresh"
      icon-pack="fas"
      icon-left="search"
    >
      <p v-if="isFiltering" class="is-size-7 filter-refresh">解除</p>
    </b-button>
    <div class="village-footer-item footer-timer b-l">
      <p>{{ timer }}</p>
    </div>
    <modal-filter
      :is-open="isOpenFilterModal"
      @filter="filter($event)"
      @close-modal="closeFilterModal"
      ref="filter"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import scrollTo from 'vue-scrollto'
// type
import Village from '~/components/type/village'
import { VILLAGE_STATUS, MESSAGE_TYPE } from '~/components/const/consts'
import modalFilter from '~/components/village/footer/modal-filter.vue'

@Component({
  components: { modalFilter }
})
export default class VillageFooter extends Vue {
  @Prop({ type: Boolean })
  private existsNewMessages!: boolean

  private isOpenFilterModal: boolean = false
  private timer: string = ''

  private get village(): Village | null {
    return this.$store.getters.getVillage
  }

  private get isFiltering(): boolean {
    return this.$store.getters.isFiltering
  }

  private openFilterModalOrRefresh(): void {
    if (this.isFiltering) {
      this.filterRefresh()
    } else {
      this.isOpenFilterModal = true
    }
  }

  private closeFilterModal(): void {
    this.isOpenFilterModal = false
  }

  private async filter({
    messageTypeList,
    participantIdList,
    keyword
  }): Promise<void> {
    this.$emit('hide-slider')
    await this.$emit('filter', { messageTypeList, participantIdList, keyword })
    this.closeFilterModal()
  }

  private async charaFilter(participantId: number): Promise<void> {
    // @ts-ignore
    await this.$refs.filter.charaFilter(participantId)
  }

  private filterRefresh() {
    // @ts-ignore
    this.$refs.filter.refresh()
  }

  private refreshTimer(): void {
    if (!this.village) {
      this.timer = ''
      return
    }
    const statusCode = this.village!.status.code
    if (statusCode === VILLAGE_STATUS.COMPLETE) {
      this.timer = '終了'
      return
    } else if (statusCode === VILLAGE_STATUS.CANCEL) {
      this.timer = '廃村'
      return
    }

    const daychange = this.nextDaychangeDatetime
    const left = daychange.getTime() - new Date().getTime()
    const hour = Math.floor(left / 3600000)
    const minute = Math.floor((left - 3600000 * hour) / 60000)
    const second = Math.floor((left % 60000) / 1000)

    if (left < 0) {
      this.timer = `残00:00:00`
    } else if (hour > 99) {
      this.timer = `残99:59:59`
    } else {
      this.timer = `残${('0' + hour).slice(-2)}:${('0' + minute).slice(-2)}:${(
        '0' + second
      ).slice(-2)}`
    }
  }

  private get nextDaychangeDatetime(): Date {
    const daychangeStr = this.village!.day.day_list[
      this.village!.day.day_list.length - 1
    ].day_change_datetime
    return new Date( //
      parseInt(daychangeStr.substring(0, 4)), // year
      parseInt(daychangeStr.substring(5, 7)) - 1, // month
      parseInt(daychangeStr.substring(8, 10)), // date
      parseInt(daychangeStr.substring(11, 13)), // hour
      parseInt(daychangeStr.substring(14, 16)), // minute
      parseInt(daychangeStr.substring(17)) // second
    )
  }

  // 発言更新
  private refresh(): void {
    this.$emit('refresh')
  }

  private toBottom(): void {
    this.$emit('to-bottom')
  }
}
</script>

<style lang="scss" scoped>
.village-footer {
  width: 100%;
  display: flex;
  z-index: 10;
  background-color: $dark;

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

  .wide-item {
    width: 120px;
  }

  .filter-button {
    color: $white;
  }

  .filter-refresh {
    color: $info;
  }

  .footer-timer {
    color: $white;
    cursor: default;
    width: 80px;

    p {
      line-height: $village-footer-height;
      line-height: calc(
        #{$village-footer-height} + env(safe-area-inset-bottom)
      );
    }
  }

  .flex {
    flex: 1;
  }

  .b-r {
    border-right: 1px solid #555;
  }

  .b-l {
    border-left: 1px solid #555;
  }
}
</style>
