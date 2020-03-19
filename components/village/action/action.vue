<template>
  <div>
    <hr />
    <myself v-if="situation.participate.myself" :situation="situation" />
    <say
      v-if="situation.say.available_say"
      :village="village"
      :situation="situation"
      @reload="$emit('reload', $event)"
      ref="say"
    />
    <participate
      v-if="situation.participate.available_participate"
      :village="village"
      :situation="situation"
      ref="participate"
      @reload="$emit('reload', $event)"
    />
    <spectate
      v-if="situation.participate.available_spectate"
      :village="village"
      :situation="situation"
      ref="spectate"
      @reload="$emit('reload', $event)"
    />
    <leave
      v-if="situation.participate.available_leave"
      :village="village"
      :situation="situation"
      @reload="$emit('reload', $event)"
    />
    <skill-request
      v-if="
        situation.participate.participating &&
          situation.skill_request.available_skill_request
      "
      :village="village"
      :situation="situation"
      ref="skillRequest"
      @reload="$emit('reload', $event)"
    />
    <vote
      v-if="situation.vote.available_vote"
      :village="village"
      :vote="situation.vote"
      ref="vote"
      @reload="$emit('reload', $event)"
    />
    <ability
      v-for="ability in abilities"
      :key="ability.type.code"
      :village="village"
      :ability="ability"
      ref="ability"
      @reload="$emit('reload', $event)"
    />
    <commit
      v-if="situation.commit.available_commit"
      :village="village"
      :situation="situation"
      ref="commit"
      @reload="$emit('reload', $event)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// components
import ability from '~/components/village/action/ability/ability.vue'
import vote from '~/components/village/action/vote/vote.vue'
// type
import SituationAsParticipant from '~/components/type/situation-as-participant'
import Village from '~/components/type/village'
import VillageAbilitySituation from '~/components/type/village-ability-situation'
// dynamic imports
const participate = () =>
  import('~/components/village/action/participate/participate.vue')
const spectate = () =>
  import('~/components/village/action/participate/spectate.vue')
const leave = () => import('~/components/village/action/participate/leave.vue')
const skillRequest = () =>
  import('~/components/village/action/participate/skill-request.vue')
const say = () => import('~/components/village/action/say/say.vue')
const commit = () => import('~/components/village/action/commit/commit.vue')
const myself = () => import('~/components/village/action/myself/myself.vue')

@Component({
  components: {
    participate,
    spectate,
    skillRequest,
    leave,
    say,
    vote,
    ability,
    commit,
    myself
  }
})
export default class Action extends Vue {
  @Prop({ type: Object })
  private situation!: SituationAsParticipant

  @Prop({ type: Object })
  private village!: Village

  private get isInputting(): boolean {
    if (!this.situation.say.available_say) return false
    return (this.$refs as any).say.isInputting
  }

  private get abilities(): VillageAbilitySituation[] {
    return this.situation.ability.list.filter(ab => ab.usable)
  }

  private reset(): void {
    const refs: any = this.$refs as any
    if (this.situation.ability.list.length > 0) {
      const abilityRefs: any[] = refs.ability
      abilityRefs.forEach(element => {
        element.resetTarget()
      })
    }
    if (this.situation.vote.available_vote) {
      refs.vote.resetTarget()
    }
  }
}
</script>
