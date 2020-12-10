<template>
  <b-button
    tag="nuxt-link"
    :to="{ path: link }"
    :icon-pack="icon ? 'fas' : ''"
    :icon-left="icon ? icon : ''"
    type="is-white"
    outlined
    expanded
    class="spotlight-shadow"
  >
    <strong>{{ text }}</strong>
  </b-button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class ShadowButton extends Vue {
  @Prop({ type: String })
  private link!: string

  @Prop({ type: String })
  private text!: string

  @Prop({ type: String })
  private icon?: string
}
</script>
