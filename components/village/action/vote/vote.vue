<template>
  <div>
    <div class="content has-text-left">
      <p>現在のセット先: {{ currentTargetName }}</p>
      <p style="font-weight: 700; margin-bottom: 6px;">対象</p>
      <b-field>
        <b-select
          v-model="participantId"
          :disable="vote.target_list.length === 0"
          expanded
          size="is-small"
        >
          <option
            v-for="participant in vote.target_list"
            :value="participant.id.toString()"
            :key="participant.id.toString()"
            >{{ participant.chara.chara_name.full_name }}</option
          >
        </b-select>
      </b-field>
    </div>
    <b-button @click="setVote" type="is-primary" size="is-small" expanded>
      投票する
    </b-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Village from '~/components/type/village'
import Chara from '~/components/type/chara'
import VillageVoteSituation from '~/components/type/village-vote-situation'

@Component({
  components: {}
})
export default class Vote extends Vue {
  @Prop({ type: Object })
  private village!: Village

  @Prop({ type: Object })
  private vote!: VillageVoteSituation

  private submitting: boolean = false
  private participantId: number | null =
    this.vote.target == null ? null : this.vote.target.id

  private get currentTargetName(): string {
    if (!this.vote.target) return 'なし'
    return this.vote.target.chara.chara_name.full_name
  }

  private get canSubmit(): boolean {
    if (this.submitting) return false
    return this.vote.target_list.length !== 0 && this.participantId != null
  }

  private async setVote(): Promise<void> {
    this.submitting = true
    await this.$axios.$post(`/village/${this.village!.id}/vote`, {
      target_id: this.participantId
    })
    this.submitting = false
    this.$buefy.toast.open({
      message: 'セットしました',
      type: 'is-success',
      position: 'is-top'
    })
    this.$emit('reload')
  }

  private resetTarget(): void {
    this.participantId = this.vote.target == null ? null : this.vote.target.id
  }
}
</script>
