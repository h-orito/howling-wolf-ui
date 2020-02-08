<template>
  <div class="content has-text-left hw-message-text">
    <b-table :data="participants" :columns="participantsColumns"></b-table>
    <b-table :data="spectators" :columns="spectatosColumns"></b-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Village from '~/components/type/village'

@Component({
  components: {}
})
export default class ParticipantListMessage extends Vue {
  @Prop({ type: Object })
  private village!: Village

  private get participants(): any[] {
    return this.village.participant.member_list.map(member => ({
      chara_name: member.chara.chara_name.name,
      twitter: `${member.player!.nickname} <a href="https://twitter.com/${
        member.player!.twitter_user_name
      }" target="_blank">@${member.player!.twitter_user_name}</a>`,
      skill: member.skill!.name,
      health:
        member.dead == null
          ? '生存'
          : `${member.dead.village_day.day}日目に${member.dead.reason}死`
    }))
  }

  private get participantsColumns(): any[] {
    return [
      {
        field: 'chara_name',
        label: 'キャラクター'
        // width: '40',
      },
      {
        field: 'twitter',
        label: 'twitter',
        renderHtml: true
      },
      {
        field: 'skill',
        label: '役職'
      },
      {
        field: 'health',
        label: '生死'
      }
    ]
  }
}
</script>

<style lang="scss"></style>
