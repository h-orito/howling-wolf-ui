<template>
  <action-card :title="`能力行使（${ability.type.name}）`">
    <template v-slot:content>
      <div class="content has-text-left">
        <p style="font-weight: 700; margin-bottom: 6px;">対象</p>
        <b-field>
          <b-select
            v-model="participantId"
            :disable="!ability.usable || ability.target_list.length === 0"
            expanded
            size="is-small"
          >
            <option
              v-for="participant in ability.target_list"
              :value="participant.id.toString()"
              :key="participant.id.toString()"
              >{{ participant.chara.chara_name.name }}</option
            >
          </b-select>
        </b-field>
      </div>
    </template>
    <template v-slot:footer>
      <b-button
        :disabled="!canSubmit || submitting"
        @click="setAbility"
        type="is-primary"
        size="is-small"
        >セットする</b-button
      >
    </template>
  </action-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
// components
import actionCard from '~/components/village/action/action-card.vue'
// type
import VillageAbilitySituation from '~/components/type/village-ability-situation'

@Component({
  components: { actionCard }
})
export default class Ability extends Vue {
  @Prop({ type: Object })
  private ability!: VillageAbilitySituation

  private submitting: boolean = false
  private participantId: number | null =
    this.ability.target == null ? null : this.ability.target.id

  private get canSubmit(): boolean {
    return this.ability.usable && this.ability.target_list.length !== 0
  }

  private async setAbility(): Promise<void> {
    this.submitting = true
    await this.$emit('set-ability', {
      targetId: this.participantId,
      abilityType: this.ability.type.code
    })
    this.submitting = false
  }
}
</script>
