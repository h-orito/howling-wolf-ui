<template>
  <action-card :title="'参加する'">
    <template v-slot:content>
      <div class="content has-text-left">
        <p style="font-weight: 700; margin-bottom: 6px;">キャラ</p>
        <b-field>
          <b-select v-model="charaId" expanded size="is-small">
            <option
              v-for="chara in situation.participate.selectable_chara_list"
              :value="chara.id.toString()"
              :key="chara.id.toString()"
              >{{ chara.chara_name.name }}</option
            >
          </b-select>
          <p class="control">
            <button class="button is-primary is-small">画像で選択</button>
          </p>
        </b-field>
      </div>
    </template>
    <template v-slot:footer>
      <b-button
        :disabled="!canSubmit || submitting"
        @click="participate"
        type="is-primary"
        size="is-small"
        >見学する</b-button
      >
    </template>
  </action-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import SituationAsParticipant from '~/components/type/situation-as-participant'

@Component({
  components: {}
})
export default class Spectate extends Vue {
  @Prop({ type: Object })
  private situation!: SituationAsParticipant

  private submitting: boolean = false
  private charaId: number | null = null

  // 参加ボタンを押下できるか
  private get canSubmit(): boolean {
    return this.charaId != null
  }

  private spectate(): void {
    this.submitting = true
    this.$emit('spectate', {
      charaId: this.charaId
    })
  }
}
</script>
