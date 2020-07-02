<template>
  <div class="site">
    <google-ads v-if="isProduction" />
    <div class="siteContent">
      <nuxt class="has-text-centered" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import googleAds from '~/components/common/nav/google-ads.vue'

@Component({
  components: { googleAds }
})
export default class VillageLayout extends Vue {
  private get isProduction(): boolean {
    return (process.env as any).ENV === 'production'
  }
}
</script>

<style lang="scss" scoped></style>
