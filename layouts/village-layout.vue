<template>
  <div class="site">
    <google-ads />
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
export default class VillageLayout extends Vue {}
</script>

<style lang="scss" scoped></style>
