<template>
  <div>
    <div class="menu-area">
      <div class="m-b-50">
        <p class="is-size-5 spotlight-shadow">
          キャラチップ一覧
        </p>
      </div>
      <div class="columns">
        <div class="column is-12">
          <shadow-button
            :link="'/charachip-list'"
            :text="'キャラチップ一覧'"
            :icon="'images'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
const shadowButton = () => import('~/components/index/shadow-button.vue')

@Component({
  components: { shadowButton }
})
export default class MenuCharachip extends Vue {}
</script>
