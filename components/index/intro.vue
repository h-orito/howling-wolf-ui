<template>
  <div class="menu-area">
    <div class="m-b-50">
      <p class="is-size-5-tablet is-size-6-mobile spotlight-shadow">
        HOWLING WOLFは<br />長期人狼が無料で遊べるサービスです
      </p>
    </div>
    <div class="columns">
      <div class="column is-6">
        <shadow-button :link="'/about'" :text="'このサイトは'" :icon="'book'" />
      </div>
      <div class="column is-6">
        <shadow-button :link="'/rule'" :text="'ルール'" :icon="'book'" />
      </div>
    </div>
    <div class="columns">
      <div class="column is-6">
        <shadow-button
          :link="'/faq'"
          :text="'よくある質問'"
          :icon="'question-circle'"
        />
      </div>
      <div class="column is-6">
        <shadow-button
          :link="'/release-note'"
          :text="'更新情報'"
          :icon="'wrench'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import shadowButton from '~/components/index/shadow-button.vue'

@Component({
  components: { shadowButton }
})
export default class Intro extends Vue {}
</script>
