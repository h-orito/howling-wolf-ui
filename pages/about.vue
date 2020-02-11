<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-5">このサイトは</h1>
      <p class="">
        開発中です。バグや未実装があっても優しく見守ってあげてください。
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// type

@Component({
  components: {}
})
export default class About extends Vue {
  /** head */
  private head() {
    return { title: ' | このサイトは' }
  }
}
</script>

<style lang="scss" scoped></style>
