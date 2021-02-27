<template>
  <div class="village-action-wrapper" :class="containerSizeClass">
    <div
      class="village-action-header"
      :class="$store.getters.isDarkTheme ? 'dark-theme' : ''"
    >
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
      />
      <say
        :class="activeTabCode === 'say' ? '' : 'no-visible'"
        v-if="isDispSay"
        :window-size="actionContainerSize"
        @reload="$emit('reload', $event)"
        ref="say"
      />
      <participate
        :class="activeTabCode === 'participate' ? '' : 'no-visible'"
        v-if="isDispParticipate"
        ref="participate"
        @reload="$emit('reload', $event)"
      />
      <spectate
        :class="activeTabCode === 'spectate' ? '' : 'no-visible'"
        v-if="isDispSpectate"
        ref="spectate"
        @reload="$emit('reload', $event)"
      />
      <skill-request
        :class="activeTabCode === 'skill_request' ? '' : 'no-visible'"
        v-if="isDispSkillRequest"
        ref="skillRequest"
        @reload="$emit('reload', $event)"
      />
      <leave
        :class="activeTabCode === 'leave' ? '' : 'no-visible'"
        v-if="isDispLeave"
        @reload="$emit('reload', $event)"
      />
      <vote
        :class="activeTabCode === 'vote' ? '' : 'no-visible'"
        v-if="isDispVote"
        ref="vote"
        @reload="$emit('reload', $event)"
      />
      <comingout
        :class="activeTabCode === 'comingout' ? '' : 'no-visible'"
        v-if="isDispComingout"
        ref="comingout"
        @reload="$emit('reload', $event)"
      />
      <div v-for="ability in abilities" :key="ability.type.code">
        <ability
          :class="activeTabCode === ability.type.code ? '' : 'no-visible'"
          :ability="ability"
          ref="ability"
          @reload="$emit('reload', $event)"
        />
      </div>
      <commit
        :class="activeTabCode === 'commit' ? '' : 'no-visible'"
        v-if="isDispCommit"
        ref="commit"
        @reload="$emit('reload', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// components
import ability from '~/components/village/action/ability/ability.vue'
import vote from '~/components/village/action/vote/vote.vue'
// type
import SituationAsParticipant from '~/components/type/situation-as-participant'
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
  /** data */
  private activeTabCode: string = 'myself'
  private actionContainerSize: number = 0

  /** computed */
  private get situation(): SituationAsParticipant {
    return this.$store.getters.getSituation!
  }

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

  private pasteToMessageInput(text: string): void {
    if (!this.$refs.say) return
    // @ts-ignore
    this.$refs.say.pasteToMessageInput(text)
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

    &.flex {
      flex: 1;
    }
    :hover {
      border-bottom: 1px solid #000;
    }
    &.active {
      color: $primary;
      border-bottom: 1px solid $primary !important;
    }
    :focus {
      outline: none !important;
      box-shadow: none !important;
    }
  }
  &.dark-theme {
    border-top: 1.5px solid #777;
    border-bottom: 1px solid #777;

    .village-action-header-item {
      background-color: $dark;
      color: $white;
      border-left: 1px solid #777;
      border-right: 1px solid #777;

      &:first-child {
        border-left: none;
      }
      &:last-child {
        border-right: none;
      }
      &.active {
        border-bottom: 1px solid $primary-dark !important;
      }
    }
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
