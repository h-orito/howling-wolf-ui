<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-5">FAQ</h1>
      <p class="">
        まだ執筆していません
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// component
// type

@Component({
  components: {}
})
export default class Faq extends Vue {
  /** head */
  private head() {
    return { title: ' | FAQ' }
  }
}
</script>

<style lang="scss" scoped></style>
