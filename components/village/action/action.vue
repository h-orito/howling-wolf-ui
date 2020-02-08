<template>
  <div>
    <hr />
    <myself
      v-if="situation.participate.myself && situation.participate.myself.skill"
      :situation="situation"
    />
    <say
      v-if="situation.say.available_say"
      :situation="situation"
      @say="$emit('say', $event)"
    />
    <participate
      v-if="situation.participate.available_participate"
      :situation="situation"
      @participate="$emit('participate', $event)"
    />
    <spectate
      v-if="situation.participate.available_spectate"
      :situation="situation"
      @spectate="$emit('spectate', $event)"
    />
    <leave
      v-if="situation.participate.available_leave"
      :situation="situation"
      @leave="$emit('leave')"
    />
    <skill-request
      v-if="
        situation.participate.participating &&
          situation.skill_request.available_skill_request
      "
      :situation="situation"
      @change-skill-request="$emit('change-skill-request', $event)"
    />
    <vote
      v-if="situation.vote.available_vote"
      :vote="situation.vote"
      @vote="$emit('vote', $event)"
    />
    <ability
      v-for="ability in situation.ability.list"
      :key="ability.type.code"
      :ability="ability"
      @set-ability="$emit('set-ability', $event)"
    />
    <commit
      v-if="situation.commit.available_commit"
      :situation="situation"
      @vote="$emit('commit', $event)"
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
}
</script>
