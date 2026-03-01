<template>
  <div />
</template>

<script setup lang="ts">
// Environment check
const isProduction = computed(() => {
  return process.env.NODE_ENV === 'production'
})

/**
 * Google Adsスクリプトを遅延読み込み
 */
const loadGoogleAds = () => {
  if (document.querySelector('script[data-ad-client]')) {
    return
  }

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
  script.setAttribute('data-ad-client', 'ca-pub-0917187897820609')
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
}

onMounted(() => {
  if (isProduction.value && import.meta.client) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(
        () => {
          loadGoogleAds()
        },
        { timeout: 3000 }
      )
    } else {
      setTimeout(loadGoogleAds, 2000)
    }
  }
})
</script>
