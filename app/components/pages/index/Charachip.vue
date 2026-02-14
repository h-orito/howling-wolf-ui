<template>
  <div class="menu-area">
    <div class="mb-12">
      <p class="spotlight-shadow text-2xl">キャラチップ一覧</p>
    </div>
    <div class="grid grid-cols-1">
      <PagesIndexSpotlightButton to="/charachip-list">
        <Icon name="image" class="mr-2" />
        <strong>キャラチップ一覧</strong>
      </PagesIndexSpotlightButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '~/components/ui/icon/Icon.vue'
</script>

<style scoped>
.menu-area {
  background: linear-gradient(#0a0a1a 0%, #112 50%, #0a0a1a 100%);
  color: white;
  padding: 30px;
  margin-bottom: 50px;
}
</style>
