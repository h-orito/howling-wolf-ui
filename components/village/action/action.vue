<template>
  <div class="village-action-wrapper" :class="containerSizeClass">
    <div class="village-action-header">
      <b-button
        v-for="tab in activeTabs"
        :key="tab.name"
        class="village-action-header-item flex"
        :class="tab.code === activeTabCode ? 'active' : ''"
        size="is-small"
        @click="changeActiveTab(tab.code)"
        >{{ tab.name }}</b-button
      >
      <b-button
        :disabled="actionContainerSize === 0"
        class="village-action-header-item"
        icon-pack="fas"
        icon-left="compress"
        style="padding-top: 2px;"
        @click="handleMinimize"
      >
      </b-button>
      <b-button
        :disabled="actionContainerSize === 2"
        class="village-action-header-item"
        icon-pack="fas"
        icon-left="expand"
        style="padding-top: 2px;"
        @click="handleExpand"
      >
      </b-button>
    </div>
    <div class="village-action-container">
      <myself
        :class="activeTabCode === 'myself' ? '' : 'no-visible'"
        v-if="isDispMyself"
        :situation="situation"
      />
      <say
        :class="activeTabCode === 'say' ? '' : 'no-visible'"
        v-if="isDispSay"
        :village="village"
        :situation="situation"
        :window-size="actionContainerSize"
        @reload="$emit('reload', $event)"
        ref="say"
      />
      <participate
        :class="activeTabCode === 'participate' ? '' : 'no-visible'"
        v-if="isDispParticipate"
        :village="village"
        :situation="situation"
        ref="participate"
        @reload="$emit('reload', $event)"
      />
      <spectate
        :class="activeTabCode === 'spectate' ? '' : 'no-visible'"
        v-if="isDispSpectate"
        :village="village"
        :situation="situation"
        ref="spectate"
        @reload="$emit('reload', $event)"
      />
      <skill-request
        :class="activeTabCode === 'skill_request' ? '' : 'no-visible'"
        v-if="isDispSkillRequest"
        :village="village"
        :situation="situation"
        ref="skillRequest"
        @reload="$emit('reload', $event)"
      />
      <leave
        :class="activeTabCode === 'leave' ? '' : 'no-visible'"
        v-if="isDispLeave"
        :village="village"
        :situation="situation"
        @reload="$emit('reload', $event)"
      />
      <vote
        :class="activeTabCode === 'vote' ? '' : 'no-visible'"
        v-if="isDispVote"
        :village="village"
        :vote="situation.vote"
        ref="vote"
        @reload="$emit('reload', $event)"
      />
      <comingout
        :class="activeTabCode === 'comingout' ? '' : 'no-visible'"
        v-if="isDispComingout"
        :village="village"
        :situation="situation.coming_out"
        ref="comingout"
        @reload="$emit('reload', $event)"
      />
      <div v-for="ability in abilities" :key="ability.type.code">
        <ability
          :class="activeTabCode === ability.type.code ? '' : 'no-visible'"
          :village="village"
          :ability="ability"
          ref="ability"
          @reload="$emit('reload', $event)"
        />
      </div>
      <commit
        :class="activeTabCode === 'commit' ? '' : 'no-visible'"
        v-if="isDispCommit"
        :village="village"
        :situation="situation"
        ref="commit"
        @reload="$emit('reload', $event)"
      />
    </div>
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
// helper
import actionHelper, {
  VillageAction
} from '~/components/village/action/village-action-helper'
import villageUserSettings from '~/components/village/user-settings/village-user-settings'
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
const comingout = () =>
  import('~/components/village/action/comingout/comingout.vue')
const myself = () => import('~/components/village/action/myself/myself.vue')

const containerSizeClasses = ['minimized', 'small', 'large']

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
    comingout,
    myself
  }
})
export default class Action extends Vue {
  /** props */
  @Prop({ type: Object })
  private situation!: SituationAsParticipant

  @Prop({ type: Object })
  private village!: Village

  /** data */
  private activeTabCode: string = 'myself'
  private actionContainerSize: number = 0

  /** computed */
  private get activeTabs(): VillageAction[] {
    return actionHelper.getAvailableActions(this.situation)
  }

  private get existsAction(): boolean {
    return actionHelper.existsAction(this.situation)
  }

  private get isDispMyself(): boolean {
    return actionHelper.isDispMyself(this.situation)
  }

  private get isDispSay(): boolean {
    return this.situation.say.available_say
  }

  private get isDispParticipate(): boolean {
    return this.situation.participate.available_participate
  }

  private get isDispSpectate(): boolean {
    return this.situation.participate.available_spectate
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

  private get isDispCommit(): boolean {
    return this.situation.commit.available_commit
  }

  private get isDispComingout(): boolean {
    return this.situation.coming_out.available_coming_out
  }

  private get isInputting(): boolean {
    if (!this.situation.say.available_say) return false
    return (this.$refs as any).say.isInputting
  }

  private get abilities(): VillageAbilitySituation[] {
    return this.situation.ability.list.filter(ab => ab.usable)
  }

  private get containerSizeClass(): string {
    return `action-${containerSizeClasses[this.actionContainerSize]}`
  }

  /** method */
  private reset(): void {
    this.activeTabCode = this.getActiveTabCodeOrDefault()
    this.actionContainerSize = this.getActionContainerSize()
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

  private getActiveTabCodeOrDefault(): string {
    const code = villageUserSettings.getActionWindow(this).tab_code
    if (this.activeTabs.some(tab => tab.code === code)) return code
    // ないのでデフォルト
    return 'myself'
  }

  private getActionContainerSize(): number {
    return villageUserSettings.getActionWindow(this).size
  }

  private changeActiveTab(tabCode: string): void {
    this.activeTabCode = tabCode
    const actionWindowSetting = villageUserSettings.getActionWindow(this)
    actionWindowSetting.tab_code = tabCode
    villageUserSettings.setActionWindow(this, actionWindowSetting)
    if (this.actionContainerSize === 0) this.handleExpand()
  }

  private handleMinimize(): void {
    const actionWindowSetting = villageUserSettings.getActionWindow(this)
    actionWindowSetting.size -= 1
    if (actionWindowSetting.size < 0) actionWindowSetting.size = 0
    villageUserSettings.setActionWindow(this, actionWindowSetting)
    this.actionContainerSize = actionWindowSetting.size
  }

  private handleExpand(): void {
    const actionWindowSetting = villageUserSettings.getActionWindow(this)
    actionWindowSetting.size += 1
    if (actionWindowSetting.size >= 2) actionWindowSetting.size = 2
    villageUserSettings.setActionWindow(this, actionWindowSetting)
    this.actionContainerSize = actionWindowSetting.size
  }
}
</script>

<style lang="scss" scoped>
.village-action-wrapper {
  transition-property: all;
  transition-duration: 200ms;
  transition-delay: 0s;
  transition-timing-function: ease;
  .village-action-wrapper.action-small {
    height: 200px;
  }
  .village-action-wrapper.action-large {
    height: 320px;
  }
}

.village-action-header {
  height: 30px;
  border-top: 1.5px solid #dbdbdb;
  border-bottom: 1px solid #dbdbdb;
  display: flex;
  flex-shrink: 0;

  .village-action-header-item {
    border-top: 0;
    border-right: 0;
    border-left: 0;
    border-bottom: 0;
    height: 100%;
    border-right: 1px solid #ccc;
  }
  .village-action-header-item.flex {
    flex: 1;
  }
  .village-action-header-item:hover {
    border-bottom: 1px solid #000;
  }
  .village-action-header-item.active {
    color: $primary;
    border-bottom: 1px solid $primary !important;
  }
  .village-action-header-item:focus {
    outline: none !important;
    box-shadow: none !important;
  }
}

.village-action-container {
  flex: 1;
  flex-shrink: 0;
  overflow-y: scroll;
  padding: 10px;
  animation: show 1s linear 0s;

  .no-visible {
    display: none;
  }
}
.village-action-wrapper.action-minimized .village-action-container {
  height: 0;
  padding: 0;
  flex: auto;
}
</style>
