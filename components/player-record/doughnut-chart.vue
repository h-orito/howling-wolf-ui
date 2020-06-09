<script lang="ts">
import { Component, Vue, Prop, Watch, mixins } from 'nuxt-property-decorator'
import Chart from 'chart.js'
import { Doughnut, mixins as VueChartMixins } from 'vue-chartjs'
const reactiveProp = VueChartMixins.reactiveProp

@Component
export default class DoughnutChart extends mixins(Doughnut, reactiveProp) {
  @Prop({ default: {} })
  chartData: Chart.ChartData

  @Prop({ default: {} })
  options: Chart.ChartOptions

  @Prop()
  text?: string

  mounted() {
    if (this.text) {
      const text = this.text
      this.addPlugin({
        afterDraw(chart, go) {
          const ctx = chart.ctx
          // 中央にテキスト表示
          const fontSize = 14
          const fontStyle = 'normal'
          const fontFamily = 'Helvetica Neue'
          ctx.fillStyle = '#000'
          ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily)

          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'

          // position(第二, 第三引数は適宜調整)
          ctx.fillText(text!, chart.width / 2, chart.height / 2)
        }
      })
    }
    this.renderChart(this.chartData, this.options)
  }
}
</script>

<style lang="scss" scoped></style>
