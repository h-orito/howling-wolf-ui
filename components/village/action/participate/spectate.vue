<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title has-text-grey">参加する</p>
    </header>
    <div class="card-content">
      <div class="content has-text-left">
        キャラ：
        <v-select :options="selectableCharaList" model="charaId"></v-select>
      </div>
      <div
        v-if="situation.skill_request.available_skill_request"
        class="content has-text-left"
      >
        役職第1希望：
        <v-select
          :options="selectableSkillList"
          model="firstRequestSkillCode"
        ></v-select>
      </div>
      <div
        v-if="situation.skill_request.available_skill_request"
        class="content has-text-left"
      >
        役職第2希望：
        <v-select
          :options="selectableSkillList"
          model="secondRequestSkillCode"
        ></v-select>
      </div>
    </div>
    <footer class="card-footer">
      <div class="card-footer-item has-text-left">
        <button
          :disabled="!canSubmitParticipate || submitting"
          @click="participate"
          class="button is-primary"
        >
          参加する
        </button>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import Chara from '~/components/type/chara'
import Skill from '~/components/type/skill'

@Component({
  components: {}
})
export default class Spectate extends Vue {
  @Prop({ type: Object })
  private situation!: SituationAsParticipant

  // 参加/見学
  private charaId: number | null = null
  private firstRequestSkillCode: string | null =
    this.situation.skill_request.skill_request == null
      ? null
      : this.situation.skill_request.skill_request.first.code
  private secondRequestSkillCode: string | null =
    this.situation.skill_request.skill_request == null
      ? null
      : this.situation.skill_request.skill_request.second.code

  private get selectableCharaList(): Array<any> {
    return this.situation.participate.selectable_chara_list.map(
      (chara: Chara) => {
        return {
          label: chara.chara_name.name,
          code: chara.id.toString
        }
      }
    )
  }
  private get selectableSkillList(): Array<any> {
    return this.situation.skill_request.selectable_skill_list.map(
      (skill: Skill) => {
        return {
          label: skill.name,
          code: skill.name
        }
      }
    )
  }
  // 参加ボタンを押下できるか
  private get canSubmitParticipate(): Boolean {
    return this.charaId != null
  }

  private participate(): void {}
}
</script>
