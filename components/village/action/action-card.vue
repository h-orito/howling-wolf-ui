<template>
  <div class="card action-card">
    <header class="card-header">
      <p class="action-card-header-title has-text-grey">
        {{ title }}
      </p>
    </header>
    <div v-if="existsContent" class="card-content action-card-content">
      <slot name="content" />
    </div>
    <footer v-if="existsFooter" class="card-footer">
      <div class="card-footer-item action-card-footer-item">
        <slot name="footer" />
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class ActionCard extends Vue {
  @Prop({ type: String })
  private title!: string

  @Prop({ type: Boolean, default: true })
  private existsContent?: boolean

  @Prop({ type: Boolean, default: true })
  private existsFooter?: boolean
}
</script>

<style lang="scss">
.action-card {
  margin-bottom: 5px;
  // padding: 5px;

  .action-card-header-title {
    padding: 5px;
    font-weight: 700;
  }

  .action-card-content {
    text-align: left;
    padding: 10px;
  }
  .action-card-footer-item {
    padding: 5px;
    justify-content: flex-end !important;
  }
}
</style>
