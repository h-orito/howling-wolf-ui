<template>
  <b-navbar fixed-top type="is-dark-opacity">
    <template slot="brand">
      <b-navbar-item tag="nuxt-link" :to="{ path: '/' }">
        WOLFOREST
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item href="#">
        人狼ゲームとは
      </b-navbar-item>
      <b-navbar-item href="#">
        ルール
      </b-navbar-item>
      <!-- <b-navbar-dropdown label="Info">
        <b-navbar-item href="#">
          About
        </b-navbar-item>
        <b-navbar-item href="#">
          Contact
        </b-navbar-item>
      </b-navbar-dropdown> -->
    </template>

    <template slot="end">
      <b-navbar-item tag="div">
        <div class="buttons">
          <b-button
            type="is-primary"
            icon-pack="mdi"
            icon-left="twitter"
            outlined
          >
            <strong>Sign in</strong>
          </b-button>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.navbar-item {
  /* 何かないとscssが効かないのでdummy */
}
</style>
