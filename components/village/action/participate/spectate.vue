<template>
  <div>
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
    <b-button
      :disabled="!canSubmit || submitting"
      @click="participate"
      type="is-primary"
      size="is-small"
      expanded
      >見学する</b-button
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Village from '~/components/type/village'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import api from '~/components/village/village-api'

@Component({
  components: {}
})
export default class Spectate extends Vue {
  @Prop({ type: Object })
  private village!: Village

  @Prop({ type: Object })
  private situation!: SituationAsParticipant

  private submitting: boolean = false
  private charaId: number | null = null

  // 参加ボタンを押下できるか
  private get canSubmit(): boolean {
    return this.charaId != null
  }

  private async spectate(): Promise<void> {
    this.submitting = true
    try {
      await api.postParticipate(
        this,
        this.village.id,
        this.charaId!,
        null,
        null,
        'dummy join message',
        'dummy password',
        true
      )
      this.$emit('reload')
    } catch (error) {}
  }
}
</script>
