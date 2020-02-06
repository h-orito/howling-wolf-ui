<template>
  <div>
    <spotlight />
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
