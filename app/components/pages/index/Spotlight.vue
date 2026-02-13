<template>
  <div class="relative bg-[#0a0a1a]">
    <img src="/image/top.jpg" alt="top_image" class="w-full" loading="eager" />
    <div class="absolute top-[50%] left-[2%] hidden text-left md:block">
      <p
        class="spotlight-intro spotlight-shadow text-4xl leading-[2em] text-white"
      >
        今日もまた<br />
        村に遠吠えが響き渡る
      </p>
    </div>
    <div class="absolute bottom-[2%] left-[2%] block text-left md:hidden">
      <p
        class="spotlight-intro spotlight-shadow text-lg leading-[2em] text-white"
      >
        今日もまた<br />
        村に遠吠えが響き渡る
      </p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.spotlight-shadow {
  text-shadow:
    2px 2px 5px rgba(97, 69, 69, 1),
    -2px 2px 5px rgba(97, 69, 69, 1),
    2px -2px 5px rgba(97, 69, 69, 1),
    -2px -2px 5px rgba(97, 69, 69, 1);
}

.spotlight-intro {
  font-family:
    '游明朝', YuMincho, 'Hiragino Mincho ProN W3', 'ヒラギノ明朝 ProN W3',
    'Hiragino Mincho ProN', 'HG明朝E', 'ＭＳ Ｐ明朝', 'ＭＳ 明朝', serif;
}
</style>
