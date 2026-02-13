<template>
  <div class="menu-area">
    <div class="mb-12">
      <p class="spotlight-shadow text-2xl">その他情報</p>
    </div>
    <div class="grid gap-4 md:grid-cols-2">
      <PagesIndexSpotlightButton
        href="https://twitter.com/ort_dev"
        target="_blank"
      >
        <UiIconIcon name="twitter" class="mr-2" />
        <strong>要望、改善提案、不具合報告</strong>
      </PagesIndexSpotlightButton>
      <PagesIndexSpotlightButton @click="openKampaModal">
        <UiIconIcon name="gift" class="mr-2" />
        <strong>投げ銭</strong>
      </PagesIndexSpotlightButton>
      <PagesIndexSpotlightButton @click="openTermModal">
        <UiIconIcon name="book-open" class="mr-2" />
        <strong>利用規約</strong>
      </PagesIndexSpotlightButton>
      <PagesIndexSpotlightButton @click="openPolicyModal">
        <UiIconIcon name="book-open" class="mr-2" />
        <strong>プライバシーポリシー</strong>
      </PagesIndexSpotlightButton>
    </div>

    <!-- モーダル -->
    <LayoutKampaModal
      :open="isKampaModalOpen"
      @update:open="isKampaModalOpen = $event"
    />
    <LayoutTermModal
      :open="isTermModalOpen"
      @update:open="isTermModalOpen = $event"
    />
    <LayoutPolicyModal
      :open="isPolicyModalOpen"
      @update:open="isPolicyModalOpen = $event"
    />
  </div>
</template>

<script setup lang="ts">
const isKampaModalOpen = ref(false)
const isTermModalOpen = ref(false)
const isPolicyModalOpen = ref(false)

const openKampaModal = () => {
  isKampaModalOpen.value = true
}

const openTermModal = () => {
  isTermModalOpen.value = true
}

const openPolicyModal = () => {
  isPolicyModalOpen.value = true
}
</script>

<style scoped>
.menu-area {
  background: linear-gradient(#0a0a1a 0%, #112 50%, #0a0a1a 100%);
  color: white;
  padding: 30px;
  margin-bottom: 50px;
}

.menu-area:last-child {
  margin-bottom: 0;
}
</style>
