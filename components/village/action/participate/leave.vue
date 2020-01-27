<template>
  <action-card :title="'退村する'" :existsContent="false">
    <template v-slot:footer>
      <b-button @click="leave" type="is-danger" size="is-small">
        退村する
      </b-button>
    </template>
  </action-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import actionCard from '~/components/village/action/action-card.vue'
import SituationAsParticipant from '~/components/type/situation-as-participant'

@Component({
  components: { actionCard }
})
export default class Leave extends Vue {
  @Prop({ type: Object })
  private situation!: SituationAsParticipant

  private leave(): void {}
}
</script>
