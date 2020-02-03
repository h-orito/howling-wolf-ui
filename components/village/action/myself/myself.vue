<template>
  <action-card :title="'参加情報'" :exists-footer="false">
    <template v-slot:content>
      <div class="content has-text-left">
        <b-message size="is-small">
          <span style="white-space: pre-line;">{{ skillDescription }}</span>
        </b-message>
      </div>
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
export default class Participate extends Vue {
  @Prop({ type: Object })
  private situation!: SituationAsParticipant

  private get skillDescription(): string {
    return this.situation.participate.myself!.skill!.description.replace(
      '。',
      '。\n'
    )
  }
}
</script>
