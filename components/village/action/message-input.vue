<template>
  <section>
    <b-input
      size="is-small"
      type="textarea"
      :value="value"
      @input="$emit('input', $event)"
      :custom-class="messageClass"
    ></b-input>
    <p class="has-text-right" v-html="counter"></p>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Village from '~/components/type/village'
import VillageSaySituation from '~/components/type/village-say-situation'
import VillageSayRestrictSituation from '~/components/type/village-say-restrict-situation'

@Component({
  components: {}
})
export default class MessageInput extends Vue {
  @Prop({ type: String })
  private value!: string

  @Prop({ type: Object })
  private situation!: VillageSaySituation | null

  @Prop({ type: String })
  private messageType!: string

  private get counter(): string {
    if (this.restrict == null) {
      return `${this.lineCount}, ${this.lengthCount}`
    } else {
      return `${this.remainingCount}, ${this.lineCount}, ${this.lengthCount}`
    }
  }

  private get restrict(): VillageSayRestrictSituation | null {
    if (this.situation == null) return null
    const messageTypeSituation = this.situation.selectable_message_type_list.find(
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
    // const max = this.restrict == null ? 20 : this.restrict!.max_line
    const max = 20
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
    switch (this.messageType) {
      case 'NORMAL_SAY':
        return 'normal-say'
      case 'WEREWOLF_SAY':
        return 'werewolf-say'
      case 'MONOLOGUE_SAY':
        return 'monologue-say'
      case 'GRAVE_SAY':
        return 'grave-say'
      case 'SPECTATE_SAY':
        return 'spectate-say'
      default:
        return ''
    }
  }
}
</script>

<style lang="scss">
.normal-say {
  background-color: $normal-say !important;
}
.werewolf-say {
  background-color: $werewolf-say !important;
}
.monologue-say {
  background-color: $monologue-say !important;
}
.grave-say {
  background-color: $grave-say !important;
}
.spectate-say {
  background-color: $spectate-say !important;
}
</style>
