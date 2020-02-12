<template>
  <div>
    <hr />
    <myself v-if="situation.participate.myself" :situation="situation" />
    <say
      v-if="situation.say.available_say"
      :village="village"
      :situation="situation"
      @reload="$emit('load-latest', $event)"
      ref="say"
    />
    <participate
      v-if="situation.participate.available_participate"
      :village="village"
      :situation="situation"
      @reload="$emit('reload', $event)"
    />
    <spectate
      v-if="situation.participate.available_spectate"
      :village="village"
      :situation="situation"
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
      @reload="$emit('reload', $event)"
    />
    <vote
      v-if="situation.vote.available_vote"
      :village="village"
      :vote="situation.vote"
    />
    <ability
      v-for="ability in situation.ability.list"
      :key="ability.type.code"
      :village="village"
      :ability="ability"
    />
    <commit
      v-if="situation.commit.available_commit"
      :village="village"
      :situation="situation"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// component
import participate from '~/components/village/action/participate/participate.vue'
import spectate from '~/components/village/action/participate/spectate.vue'
import leave from '~/components/village/action/participate/leave.vue'
import skillRequest from '~/components/village/action/participate/skill-request.vue'
import say from '~/components/village/action/say/say.vue'
import vote from '~/components/village/action/vote/vote.vue'
import ability from '~/components/village/action/ability/ability.vue'
import commit from '~/components/village/action/commit/commit.vue'
import myself from '~/components/village/action/myself/myself.vue'
// type
import SituationAsParticipant from '~/components/type/situation-as-participant'
import Village from '~/components/type/village'

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
}
</script>
