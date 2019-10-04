<template>
  <nav class="navbar has-background-light m-b-20">
    <div class="navbar-brand">
      <nuxt-link class="navbar-item" to="/">
        <img src="~/static/titleicon.png" class="m-r-5" alt="汝は多忙なりや" />
        汝は多忙なりや
      </nuxt-link>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  // @ts-ignore
  components: {}
})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.navbar-item {
  /* 何かないとscssが効かないのでdummy */
}
</style>
