<template>
  <div>
    <!-- 参加 or 見学 -->
    <participate
      v-if="situation.participate.available_participate"
      :situation="situation"
    />
    <spectate
      v-if="situation.participate.available_spectate"
      :situation="situation"
    />
    <leave
      v-if="situation.participate.available_leave"
      :situation="situation"
    />
    <skill-request
      v-if="
        situation.participate.participating &&
          situation.skill_request.available_skill_request
      "
      :situation="situation"
    />
    <say v-if="situation.say.available_say" :situation="situation" />
    <vote v-if="situation.vote.available_vote" :situation="situation" />
    <ability
      v-for="ability in situation.ability.list"
      :key="ability.type.code"
      :ability="ability"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
// component
import participate from '~/components/village/action/participate/participate.vue'
import spectate from '~/components/village/action/participate/spectate.vue'
import leave from '~/components/village/action/participate/leave.vue'
import skillRequest from '~/components/village/action/participate/skill-request.vue'
import say from '~/components/village/action/say/say.vue'
import vote from '~/components/village/action/vote/vote.vue'
import ability from '~/components/village/action/ability/ability.vue'
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
    ability
  }
})
export default class Action extends Vue {
  @Prop({ type: Object })
  private situation!: SituationAsParticipant

  private participate(): void {}
}
</script>
