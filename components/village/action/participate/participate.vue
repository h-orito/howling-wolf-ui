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
        <b-field
          v-if="situation.skill_request.available_skill_request"
          label="役職第1希望"
          custom-class="is-small"
        >
          <b-select v-model="firstRequestSkillCode" expanded size="is-small">
            <option
              v-for="skill in situation.skill_request.selectable_skill_list"
              :value="skill.code"
              :key="skill.code"
              >{{ skill.name }}</option
            >
          </b-select>
        </b-field>
        <b-field
          v-if="situation.skill_request.available_skill_request"
          custom-class="is-small"
          label="役職第2希望"
        >
          <b-select v-model="secondRequestSkillCode" expanded size="is-small">
            <option
              v-for="skill in situation.skill_request.selectable_skill_list"
              :value="skill.code"
              :key="skill.code"
              >{{ skill.name }}</option
            >
          </b-select>
        </b-field>
      </div>
    </template>
    <template v-slot:footer>
      <b-button
        :disabled="!canSubmit || submitting"
        @click="participate"
        type="is-primary"
        size="is-small"
        >参加する</b-button
      >
    </template>
  </action-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import actionCard from '~/components/village/action/action-card.vue'
import SituationAsParticipant from '~/components/type/situation-as-participant'

@Component({
  components: { actionCard }
})
export default class Participate extends Vue {
  @Prop({ type: Object })
  private situation!: SituationAsParticipant

  private submitting: boolean = false
  private charaId: number | null = null
  private firstRequestSkillCode: string | null =
    this.situation.skill_request.skill_request == null
      ? null
      : this.situation.skill_request.skill_request.first.code

  private secondRequestSkillCode: string | null =
    this.situation.skill_request.skill_request == null
      ? null
      : this.situation.skill_request.skill_request.second.code

  // 参加ボタンを押下できるか
  private get canSubmit(): boolean {
    return (
      this.charaId != null &&
      this.firstRequestSkillCode != null &&
      this.secondRequestSkillCode != null
    )
  }

  private async participate(): Promise<void> {
    this.submitting = true
    await this.$emit('participate', {
      charaId: this.charaId,
      firstRequestSkillCode: this.firstRequestSkillCode,
      secondRequestSkillCode: this.secondRequestSkillCode
    })
    this.submitting = false
  }
}
</script>
