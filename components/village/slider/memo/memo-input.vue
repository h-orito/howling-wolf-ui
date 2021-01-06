<template>
  <div class="field">
    <b-input
      size="is-small"
      type="textarea"
      rows="15"
      placeholder="400文字まで保存できます。"
      :value="value"
      @input="$emit('input', $event)"
    ></b-input>
    <p class="has-text-right">{{ counter }}</p>
    <b-button size="is-small" type="is-primary" @click="copy"
      >クリップボードにコピー</b-button
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class MemoInput extends Vue {
  @Prop({ type: String })
  private value!: string

  private get counter(): string {
    return `${this.lineCount}, ${this.lengthCount}`
  }

  private get lineCount(): string {
    const current = this.value.split('\n').length
    return `行数: ${current.toString()}`
  }

  private get lengthCount(): string {
    const current = this.value.length - this.value.split('\n').length + 1
    return `文字数: ${current.toString()}`
  }

  private async copy(): Promise<void> {
    // @ts-ignore
    await this.$copyText(this.value)
    this.$buefy.toast.open({
      message: `クリップボードにコピーしました`,
      type: 'is-info',
      position: 'is-top'
    })
  }
}
</script>

<style lang="scss" scoped>
.textarea {
  font-family: sans-serif;
}
</style>
