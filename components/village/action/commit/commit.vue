<template>
  <b-button @click="commit" type="is-primary" size="is-small" expanded>
    時短希望する
  </b-button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Village from '~/components/type/village'
import SituationAsParticipant from '~/components/type/situation-as-participant'

@Component({
  components: {}
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
