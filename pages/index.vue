<template>
  <section class="section">
    <div class="columns is-mobile">
      <card title="Free" icon="github-circle">
        Open source on
        <a href="https://github.com/buefy/buefy">GitHub</a>
      </card>

      <card title="Responsive" icon="cellphone-link">
        <b class="has-text-grey">Every</b> component is responsive
      </card>

      <card title="Modern" icon="alert-decagram">
        Built with
        <a href="https://vuejs.org/">Vue.js</a> and
        <a href="http://bulma.io/">Bulma</a>
      </card>

      <card title="Lightweight" icon="arrange-bring-to-front"
        >No other internal dependency {{ info }}</card
      >
    </div>
  </section>
</template>

<script>
import Card from '~/components/Card'
import axios from 'axios'

export default {
  name: 'HomePage',

  components: {
    Card
  },

  data() {
    return {
      info: 1
    }
  },

  async created() {
    const self = this
    await axios.get('http://localhost:8086/wolf4busy/').then(res => {
      self.info = res.data.hoge
    })
  }
}
</script>
