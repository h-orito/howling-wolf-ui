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
        <tr
          v-for="(matome, lineIndex) in matomes.matomes"
          :key="matome.content"
        >
          <td>
            <b-button
              size="is-small"
              icon-left="trash-alt"
              icon-pack="fas"
              @click="$emit('remove-line', { lineIndex })"
              >削除</b-button
            >
          </td>
          <td
            v-for="(content, contentIndex) in matome.contents"
            :key="`${content}${contentIndex}`"
          >
            <b-button
              size="is-small"
              @click="$emit('change-content', { lineIndex, contentIndex })"
              >{{ content }}</b-button
            >
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td></td>
          <td :colspan="matomes.chara_names.length">
            <b-button
              size="is-small"
              type="is-primary"
              @click="$emit('add-line')"
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
              @click="$emit('to-left', { index })"
            /><br />
            <b-button
              size="is-small"
              icon-left="arrow-right"
              icon-pack="fas"
              @click="$emit('to-right', { index })"
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
    </b-notification>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'
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

  private async copy(): Promise<void> {
    const str: string = matome.output(this.matomes)
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
