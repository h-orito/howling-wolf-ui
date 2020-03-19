<template>
  <div class="content">
    <b-table
      :data="skills"
      ref="table"
      striped
      detailed
      narrowed
      searchable
      :show-detail-icon="false"
      :mobile-cards="false"
      id="skill-table"
    >
      <template slot-scope="props">
        <b-table-column field="name" label="役職">
          <template>
            <a v-if="props.row.description" @click="toggle(props.row)">
              {{ props.row.name }}
            </a>
          </template>
        </b-table-column>
        <b-table-column field="short_name" label="略称" width="40" centered>
          <template>
            {{ props.row.short_name }}
          </template>
        </b-table-column>
        <b-table-column field="camp" label="所属陣営" centered>
          <template>
            {{ props.row.camp }}
          </template>
        </b-table-column>
        <b-table-column field="ability" label="能力">
          <template>
            <span
              v-for="(ability, index) in props.row.abilities"
              :key="ability.name"
            >
              {{ index !== 0 ? ',' : '' }}
              <a :href="'#' + ability.link">{{ ability.name }}</a>
            </span>
          </template>
        </b-table-column>
        <b-table-column field="divine_result" label="占い結果">
          <template>
            {{ props.row.divine_result }}
          </template>
        </b-table-column>
        <b-table-column field="psychic_result" label="霊視結果">
          <template>
            {{ props.row.psychic_result }}
          </template>
        </b-table-column>
        <b-table-column field="sayable_message_types" label="発言可能" centered>
          <template>
            <span
              v-for="(messageType, index) in props.row.sayable_message_types"
              :key="messageType.name"
            >
              {{ index !== 0 ? ',' : '' }}
              {{ messageType.name }}
            </span>
          </template>
        </b-table-column>
        <b-table-column field="visible_message_types" label="可視" centered>
          <template>
            <span
              v-for="(messageType, index) in props.row.visible_message_types"
              :key="messageType.name"
            >
              {{ index !== 0 ? ',' : '' }}
              {{ messageType.name }}
            </span>
          </template>
        </b-table-column>
        <b-table-column field="count_camp" label="勝敗判定カウント" centered>
          <template>
            {{ props.row.count_camp }}
          </template>
        </b-table-column>
      </template>
      <template slot="detail" slot-scope="props">
        <p v-html="props.row.description.replace(/\n/g, '<br />')"></p>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Skill from '~/components/type/skill'
import Ability from '~/components/type/ability'
import MessageType from '~/components/type/message-type'

interface TableSkill {
  name: string
  short_name: string
  camp: string
  abilities: TableAbility[]
  divine_result: string
  psychic_result: string
  sayable_message_types: TableMessageType[]
  visible_message_types: TableMessageType[]
  count_camp: string
  description: string
}

interface TableAbility {
  name: string
  link: string
}

interface TableMessageType {
  name: string
  link: string
}

@Component({
  components: {}
})
export default class RuleSkill extends Vue {
  @Prop({ type: Array })
  private skillList!: Skill[]

  private get skills(): TableSkill[] {
    if (this.skillList.length === 0) return []
    return this.skillList.map((skill: Skill) => {
      return {
        name: skill.name,
        short_name: skill.short_name,
        camp: skill.win_judge_camp == null ? '-' : skill.win_judge_camp.name,
        abilities: skill.manual_ability_list.map((ability: Ability) => {
          return {
            name: ability.name,
            link: ability.code.toLowerCase()
          }
        }),
        divine_result: skill.divine_result_wolf ? '人狼' : '人狼でない',
        psychic_result: skill.psychic_result_wolf ? '人狼' : '人狼でない',
        sayable_message_types: skill.sayable_skill_message_type_list.map(
          (messageType: MessageType) => {
            return {
              name: messageType.name,
              link: messageType.code.toLowerCase()
            }
          }
        ),
        visible_message_types: skill.viewable_skill_message_type_list.map(
          (messageType: MessageType) => {
            return {
              name: messageType.name,
              link: messageType.code.toLowerCase()
            }
          }
        ),
        count_camp: skill.count_camp == null ? '-' : skill.count_camp.name,
        description: skill.description
      }
    })
  }

  private toggle(row: any): void {
    ;(this.$refs as any).table.toggleDetails(row)
  }
}
</script>

<style></style>
