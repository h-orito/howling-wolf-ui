<template>
  <section>
    <b-input
      size="is-small"
      type="textarea"
      :value="value"
      @input="$emit('input', $event)"
    ></b-input>
    <p class="has-text-right">{{ counter }}</p>
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

  @Prop({ type: Object })
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

  private get remainingCount(): string {
    const max = this.restrict!.max_count!
    const remaining = this.restrict!.remaining_count!
    return `残り回数: ${remaining.toString()}/${max.toString()}`
  }

  private get lineCount(): string {
    const max = this.restrict == null ? 20 : this.restrict!.max_line
    const current = this.value.split('\n').length
    return `行数: ${current.toString()}/${max.toString()}`
  }

  private get lengthCount(): string {
    const max = this.restrict == null ? 200 : this.restrict!.max_length
    const current = this.value.length - this.value.split('\n').length + 1
    return `文字数: ${current.toString()}/${max.toString()}`
  }
}
</script>
