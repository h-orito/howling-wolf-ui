<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-5">更新情報</h1>
      <p class="">
        2020/02/10 開発中
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
export default class extends Vue {
  /** head */
  private head() {
    return { title: ' | 更新情報' }
  }
}
</script>

<style lang="scss" scoped></style>
