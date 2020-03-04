<template>
  <div class="content">
    <b-table
      :data="skills"
      ref="table"
      striped
      narrowed
      searchable
      :show-detail-icon="false"
      :mobile-cards="false"
      id="skill-table"
    >
      <template slot-scope="props">
        <b-table-column field="name" label="役職">
          <template>
            {{ props.row.name }}
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
        <b-table-column field="seer_result" label="占い結果">
          <template>
            {{ props.row.seer_result }}
          </template>
        </b-table-column>
        <b-table-column field="psychic_result" label="霊視結果">
          <template>
            {{ props.row.psychic_result }}
          </template>
        </b-table-column>
        <b-table-column field="say_whisper" label="囁き発言" centered>
          <template>
            {{ props.row.say_whisper }}
          </template>
        </b-table-column>
        <b-table-column field="visible_whisper" label="囁き可視" centered>
          <template>
            {{ props.row.visible_whisper }}
          </template>
        </b-table-column>
        <b-table-column field="count_camp" label="勝敗判定カウント" centered>
          <template>
            {{ props.row.count_camp }}
          </template>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

interface Skill {
  name: string
  short_name: string
  camp: string
  abilities: Ability[]
  seer_result: string
  psychic_result: string
  say_whisper: string
  visible_whisper: string
  count_camp: string
}

interface Ability {
  name: string
  link: string
}

@Component({
  components: {}
})
export default class RuleSkill extends Vue {
  private get skills(): Skill[] {
    return [
      {
        name: '村人',
        short_name: '村',
        camp: '村人',
        abilities: [],
        seer_result: '人狼でない',
        psychic_result: '人狼でない',
        say_whisper: '×',
        visible_whisper: '×',
        count_camp: '人間'
      },
      {
        name: '占い師',
        short_name: '占',
        camp: '村人',
        abilities: [
          {
            name: '占い',
            link: 'divine'
          }
        ],
        seer_result: '人狼でない',
        psychic_result: '人狼でない',
        say_whisper: '×',
        visible_whisper: '×',
        count_camp: '人間'
      },
      {
        name: '霊能者',
        short_name: '霊',
        camp: '村人',
        abilities: [
          {
            name: '霊視',
            link: 'psychic'
          }
        ],
        seer_result: '人狼でない',
        psychic_result: '人狼でない',
        say_whisper: '×',
        visible_whisper: '×',
        count_camp: '人間'
      },
      {
        name: '狩人',
        short_name: '狩',
        camp: '村人',
        abilities: [
          {
            name: '護衛',
            link: 'guard'
          }
        ],
        seer_result: '人狼でない',
        psychic_result: '人狼でない',
        say_whisper: '×',
        visible_whisper: '×',
        count_camp: '人間'
      },
      {
        name: '人狼',
        short_name: '狼',
        camp: '人狼',
        abilities: [
          {
            name: '襲撃',
            link: 'attack'
          }
        ],
        seer_result: '人狼',
        psychic_result: '人狼',
        say_whisper: '○',
        visible_whisper: '○',
        count_camp: '人狼'
      },
      {
        name: '狂人',
        short_name: '狂',
        camp: '人狼',
        abilities: [],
        seer_result: '人狼でない',
        psychic_result: '人狼でない',
        say_whisper: '×',
        visible_whisper: '×',
        count_camp: '人間'
      }
    ]
  }
}
</script>

<style></style>
