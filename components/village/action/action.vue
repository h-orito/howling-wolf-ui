<template>
  <div class="action-footer">
    <b-tabs
      class="village-action-header"
      size="is-small"
      expanded
      position="is-right"
    >
      <b-tab-item
        class="action-footer-item"
        v-if="situation.participate.myself"
        label="参加情報"
        icon-pack="fas"
        icon="user"
      >
        <myself :situation="situation" />
      </b-tab-item>

      <b-tab-item
        class="action-footer-item"
        v-if="situation.say.available_say"
        label="発言"
        icon-pack="fas"
        icon="comment-dots"
      >
        <say
          :village="village"
          :situation="situation"
          @reload="$emit('reload', $event)"
          ref="say"
        />
      </b-tab-item>

      <b-tab-item
        class="action-footer-item"
        v-if="situation.participate.available_participate"
        label="参加"
        icon-pack="fas"
        icon="sign-in-alt"
      >
        <participate
          :village="village"
          :situation="situation"
          ref="participate"
          @reload="$emit('reload', $event)"
        />
      </b-tab-item>

      <b-tab-item
        class="action-footer-item"
        v-if="situation.participate.available_spectate"
        label="見学"
        icon-pack="fas"
        icon="sign-in-alt"
      >
        <spectate
          v-if="situation.participate.available_spectate"
          :village="village"
          :situation="situation"
          ref="spectate"
          @reload="$emit('reload', $event)"
        />
      </b-tab-item>

      <b-tab-item
        class="action-footer-item"
        v-if="
          situation.participate.participating &&
            situation.skill_request.available_skill_request
        "
        label="役職希望"
        icon-pack="fas"
        icon="star"
      >
        <skill-request
          :village="village"
          :situation="situation"
          ref="skillRequest"
          @reload="$emit('reload', $event)"
        />
      </b-tab-item>

      <b-tab-item
        class="action-footer-item"
        v-if="situation.participate.available_leave"
        label="退村"
        icon-pack="fas"
        icon="sign-out-alt"
      >
        <leave
          :village="village"
          :situation="situation"
          @reload="$emit('reload', $event)"
        />
      </b-tab-item>

      <b-tab-item
        class="action-footer-item"
        v-if="situation.vote.available_vote"
        label="投票"
        icon-pack="fas"
        icon="vote-yea"
      >
        <vote
          :village="village"
          :vote="situation.vote"
          ref="vote"
          @reload="$emit('reload', $event)"
        />
      </b-tab-item>

      <b-tab-item
        v-for="ability in abilities"
        :key="ability.type.code"
        class="action-footer-item"
        :label="'能力:' + ability.type.name"
        icon-pack="fas"
        icon="bolt"
      >
        <ability
          :village="village"
          :ability="ability"
          ref="ability"
          @reload="$emit('reload', $event)"
        />
      </b-tab-item>

      <b-tab-item
        v-if="situation.commit.available_commit"
        class="action-footer-item"
        label="時短希望"
        icon-pack="fas"
        icon="clock"
      >
        <commit
          :village="village"
          :situation="situation"
          ref="commit"
          @reload="$emit('reload', $event)"
        />
      </b-tab-item>
    </b-tabs>
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
  /** props */
  @Prop({ type: Object })
  private situation!: SituationAsParticipant

  @Prop({ type: Object })
  private village!: Village

  private get isInputting(): boolean {
    if (!this.situation.say.available_say) return false
    return (this.$refs as any).say.isInputting
  }

  /** data */
  /** computed */
  private get abilities(): VillageAbilitySituation[] {
    return this.situation.ability.list.filter(ab => ab.usable)
  }

  /** method */
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

<style lang="scss">
.action-footer {
  width: 100%;
  height: 100%;
  background-color: $white;
  border-top: 1px solid #dbdbdb;
}
</style>
