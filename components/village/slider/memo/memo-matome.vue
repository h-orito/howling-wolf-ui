<template>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th></th>
          <th
            v-for="charaName in matomes.chara_names"
            :key="charaName"
            class="has-text-centered"
          >
            {{ charaName }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(matome, index) in matomes.matomes" :key="matome.content">
          <td>
            <b-button
              size="is-small"
              icon-left="trash-alt"
              icon-pack="fas"
              @click="removeLine(index)"
              >削除</b-button
            >
          </td>
          <td
            v-for="(content, contentIndex) in matome.contents"
            :key="`${content}${contentIndex}`"
          >
            <b-button
              size="is-small"
              @click="changeContent(index, contentIndex)"
              >{{ content }}</b-button
            >
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td></td>
          <td :colspan="matomes.chara_names.length">
            <b-button size="is-small" type="is-primary" @click="addLine"
              >行を追加する</b-button
            >
          </td>
        </tr>
        <tr>
          <td></td>
          <td
            v-for="(_, index) in matomes.chara_names"
            :key="index"
            class="has-text-centered"
          >
            <b-button
              size="is-small"
              icon-left="arrow-left"
              icon-pack="fas"
              @click="toLeft(index)"
            /><br />
            <b-button
              size="is-small"
              icon-left="arrow-right"
              icon-pack="fas"
              @click="toRight(index)"
            />
          </td>
        </tr>
        <tr>
          <td></td>
          <td :colspan="matomes.chara_names.length">
            <b-button size="is-small" type="is-primary" @click="copy"
              >表を出力してクリップボードにコピー</b-button
            >
          </td>
        </tr>
      </tfoot>
    </table>
    <b-notification>
      ・クリックするたびに以下の順番で変化します。<br />
      &nbsp;&nbsp;&nbsp;＿ → 非 → 占 → 霊 → 狩 → 狼 → 狂 → 白 → 黒 → 偽 → 灰<br />
      ・まとめは自動保存されます。
    </b-notification>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// type
import Village from '~/components/type/village'
// component
import matome, { Matomes } from '~/components/village/slider/memo/matome'

@Component({
  components: {}
})
export default class MemoMatome extends Vue {
  @Prop({ type: Object })
  private matomes!: Matomes

  private get village(): Village | null {
    return this.$store.getters.getVillage
  }

  private addLine(): void {
    matome.addLine(this, this.village!)
    this.$emit('refresh')
  }

  private removeLine(index: number): void {
    matome.removeLine(this, this.village!, index)
    this.$emit('refresh')
  }

  private toLeft(index: number): void {
    if (index === 0) return
    matome.toLeft(this, this.village!, index)
    this.$emit('refresh')
  }

  private toRight(index: number): void {
    if (index === this.village!.participant.count - 1) return
    matome.toRight(this, this.village!, index)
    this.$emit('refresh')
  }

  private changeContent(lineIndex: number, contentIndex: number): void {
    matome.changeContent(this, this.village!, lineIndex, contentIndex)
    this.$emit('refresh')
  }

  private async copy(): Promise<void> {
    const str: string = matome.output(this, this.village!)
    // @ts-ignore
    await this.$copyText(str)
    this.$buefy.toast.open({
      message: `表をクリップボードにコピーしました`,
      type: 'is-info',
      position: 'is-top'
    })
  }
}
</script>
