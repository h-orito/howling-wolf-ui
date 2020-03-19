<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-5">プレイヤー戦績</h1>
      <p class="">
        未実装です。
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// components
// type

@Component({
  components: {},
  asyncData({ query }) {
    return { playerId: query.id }
  }
})
export default class extends Vue {
  /** head */
  private head() {
    return { title: ' | ユーザ戦績' }
  }

  /** data */
  private playerId: number = 0

  /** computed */

  /** created */
  private async created(): Promise<any> {}

  /** methods */
}
</script>

<style lang="scss"></style>
