<template>
  <div class="village-actions-wrapper">
    <div
      class="village-actions-container"
      :style="`padding-bottom: ${paddingBottom};`"
    >
      <say
        v-if="isDispSay"
        @reload="$emit('reload', $event)"
        ref="say"
        @fixed="reloadFixedStyle($event)"
      />
      <participate
        v-if="isDispParticipate"
        ref="participate"
        @reload="$emit('reload', $event)"
      />
      <skill-request
        v-if="isDispSkillRequest"
        ref="skillRequest"
        @reload="$emit('reload', $event)"
      />
      <leave v-if="isDispLeave" @reload="$emit('reload', $event)" />
      <div v-for="ability in abilities" :key="ability.type.code">
        <ability
          :ability="ability"
          ref="ability"
          @reload="$emit('reload', $event)"
        />
      </div>
      <vote v-if="isDispVote" ref="vote" @reload="$emit('reload', $event)" />
      <comingout
        v-if="isDispComingout"
        ref="comingout"
        @reload="$emit('reload', $event)"
      />
      <commit
        v-if="isDispCommit"
        ref="commit"
        @reload="$emit('reload', $event)"
      />
      <village-debug
        v-if="isDispDebugMenu"
        :village="debugVillage"
        @reload="$emit('reload', $event)"
      />
      <village-admin
        v-if="situation && situation.admin.admin"
        @reload="$emit('reload', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// components
import ability from '~/components/village/action/ability/ability-card.vue'
import vote from '~/components/village/action/vote/vote-card.vue'
// type
import SituationAsParticipant from '~/components/type/situation-as-participant'
import VillageAbilitySituation from '~/components/type/village-ability-situation'
import DebugVillage from '~/components/type/debug-village'
// helper
import actionHelper from '~/components/village/action/village-action-helper'
// dynamic imports
const participate = () =>
  import('~/components/village/action/participate/participate-card.vue')
const leave = () =>
  import('~/components/village/action/participate/leave-card.vue')
const skillRequest = () =>
  import('~/components/village/action/participate/skill-request-card.vue')
const say = () => import('~/components/village/action/say/say-card.vue')
const comingout = () =>
  import('~/components/village/action/comingout/comingout-card.vue')
const commit = () =>
  import('~/components/village/action/commit/commit-card.vue')
const villageDebug = () =>
  import('~/components/village/action/debug/village-debug.vue')
const villageAdmin = () =>
  import('~/components/village/action/admin/village-admin.vue')

@Component({
  components: {
    participate,
    skillRequest,
    leave,
    say,
    vote,
    ability,
    comingout,
    commit,
    villageDebug,
    villageAdmin
  }
})
export default class Action extends Vue {
  /** data */
  private paddingBottom: string = '0'

  /** computed */
  private get situation(): SituationAsParticipant {
    return this.$store.getters.getSituation!
  }

  private get existsAction(): boolean {
    return actionHelper.existsAction(this.situation)
  }

  private get isDispSay(): boolean {
    return this.situation.say.available_say
  }

  private get isDispParticipate(): boolean {
    return this.situation.participate.available_participate
  }

  private get isDispSkillRequest(): boolean {
    return (
      this.situation.participate.participating &&
      this.situation.skill_request.available_skill_request
    )
  }

  private get isDispLeave(): boolean {
    return this.situation.participate.available_leave
  }

  private get isDispVote(): boolean {
    return this.situation.vote.available_vote
  }

  private get isDispComingout(): boolean {
    return this.situation.coming_out.available_coming_out
  }

  private get isDispCommit(): boolean {
    return this.situation.commit.available_commit
  }

  private get isDispDebugMenu(): boolean {
    return this.debugVillage != null && this.situation != null
  }

  private get isInputting(): boolean {
    if (!this.situation.say.available_say) return false
    return (this.$refs as any).say.isInputting
  }

  private get debugVillage(): DebugVillage | null {
    return this.$store.getters.getDebugVillage
  }

  private get abilities(): VillageAbilitySituation[] {
    return this.situation.ability.list.filter(ab => ab.usable)
  }

  /** method */
  private reset(): void {
    const refs: any = this.$refs as any
    if (this.abilities.length > 0) {
      const abilityRefs: any[] = refs.ability
      abilityRefs.forEach(element => {
        element.resetTarget()
      })
    }
    if (this.situation.vote.available_vote && refs.vote) {
      refs.vote.resetTarget()
    }
    if (this.situation.coming_out.available_coming_out && refs.comingout) {
      refs.comingout.reset()
    }
  }

  private pasteToMessageInput(text: string): void {
    if (!this.$refs.say) return
    // @ts-ignore
    this.$refs.say.pasteToMessageInput(text)
  }

  private reloadFixedStyle({ paddingBottom }): void {
    this.paddingBottom = paddingBottom
  }
}
</script>

<style lang="scss" scoped>
.village-actions-wrapper {
  .village-actions-container {
    &.dark-theme {
      background-color: $dark;
      color: $white;
    }
  }
}
</style>

<style lang="scss">
.action-button-area {
  display: flex;
  justify-content: flex-end !important;
}
</style>
