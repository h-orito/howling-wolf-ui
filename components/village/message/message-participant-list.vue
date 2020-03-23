<template>
  <div class="content has-text-left hw-message-text">
    <b-table :data="participants">
      <template slot-scope="props">
        <b-table-column field="chara_name" label="キャラクター">
          {{ props.row.chara_name }}
        </b-table-column>

        <b-table-column field="twitter" label="Twitter">
          {{ props.row.nickname }}
          <a
            :href="`https://twitter.com/${props.row.twitter_user_name}`"
            target="_blank"
            >{{ props.row.twitter_user_name }}</a
          >
        </b-table-column>

        <b-table-column field="skill" label="役職">
          {{ props.row.skill }}
        </b-table-column>

        <b-table-column field="skill_request" label="役職希望">
          {{ props.row.skill_request }}
        </b-table-column>

        <b-table-column field="health" label="生死">
          {{ props.row.health }}
        </b-table-column>

        <b-table-column field="player_id" label="戦績">
          <b-button
            tag="nuxt-link"
            :to="{ path: '/player-record', query: { id: props.row.player_id } }"
            target="_blank"
            size="is-small"
            type="is-primary"
            >戦績</b-button
          >
        </b-table-column>
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>終了した村はありません</p>
          </div>
        </section>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Village from '~/components/type/village'
import SkillRequest from '~/components/type/skill-request'

@Component({
  components: {}
})
export default class ParticipantListMessage extends Vue {
  @Prop({ type: Object })
  private village!: Village

  private get participants(): any[] {
    return this.village.participant.member_list.map(member => ({
      chara_name: member.chara.chara_name.name,
      nickname: member.player!.nickname,
      twitter_user_name: member.player!.twitter_user_name,
      twitter: `${member.player!.nickname} <a href="https://twitter.com/${
        member.player!.twitter_user_name
      }" target="_blank">@${member.player!.twitter_user_name}</a>`,
      skill: member.skill!.name,
      skill_request: this.skillRequest(member.skill_request!),
      health:
        member.dead == null
          ? '生存'
          : `${member.dead.village_day.day}日目に${member.dead.reason}死`,
      player_id: member.player!.id
    }))
  }

  private skillRequest(request: SkillRequest): string {
    return `${request.first.name}/${request.second.name}`
  }
}
</script>

<style lang="scss" scoped>
.b-table td {
  vertical-align: middle !important;
}
</style>
