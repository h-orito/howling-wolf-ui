<template>
  <div :class="isDarkTheme ? 'dark-theme' : ''">
    <b-pagination
      v-if="messages.all_page_count != null && messages.all_page_count > 1"
      :total="messages.all_record_count"
      :current="messages.current_page_num"
      :range-before="range"
      :range-after="range"
      order="is-right"
      size="is-small"
      :per-page="perPage"
      icon-pack="fas"
      icon-prev="chevron-left"
      icon-next="chevron-right"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
      @change="change($event)"
      class="m-l-5 m-r-5 m-t-10 m-b-10"
    />
    <message-card
      v-for="(message, idx) in messages.list"
      :key="message.time.unix_time_milli"
      :message="message"
      :is-progress="isProgress"
      :index="idx"
      :is-dark-theme="isDarkTheme"
      :is-disp-date="isDispDate"
      :is-img-large="isImgLarge"
      ref="messageCard"
      @paste-message-input="$emit('paste-message-input', $event)"
    />
    <village-situation-message :is-latest-day="isLatestDay" />
    <div>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      ></script>
      <ins
        class="adsbygoogle"
        style="display:block"
        data-ad-format="fluid"
        data-ad-layout-key="-hm-c+2i-1u-38"
        data-ad-client="ca-pub-0917187897820609"
        data-ad-slot="5122687444"
      ></ins>
      <script>
        ;(adsbygoogle = window.adsbygoogle || []).push({})
      </script>
    </div>
    <b-pagination
      v-if="messages.all_page_count != null && messages.all_page_count > 1"
      :total="messages.all_record_count"
      :current="messages.current_page_num"
      :range-before="range"
      :range-after="range"
      order="is-right"
      size="is-small"
      :per-page="perPage"
      icon-pack="fas"
      icon-prev="chevron-left"
      icon-next="chevron-right"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
      @change="change($event)"
      class="m-l-5 m-r-5 m-t-10 m-b-10"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import messageCard from '~/components/village/message/message-card.vue'
// type
import Village from '~/components/type/village'
import Messages from '~/components/type/messages'
import { VillageUserSettings } from '~/components/village/user-settings/village-user-settings'
import { VILLAGE_STATUS } from '~/components/const/consts'
// dynamic imports
const villageSituationMessage = () =>
  import('~/components/village/message/village-situation-message.vue')

@Component({
  components: {
    messageCard,
    villageSituationMessage
  }
})
export default class MessageCard extends Vue {
  @Prop({ type: Number })
  private perPage!: number

  @Prop({ type: Boolean })
  private isLatestDay!: boolean

  private range: number = 2

  private get village(): Village {
    return this.$store.getters.getVillage!
  }

  private get messages(): Messages {
    return this.$store.getters.getMessages!
  }

  private get isProgress(): boolean {
    const statusCode = this.village.status.code
    return (
      statusCode === VILLAGE_STATUS.PROLOGUE ||
      statusCode === VILLAGE_STATUS.PROGRESS
    )
  }

  private get isDarkTheme(): boolean {
    return this.$store.getters.isDarkTheme
  }

  private get isDispDate(): boolean {
    return this.$store.getters.getVillageUserSettings.message_display
      .is_disp_date
  }

  private get isImgLarge(): boolean {
    return this.$store.getters.getVillageUserSettings.message_display
      .is_img_large
  }

  private change(pageNum: number) {
    this.$emit('change-message-page', {
      pageNum
    })
  }

  private clearAnchorMessages(): void {
    const refs: any = this.$refs as any
    if (this.messages.list.length > 0) {
      const messageRefs: any[] = refs.messageCard
      messageRefs.forEach(element => {
        element.clearAnchorMessages()
      })
    }
  }
}
</script>

<style lang="scss">
.dark-theme {
  a.pagination-link {
    color: #eee;
  }
}
</style>
