<template>
  <div class="card-content m-b-5" :class="messageClass">
    <div class="content has-text-left">
      <message-text
        v-if="message.content.type.code !== 'PARTICIPANTS'"
        :message-text="message.content.text"
      />
      <message-participant-list
        v-if="message.content.type.code === 'PARTICIPANTS'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import messageText from '~/components/village/message/message-text.vue'
import messageParticipantList from '~/components/village/message/message-participant-list.vue'
import Village from '~/components/type/village'
import Message from '~/components/type/message'
import { MESSAGE_TYPE } from '~/components/const/consts'
import { VillageUserSettings } from '~/components/village/user-settings/village-user-settings'

@Component({
  components: {
    messageText,
    messageParticipantList
  }
})
export default class SystemMessage extends Vue {
  @Prop({ type: Object })
  private message!: Message

  private get village(): Village {
    return this.$store.getters.getVillage!
  }

  private get messageClass(): string {
    let clazz = ''
    switch (this.message.content.type.code) {
      case MESSAGE_TYPE.PUBLIC_SYSTEM:
        clazz = ''
        break
      case MESSAGE_TYPE.PRIVATE_SYSTEM:
        clazz = 'message-system-private'
        break
      case MESSAGE_TYPE.PRIVATE_SEER:
        clazz = 'message-system-private-seer'
        break
      case MESSAGE_TYPE.PRIVATE_PSYCHIC:
        clazz = 'message-system-private-psychic'
        break
      case MESSAGE_TYPE.PRIVATE_WEREWOLF:
        clazz = 'message-system-private-werewolf'
        break
      case MESSAGE_TYPE.PRIVATE_MASON:
        clazz = 'message-system-private-mason'
        break
      case MESSAGE_TYPE.PARTICIPANTS:
      default:
    }
    if (this.isDarkTheme) clazz += ' dark-theme'
    return clazz
  }

  private get isDarkTheme(): boolean {
    const settings: VillageUserSettings = this.$store.getters
      .getVillageUserSettings
    return settings.theme?.is_dark || false
  }
}
</script>

<style lang="scss" scoped>
.card-content {
  padding: 10px !important;
  font-family: sans-serif;
  border: 1px solid #ccc;
  border-radius: 5px;

  &.dark-theme {
    border: 1px solid $white;
  }

  &.message-system-private {
    border: 1px solid $private-system-border;
    background-color: $private-system-bg;

    &.dark-theme {
      background-color: $private-system-bg-dark;
    }
  }
  &.message-system-private-seer {
    border: 1px solid $seer-system-border;
    background-color: $seer-system-bg;

    &.dark-theme {
      background-color: $seer-system-bg-dark;
    }
  }
  &.message-system-private-psychic {
    border: 1px solid $psychic-system-border;
    background-color: $psychic-system-bg;

    &.dark-theme {
      background-color: $psychic-system-bg-dark;
    }
  }
  &.message-system-private-werewolf {
    border: 1px solid $werewolf-system-border;
    background-color: $werewolf-system-bg;

    &.dark-theme {
      background-color: $werewolf-system-bg-dark;
    }
  }
  &.message-system-private-mason {
    border: 1px solid $mason-system-border;
    background-color: $mason-system-bg;

    &.dark-theme {
      background-color: $mason-system-bg-dark;
    }
  }
}
</style>
