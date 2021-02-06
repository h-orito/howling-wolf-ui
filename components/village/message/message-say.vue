<template>
  <div class="hw-message-card" :class="isAnchorMessage ? 'anchor-message' : ''">
    <div class="hw-message-name-area">
      <span v-if="isDispAnchorString">
        <a href="javascript:void(0);" @click="copyAnchorString">{{
          anchorString
        }}</a
        >.&nbsp;</span
      >
      <p class="hw-message-name">
        {{ message.from.chara.chara_name.full_name }}
      </p>
      <p v-if="comingout" class="coming-out">{{ comingout }}</p>
      <p class="hw-message-player" v-if="message.from.player">
        [<a
          :href="'https://twitter.com/' + message.from.player.twitter_user_name"
          target="_blank"
          >{{ message.from.player.twitter_user_name }}</a
        >]
      </p>
      <p class="hw-message-datetime" :class="isDarkTheme ? 'dark-theme' : ''">
        {{ isAnchorMessage ? message.time.day + 'd' : '' }}
        {{ messageCount }}
        {{ messageDatetime }}
      </p>
    </div>
    <div class="hw-message-content-area">
      <div class="hw-message-face-area">
        <chara-image
          :chara="chara"
          :face-type="faceType"
          :is-large="isImgLarge"
        />
      </div>
      <div class="hw-message-text-area" :class="messageClass">
        <message-text
          :message-text="message.content.text"
          @click-anchor="$emit('click-anchor', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import messageText from '~/components/village/message/message-text.vue'
import Village from '~/components/type/village'
import Message from '~/components/type/message'
import Chara from '~/components/type/chara'
import { MESSAGE_TYPE } from '~/components/const/consts'
import villageUserSettings, {VillageUserSettings} from '~/components/village/user-settings/village-user-settings'
const charaImage = () => import('~/components/village/chara-image.vue')

@Component({
  components: {
    messageText,
    charaImage
  }
})
export default class MessageSay extends Vue {
  @Prop({ type: Object })
  private message!: Message

  @Prop({ type: Boolean })
  private isProgress!: boolean

  @Prop({ type: Boolean, default: false })
  private isAnchorMessage?: boolean

  private get village(): Village | null {
    return this.$store.getters.getVillage
  }

  private messageClassMap: Map<string, string> = new Map([
    [MESSAGE_TYPE.NORMAL_SAY, 'normal-say'],
    [MESSAGE_TYPE.WEREWOLF_SAY, 'werewolf-say'],
    [MESSAGE_TYPE.MONOLOGUE_SAY, 'monologue-say'],
    [MESSAGE_TYPE.GRAVE_SAY, 'grave-say'],
    [MESSAGE_TYPE.SPECTATE_SAY, 'spectate-say']
  ])

  private anchorPrefixMap: Map<string, string> = new Map([
    [MESSAGE_TYPE.NORMAL_SAY, ''],
    [MESSAGE_TYPE.MONOLOGUE_SAY, '-'],
    [MESSAGE_TYPE.GRAVE_SAY, '+'],
    [MESSAGE_TYPE.WEREWOLF_SAY, '*'],
    [MESSAGE_TYPE.MASON_SAY, '='],
    [MESSAGE_TYPE.SPECTATE_SAY, '@'],
    [MESSAGE_TYPE.CREATOR_SAY, '#']
  ])

  private get chara(): Chara {
    return this.message.from!.chara
  }

  private get faceType(): string {
    return this.message.content.face_code!
  }

  private get messageClass(): string {
    let className = this.messageClassMap.get(this.message.content.type.code)
    if (className == null) className = ''
    if (this.isDarkTheme) className += ' dark-theme'
    return className
  }

  private get isDarkTheme(): boolean {
    const settings: VillageUserSettings = this.$store.getters
      .getVillageUserSettings
    return settings.theme?.is_dark || false
  }

  private get comingout(): string | null {
    const colist = this.message.from!.coming_outs.list
    if (colist.length === 0) return null
    return colist.map(co => co.skill.short_name).join(',') + 'CO'
  }

  private get messageCount(): string {
    if (this.message.content.count == null || this.village == null) return ''
    const restrict = this.village.setting.rules.message_restrict.restrict_list.find(
      restrict => {
        return restrict.type.code === this.message.content.type.code
      }
    )
    if (!restrict) return ''
    return `(${this.message.content.count}/${restrict.count})`
  }

  private get messageDatetime(): string {
    const isDispDate = villageUserSettings.getMessageDisplay(this).is_disp_date
    return isDispDate
      ? this.message.time.datetime
      : this.message.time.datetime.substring(11)
  }

  private get isDispAnchorString(): boolean {
    return (
      !this.isProgress ||
      this.message.content.type.code !== MESSAGE_TYPE.MONOLOGUE_SAY
    )
  }

  private get anchorString(): string {
    const prefix = this.anchorPrefixMap.get(this.message.content.type.code)
    if (prefix == null) return ''
    return `>>${prefix}${this.message.content.num}`
  }

  private get isImgLarge(): boolean {
    return villageUserSettings.getMessageDisplay(this).is_img_large
  }

  private async copyAnchorString(): Promise<void> {
    const charaShortName = this.message.from
      ? this.message.from.chara.chara_name.short_name
      : ''
    const text =
      this.message.content.type.code === MESSAGE_TYPE.WEREWOLF_SAY
        ? this.anchorString
        : charaShortName + this.anchorString
    await (this as any).$copyText(text)
    this.$buefy.toast.open({
      message: `クリップボードにコピーしました: ${text}`,
      type: 'is-info',
      position: 'is-top'
    })
  }
}
</script>

<style lang="scss" scoped>
.hw-message-card {
  padding: 5px;
  margin-bottom: 5px;

  &.anchor-message {
    margin-left: 50px;
    margin-bottom: 5px;
  }

  .hw-message-name-area {
    padding-bottom: 5px;
    display: flex;

    .hw-message-name {
      text-align: left;
      font-weight: bold;
    }
    .coming-out {
      font-size: 11px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-left: 5px;
      padding: 1px 3px;
    }
    .hw-message-player {
      margin-left: 5px;
      text-align: left;
    }
    .hw-message-datetime {
      margin-left: auto;
      text-align: right;
      color: #aaaaaa;

      &.dark-theme {
        color: #ddd;
      }
    }
  }
  .hw-message-content-area {
    display: flex;

    .hw-message-face-area {
      padding-right: 5px;

      .hw-message-chara-image {
        vertical-align: bottom;
        border-radius: 5px;
      }
    }

    .hw-message-text-area {
      flex: 1;
      border: 1px solid #dddddd;
      border-radius: 5px;
      padding: 5px;
      font-family: sans-serif;

      .hw-message-text {
        text-align: left;
        word-break: break-word;
      }

      &.normal-say {
        background-color: $normal-say;

        &.dark-theme {
          background-color: rgba(0, 0, 0, 0.2);
          border: 1px solid $normal-say;
        }
      }
      &.werewolf-say {
        background-color: $werewolf-say;

        &.dark-theme {
          background-color: rgba(255, 0, 0, 0.2);
          border: 1px solid $werewolf-system-border;
        }
      }
      &.monologue-say {
        background-color: $monologue-say;

        &.dark-theme {
          background-color: rgba(200, 200, 200, 0.5);
          border: 1px solid #000;
        }
      }
      &.grave-say {
        background-color: $grave-say;

        &.dark-theme {
          background-color: rgba(0, 0, 255, 0.2);
          border: 1px solid $psychic-system-border;
        }
      }
      &.spectate-say {
        background-color: $spectate-say;

        &.dark-theme {
          background-color: rgba(255, 255, 0, 0.2);
          border: 1px solid $spectate-say;
        }
      }
    }
  }
}
</style>
