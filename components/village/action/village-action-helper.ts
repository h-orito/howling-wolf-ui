import SituationAsParticipant from '~/components/type/situation-as-participant'

export interface VillageAction {
  code: string
  name: string
  icon: string
}

const actionHelper = {
  getAvailableActions(situation: SituationAsParticipant): VillageAction[] {
    const actions: VillageAction[] = []
    if (this.isDispMyself(situation))
      actions.push({ code: 'myself', name: '参加', icon: 'user' })
    if (this.isDispSay(situation))
      actions.push({ code: 'say', name: '発言', icon: 'comment-dots' })
    if (this.isDispParticipate(situation))
      actions.push({ code: 'participate', name: '入村', icon: 'sign-in-alt' })
    if (this.isDispSpectate(situation))
      actions.push({ code: 'spectate', name: '見学', icon: 'sign-in-alt' })
    if (this.isDispSkillRequest(situation))
      actions.push({ code: 'skill_request', name: '役職希望', icon: 'star' })
    if (this.isDispLeave(situation))
      actions.push({ code: 'leave', name: '退村', icon: 'sign-out-alt' })
    if (this.isDispVote(situation))
      actions.push({ code: 'vote', name: '投票', icon: 'skull' })
    if (this.isDispComingout(situation))
      actions.push({ code: 'comingout', name: 'CO', icon: 'hand-paper' })
    situation.ability.list
      .filter(ab => ab.usable)
      .forEach(ability => {
        actions.push({
          code: ability.type.code,
          name: ability.type.name,
          icon: 'bolt'
        })
      })
    if (this.isDispCommit(situation))
      actions.push({ code: 'commit', name: '時短', icon: 'clock' })
    return actions
  },
  existsAction(situation: SituationAsParticipant): boolean {
    return this.getAvailableActions(situation).length > 0
  },
  isDispMyself(situation: SituationAsParticipant): boolean {
    return !!situation.participate.myself
  },
  isDispSay(situation: SituationAsParticipant): boolean {
    return situation.say.available_say
  },
  isDispParticipate(situation: SituationAsParticipant): boolean {
    return situation.participate.available_participate
  },
  isDispSpectate(situation: SituationAsParticipant): boolean {
    return situation.participate.available_spectate
  },
  isDispSkillRequest(situation: SituationAsParticipant): boolean {
    return (
      situation.participate.participating &&
      situation.skill_request.available_skill_request
    )
  },
  isDispLeave(situation: SituationAsParticipant): boolean {
    return situation.participate.available_leave
  },
  isDispVote(situation: SituationAsParticipant): boolean {
    return situation.vote.available_vote
  },
  isDispCommit(situation: SituationAsParticipant): boolean {
    return situation.commit.available_commit
  },
  isDispComingout(situation: SituationAsParticipant): boolean {
    return situation.coming_out.available_coming_out
  }
}

export default actionHelper
