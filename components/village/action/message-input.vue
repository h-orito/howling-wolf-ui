<template>
  <section>
    <b-input
      size="is-small"
      type="textarea"
      :value="value"
      @input="$emit('input', $event)"
    ></b-input>
    <p class="has-text-right">{{ counter }}</p>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Village from '~/components/type/village'
import VillageSaySituation from '~/components/type/village-say-situation'
import VillageSayRestrictSituation from '~/components/type/village-say-restrict-situation'

@Component({
  components: {}
})
export default class MessageInput extends Vue {
  @Prop({ type: String })
  private value!: string

  @Prop({ type: Object })
  private situation!: VillageSaySituation | null
}
</script>
