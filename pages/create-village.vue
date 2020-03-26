<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-5">村を作成</h1>
      <div class="columns">
        <div class="column">
          <!-- 編成 -->
          <div class="field">
            <label class="label">編成</label>
            <div class="control">
              <input
                v-model="organization"
                class="input"
                type="text"
                placeholder="構成"
              />
            </div>
          </div>

          <div class="field">
            <label class="label">開始日時</label>
            <div class="control">
              <input v-model="startDatetime" class="input" type="text" />
            </div>
          </div>
          <div class="field m-t-40">
            <div class="control has-text-centered">
              <button
                :disabled="submitting"
                @click="createVillage"
                class="button is-primary"
              >
                村を作成
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class extends Vue {
  /** head */
  private head() {
    return { title: ' | 村作成' }
  }

  /** data */
  private organization: string = '村村村村村村村村村占霊狩狼狼狼狂'
  private startDatetime: string = this.defaultStartDatetime()
  private submitting: boolean = false

  /** computed */

  /** created */
  private created() {}

  /** methods */
  private defaultStartDatetime(): string {
    const defaultStartDatetime = new Date()
    // 4日後の0時
    defaultStartDatetime.setDate(defaultStartDatetime.getDate() + 4)
    defaultStartDatetime.setHours(9) // toISOString()でUTC時間にされてしまうので9時間足しておく
    defaultStartDatetime.setMinutes(0)
    defaultStartDatetime.setSeconds(0)
    defaultStartDatetime.setMilliseconds(0)
    return defaultStartDatetime.toISOString().replace('Z', '')
  }

  private async createVillage() {
    this.submitting = true
    const res = await this.$axios
      .$post('/auto-generated-village', {
        organization: this.organization,
        start_datetime: this.formatDateTime(new Date(this.startDatetime))
      })
      .catch(err => {
        console.log(err)
      })
    this.submitting = false
    location.href = `/village?id=${res.village_id}`
  }

  private formatDateTime(date: Date): string {
    return this.formatDateByFormat(date, 'yyyy-MM-ddTHH:mm:ss')
  }

  private formatDateByFormat(date: Date, formatString: string): string {
    let format = formatString
    format = format.replace(/yyyy/g, date.getFullYear().toString())
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
    format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2))
    format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2))
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
    format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3))
    return format
  }
}
</script>
