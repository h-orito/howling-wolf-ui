<template>
  <div class="intro-area">
    <div class="p-t-20 p-b-40">
      <div class="p-t-20 p-b-20">
        <p class="is-size-5-tablet is-size-6-mobile spotlight-shadow">
          HOWLING WOLFは<br />長期人狼が無料で遊べるサービスです
        </p>
      </div>
      <div class="m-l-20 m-r-20 columns">
        <div class="column is-6">
          <shadow-button
            :link="'/about'"
            :text="'このサイトは'"
            :icon="'book'"
          />
        </div>
        <div class="column is-6">
          <shadow-button :link="'/rule'" :text="'ルール'" :icon="'book'" />
        </div>
      </div>
      <div class="m-l-20 m-r-20 columns">
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

<style lang="scss" scoped>
.intro-area {
  background: linear-gradient(#0a0a1a 0%, #112 50%, #0a0a1a 100%);
  color: $white;
}
</style>
