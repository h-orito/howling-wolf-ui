<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title is-5">このサイトは</h1>
        <p class="">
          開発中です。バグや未実装があっても優しく見守ってあげてください。
        </p>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// component
import spotlight from '~/components/index/spotlight.vue'
// type

@Component({
  components: {
    spotlight
  }
})
export default class extends Vue {
  /** head */
  private head() {
    return { title: '' }
  }
}
</script>

<style lang="scss" scoped></style>
