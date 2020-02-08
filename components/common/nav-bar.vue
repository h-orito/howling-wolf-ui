<template>
  <b-navbar fixed-top type="is-dark-opacity">
    <template slot="brand">
      <b-navbar-item tag="nuxt-link" :to="{ path: '/' }">
        HOWLING WOLF
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item tag="nuxt-link" :to="{ path: 'about' }">
        このサイトは
      </b-navbar-item>
      <b-navbar-item tag="nuxt-link" :to="{ path: 'rule' }">
        ルール
      </b-navbar-item>
      <!-- <b-navbar-dropdown label="Info">
        <b-navbar-item  href="#">
          About
        </b-navbar-item>
        <b-navbar-item href="#">
          Contact
        </b-navbar-item>
      </b-navbar-dropdown> -->
    </template>

    <template slot="end">
      <b-navbar-item tag="div"></b-navbar-item>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class NavBar extends Vue {
  public get isLogin(): boolean {
    return this.$store.getters.isLogin
  }

  public get photoURL(): any {
    return this.$store.getters.getPhotoUrl
  }
}
</script>

<style lang="scss" scoped>
.navbar-item {
  /* 何かないとscssが効かないのでdummy */
}
</style>
