<template>
  <section>
    <b-input
      size="is-small"
      type="textarea"
      :rows="rowSize"
      :value="value"
      @input="$emit('input', $event)"
      :custom-class="messageClass"
    ></b-input>
    <p class="has-text-right" v-html="counter"></p>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Village from '~/components/type/village'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import VillageSaySituation from '~/components/type/village-say-situation'
import VillageSayRestrictSituation from '~/components/type/village-say-restrict-situation'
import { MESSAGE_TYPE } from '~/components/const/consts'
import { VillageUserSettings } from '~/components/village/user-settings/village-user-settings'

@Component({
  components: {}
})
export default class MessageInput extends Vue {
  @Prop({ type: String })
  private value!: string

  @Prop({ type: String })
  private messageType!: string

  @Prop({ type: Number, default: 6 })
  private rowSize!: number

  private get situation(): SituationAsParticipant {
    return this.$store.getters.getSituation!
  }

  private get saySituation(): VillageSaySituation {
    return this.situation.say
  }

  private get counter(): string {
    if (this.restrict == null) {
      return `${this.lineCount}, ${this.lengthCount}`
    } else {
      return `${this.remainingCount}, ${this.lineCount}, ${this.lengthCount}`
    }
  }

  private get restrict(): VillageSayRestrictSituation | null {
    if (this.saySituation == null) return null
    const messageTypeSituation = this.saySituation.selectable_message_type_list.find(
      restrictSituation =>
        restrictSituation.message_type.code === this.messageType
    )
    return messageTypeSituation == null ||
      !messageTypeSituation.restrict.restricted
      ? null
      : messageTypeSituation.restrict
  }

  private get existsOver(): boolean {
    if (this.restrict == null) {
      return this.isLineOver || this.isLengthOver
    } else {
      return this.isRemainingZero || this.isLineOver || this.isLengthOver
    }
  }

  private get isInputting(): boolean {
    return this.value.length > 0
  }

  private get remainingCount(): string {
    const max = this.restrict!.max_count!
    const remaining = this.restrict!.remaining_count!
    if (remaining === 0) {
      return `残り回数: <span class="has-text-danger">${remaining.toString()}/${max.toString()}</span>`
    } else {
      return `残り回数: ${remaining.toString()}/${max.toString()}`
    }
  }

  private get isRemainingZero(): boolean {
    const remaining = this.restrict!.remaining_count!
    return remaining === 0
  }

  private get lineCount(): string {
    const max = this.restrict == null ? 20 : this.restrict!.max_line
    const current = this.value.split('\n').length
    if (current > max) {
      return `行数: <span class="has-text-danger">${current.toString()}/${max.toString()}</span>`
    } else {
      return `行数: ${current.toString()}/${max.toString()}`
    }
  }

  private get isLineOver(): boolean {
    const max = this.restrict == null ? 20 : this.restrict!.max_line
    const current = this.value.split('\n').length
    return current > max
  }

  private get lengthCount(): string {
    const max = this.restrict == null ? 200 : this.restrict!.max_length
    const current = this.value.length - this.value.split('\n').length + 1
    if (current > max) {
      return `文字数: <span class="has-text-danger">${current.toString()}/${max.toString()}</span>`
    } else {
      return `文字数: ${current.toString()}/${max.toString()}`
    }
  }

  private get isLengthOver(): boolean {
    const max = this.restrict == null ? 200 : this.restrict!.max_length
    const current = this.value.length - this.value.split('\n').length + 1
    return current > max
  }

  private get messageClass(): string {
    let className: string = ''
    switch (this.messageType) {
      case MESSAGE_TYPE.NORMAL_SAY:
        className = 'normal-say-input'
        break
      case MESSAGE_TYPE.WEREWOLF_SAY:
        className = 'werewolf-say-input'
        break
      case MESSAGE_TYPE.MONOLOGUE_SAY:
        className = 'monologue-say-input'
        break
      case MESSAGE_TYPE.GRAVE_SAY:
        className = 'grave-say-input'
        break
      case MESSAGE_TYPE.SPECTATE_SAY:
        className = 'spectate-say-input'
        break
      default:
        return ''
    }
    if (this.isDarkTheme) className += ' dark-theme'
    return className
  }

  private get isDarkTheme(): boolean {
    const settings: VillageUserSettings = this.$store.getters
      .getVillageUserSettings
    return settings.theme?.is_dark || false
  }

}
</script>

<style lang="scss" scoped>
.textarea {
  font-family: sans-serif;
}
</style>

<style lang="scss">
.dark-theme {
  color: #eee !important;
}

.normal-say-input {
  background-color: $normal-say;

  &.dark-theme {
    background-color: rgba(0, 0, 0, 0.2);
    border: 1px solid $normal-say;
  }
}
.werewolf-say-input {
  background-color: $werewolf-say;

  &.dark-theme {
    background-color: rgba(255, 0, 0, 0.2);
    border: 1px solid $werewolf-system-border;
  }
}
.monologue-say-input {
  background-color: $monologue-say;

  &.dark-theme {
    background-color: rgba(200, 200, 200, 0.5);
    border: 1px solid #000;
  }
}
.grave-say-input {
  background-color: $grave-say;

  &.dark-theme {
    background-color: rgba(0, 0, 255, 0.2);
    border: 1px solid $psychic-system-border;
  }
}
.spectate-say-input {
  background-color: $spectate-say;

  &.dark-theme {
    background-color: rgba(255, 255, 0, 0.2);
    border: 1px solid $spectate-say;
  }
}
</style>
