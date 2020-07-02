import firebase from '~/plugins/firebase'

export default function() {
  // nuxt generateの不具合でscriptタグが重複してしまうため手動でheadに追加する
  // see https://github.com/nuxt-community/google-adsense-module/issues/16
  const element = document.getElementById('google-ads')
  if (element) return

  const script = document.createElement('script')
  script.setAttribute('id', 'google-ads')
  script.setAttribute('data-ad-client', 'ca-pub-0917187897820609')
  script.setAttribute(
    'src',
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
  )
  document.head.appendChild(script)
}
