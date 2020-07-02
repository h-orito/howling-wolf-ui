<template>
  <div v-if="isProduction">
    <script
      data-ad-client="ca-pub-0917187897820609"
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
    ></script>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class GoogleAds extends Vue {
  private get isProduction(): boolean {
    return (process.env as any).ENV === 'production'
  }
}
</script>

<style></style>
