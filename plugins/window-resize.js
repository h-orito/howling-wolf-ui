import Vue from 'vue'

Vue.use({
  install(Vue) {
    const $window = Vue.observable({
      width: 0,
      height: 0,
      isMobile: true
    })
    let queue = null
    const wait = 100

    const getWindowSize = () => {
      clearTimeout(queue)

      queue = setTimeout(function() {
        const width = document.documentElement.clientWidth
        $window.width = width
        $window.height = document.documentElement.clientHeight
        $window.isMobile = width < 768
      }, wait)
    }

    global.addEventListener('resize', getWindowSize)
    getWindowSize()

    Vue.prototype.$window = $window
  }
})
