<template>
  <b-notification
    :closable="false"
    aria-close-label="Close notification"
    class="is-size-7"
  >
    <ul class="content">
      <slot />
    </ul>
  </b-notification>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class Notification extends Vue {}
</script>

<style lang="scss">
ul.content {
  padding-left: 20px;
  li {
    list-style: disc;
  }
}
</style>
