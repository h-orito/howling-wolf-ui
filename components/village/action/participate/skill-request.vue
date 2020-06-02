<template>
  <div>
    <div
      v-if="situation.skill_request.available_skill_request"
      class="content has-text-left"
    >
      <p>現在の希望: {{ currentRequest }}</p>
      <b-field label="役職第1希望" custom-class="is-small">
        <b-select v-model="firstRequestSkillCode" expanded size="is-small">
          <option
            v-for="skill in situation.skill_request.selectable_skill_list"
            :value="skill.code"
            :key="skill.code"
          >
            {{ skill.name }}
          </option>
        </b-select>
      </b-field>
      <b-field custom-class="is-small" label="役職第2希望">
        <b-select v-model="secondRequestSkillCode" expanded size="is-small">
          <option
            v-for="skill in situation.skill_request.selectable_skill_list"
            :value="skill.code"
            :key="skill.code"
          >
            {{ skill.name }}
          </option>
        </b-select>
      </b-field>
    </div>
    <b-button
      :disabled="!canSubmit || submitting"
      @click="changeSkillRequest"
      type="is-primary"
      size="is-small"
      class="button is-primary"
      expanded
    >
      役職希望変更する
    </b-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import Village from '~/components/type/village'
import Skill from '~/components/type/skill'
import api from '~/components/village/village-api'
import toast from '~/components/village/village-toast'

@Component({
  components: {}
})
export default class SkillRequest extends Vue {
  @Prop({ type: Object })
  private village!: Village

  @Prop({ type: Object })
  private situation!: SituationAsParticipant

  private firstRequestSkillCode: string | null =
    this.situation.skill_request.skill_request == null
      ? null
      : this.situation.skill_request.skill_request.first.code

  private secondRequestSkillCode: string | null =
    this.situation.skill_request.skill_request == null
      ? null
      : this.situation.skill_request.skill_request.second.code

  private submitting = false

  // 変更ボタンを押下できるか
  private get canSubmit(): boolean {
    return (
      this.firstRequestSkillCode != null && this.secondRequestSkillCode != null
    )
  }

  private get currentRequest(): string {
    const first = this.situation.skill_request.skill_request!.first.name
    const second = this.situation.skill_request.skill_request!.second.name
    return `${first} / ${second}`
  }

  private async changeSkillRequest(): Promise<void> {
    this.submitting = true
    try {
      await api.postSkillRequest(
        this,
        this.village.id,
        this.firstRequestSkillCode!,
        this.secondRequestSkillCode!
      )
      toast.success(this, '変更しました')
      this.$emit('reload')
    } catch (error) {}
    this.submitting = false
  }
}
</script>
