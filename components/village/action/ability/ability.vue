<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title has-text-grey">能力行使</p>
    </header>
    <div class="card-content"></div>
    <footer class="card-footer">
      <div class="card-footer-item has-text-left"></div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import VillageAbilitySituation from '~/components/type/village-ability-situation'

@Component({
  components: {}
})
export default class Ability extends Vue {
  @Prop({ type: Object })
  private ability!: VillageAbilitySituation
}
</script>
