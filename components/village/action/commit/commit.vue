<template>
  <action-card :title="'時短希望'">
    <template v-slot:content>
      ほげ
    </template>
    <template v-slot:footer>
      <b-button @click="commit" type="is-primary" size="is-small">
        時短希望する
      </b-button>
    </template>
  </action-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import actionCard from '~/components/village/action/action-card.vue'
import Village from '~/components/type/village'
import SituationAsParticipant from '~/components/type/situation-as-participant'

@Component({
  components: { actionCard }
})
export default class Vote extends Vue {
  @Prop({ type: Object })
  private village!: Village

  @Prop({ type: Object })
  private situation!: SituationAsParticipant

  private async commit(): Promise<void> {
    await this.$axios.$post(`/village/${this.village!.id}/commit`, {
      commit: !this.situation.commit.committing
    })
  }
}
</script>
