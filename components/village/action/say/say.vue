<template>
  <action-card :title="'発言する'">
    <template v-slot:content>
      ほげ
    </template>
    <template v-slot:footer>
      <b-button @click="leave" type="is-primary" size="is-small">
        発言する
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
export default class Say extends Vue {
  @Prop({ type: Object })
  private situation!: SituationAsParticipant
}
</script>
