<template>
  <div>
    <action-card
      title="役職希望"
      :id="id"
      :is-open="isOpen"
      :exists-footer="false"
    >
      <template v-slot:content>
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
        <div class="action-button-area">
          <b-button
            :disabled="!canSubmit || submitting"
            @click="changeSkillRequest"
            type="is-primary"
            size="is-small"
            class="button is-primary"
          >
            役職希望変更する
          </b-button>
        </div>
      </template>
    </action-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import actionCard from '~/components/village/action/action-card.vue'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import api from '~/components/village/village-api'
import toast from '~/components/village/village-toast'
import villageUserSettings from '~/components/village/user-settings/village-user-settings'

@Component({
  components: { actionCard }
})
export default class SkillRequest extends Vue {
  private firstRequestSkillCode: string | null =
    this.situation.skill_request.skill_request == null
      ? null
      : this.situation.skill_request.skill_request.first.code

  private secondRequestSkillCode: string | null =
    this.situation.skill_request.skill_request == null
      ? null
      : this.situation.skill_request.skill_request.second.code

  private submitting = false
  private id: string = 'skillrequest-aria-id'
  private isOpen: boolean =
    villageUserSettings.getActionWindow(this).open_map![this.id] == null
      ? true
      : villageUserSettings.getActionWindow(this).open_map![this.id]

  private get villageId(): number {
    return this.$store.getters.getVillageId!
  }

  private get situation(): SituationAsParticipant {
    return this.$store.getters.getSituation!
  }

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
        this.villageId,
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
