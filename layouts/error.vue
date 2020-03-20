<template>
  <div class="container">
    <img src="~/static/image/error.jpg" alt="error_image" width="100%" />
    <h1 v-if="error.statusCode === 404">ページが見つかりません</h1>
    <div v-else>
      <h1 class="h1">エラーが発生しました</h1>
      <p class="is-size-7 m-t-20 m-b-20 m-l-20 m-r-20">
        再読み込みすると改善することがあります。時間が経っても解決しない場合は管理者へお問い合わせください。
      </p>
    </div>

    <b-button
      tag="nuxt-link"
      :to="'/'"
      icon-pack="fas"
      icon-left="home"
      type="is-primary"
      size="is-small"
      >トップページへ</b-button
    >
    <b-button
      icon-pack="fas"
      icon-left="redo"
      type="is-primary"
      size="is-small"
      @click="reload"
      >再読み込み</b-button
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class Error extends Vue {
  @Prop({ type: Object })
  private error!: Object

  private created(): void {}

  private reload(): void {
    location.reload(true)
  }
}
</script>
