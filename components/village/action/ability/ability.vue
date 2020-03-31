<template>
  <div>
    <div class="content has-text-left">
      <p>現在のセット先: {{ currentTargetName }}</p>
      <p style="font-weight: 700; margin-bottom: 6px;">対象</p>
      <b-field>
        <b-select
          v-model="participantId"
          :disabled="!ability.usable || ability.target_list.length === 0"
          expanded
          size="is-small"
        >
          <option v-if="ability.available_no_target" value="">
            なし
          </option>
          <option
            v-for="participant in ability.target_list"
            :value="participant.id.toString()"
            :key="participant.id.toString()"
            >{{ participant.chara.chara_name.full_name }}</option
          >
        </b-select>
      </b-field>
    </div>
    <b-button
      :disabled="!canSubmit || submitting"
      @click="setAbility"
      type="is-primary"
      size="is-small"
      expanded
      >セットする</b-button
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// components
// type
import Village from '~/components/type/village'
import Chara from '~/components/type/chara'
import VillageAbilitySituation from '~/components/type/village-ability-situation'

@Component({
  components: {}
})
export default class Ability extends Vue {
  @Prop({ type: Object })
  private village!: Village

  @Prop({ type: Object })
  private ability!: VillageAbilitySituation

  private submitting: boolean = false
  private participantId: number | null =
    this.ability.target == null ? null : this.ability.target.id

  private get currentTargetName(): string {
    if (!this.ability.target) return 'なし'
    return this.ability.target.chara.chara_name.full_name
  }

  private get canSubmit(): boolean {
    if (this.submitting) return false
    if (this.ability.available_no_target) {
      return this.ability.usable && this.ability.target_list.length !== 0
    } else {
      return (
        this.ability.usable &&
        this.ability.target_list.length !== 0 &&
        this.participantId != null
      )
    }
  }

  private resetTarget(): void {
    this.participantId =
      this.ability.target == null ? null : this.ability.target.id
  }

  private async setAbility(): Promise<void> {
    this.submitting = true
    await this.$axios.$post(`/village/${this.village!.id}/ability`, {
      target_id: this.participantId,
      ability_type: this.ability.type.code
    })
    this.submitting = false
    this.$buefy.toast.open({
      message: 'セットしました',
      type: 'is-success',
      position: 'is-top'
    })
    this.$emit('reload')
  }
}
</script>
