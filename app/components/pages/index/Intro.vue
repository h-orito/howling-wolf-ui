<template>
  <div class="menu-area">
    <div class="mb-12">
      <p class="spotlight-shadow text-xl md:text-2xl">
        HOWLING WOLFは<br />長期人狼が無料で遊べるサービスです
      </p>
    </div>
    <div class="grid gap-4 md:grid-cols-2">
      <PagesIndexSpotlightButton to="/about">
        <UiIconIcon name="book" class="mr-2" />
        <strong>このサイトは</strong>
      </PagesIndexSpotlightButton>
      <PagesIndexSpotlightButton to="/rule">
        <UiIconIcon name="book" class="mr-2" />
        <strong>ルール</strong>
      </PagesIndexSpotlightButton>
      <PagesIndexSpotlightButton to="/faq">
        <UiIconIcon name="circle-question" class="mr-2" />
        <strong>よくある質問</strong>
      </PagesIndexSpotlightButton>
      <PagesIndexSpotlightButton to="/release-note">
        <UiIconIcon name="wrench" class="mr-2" />
        <strong>更新情報</strong>
      </PagesIndexSpotlightButton>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.menu-area {
  background: linear-gradient(#0a0a1a 0%, #112 50%, #0a0a1a 100%);
  color: white;
  padding: 30px;
  margin-bottom: 50px;
}
</style>
