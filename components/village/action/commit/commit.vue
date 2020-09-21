<template>
  <b-button @click="commit" type="is-primary" size="is-small" expanded>
    時短希望する
  </b-button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Village from '~/components/type/village'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import api from '~/components/village/village-api'

@Component({
  components: {}
})
export default class Vote extends Vue {
  private get villageId(): number {
    return this.$store.getters.getVillageId!
  }

  private get situation(): SituationAsParticipant {
    return this.$store.getters.getSituation!
  }

  private async commit(): Promise<void> {
    await api.postCommit(
      this,
      this.villageId,
      !this.situation.commit.committing
    )
  }
}
</script>
