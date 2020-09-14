<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-5">予約村</h1>
      <div class="content is-size-7">
        <loading
          v-if="isLoadingReservedVillages"
          :message="'予約村を読み込み中...'"
        ></loading>
        <b-table
          v-if="reservedVillages"
          :data="reservedVillages.list"
          :loading="isLoadingReservedVillages"
          :mobile-cards="false"
        >
          <template slot-scope="props">
            <b-table-column label="作成日時">
              {{ props.row.village_create_datetime }}
            </b-table-column>

            <b-table-column label="開始日時">
              {{ props.row.village_start_datetime }}
            </b-table-column>

            <b-table-column label="編成">
              {{ props.row.organization }}
            </b-table-column>

            <b-table-column label="沈黙時間">
              {{ props.row.silent_hours }}
            </b-table-column>

            <b-table-column label="ダミー役欠け">
              {{ props.row.available_dummy_skill ? 'あり' : 'なし' }}
            </b-table-column>

            <b-table-column label="初心者村">
              {{ props.row.for_beginner ? 'はい' : 'いいえ' }}
            </b-table-column>

            <b-table-column label="削除">
              <b-button
                @click="deleteReservedVillage(props.row.id)"
                type="is-danger"
                size="is-small"
                >削除</b-button
              >
            </b-table-column>
          </template>

          <template slot="empty">
            <section class="section">
              <div class="content has-text-grey has-text-centered">
                <p>予約村がありません</p>
              </div>
            </section>
          </template>
        </b-table>
      </div>

      <h1 class="title is-5 m-t-40">村を作成</h1>
      <div class="columns">
        <div class="column">
          <b-field label="作成日時">
            <b-input
              v-model="createDatetime"
              type="text"
              size="is-small"
              placeholder="作成日時"
            />
          </b-field>
          <b-field label="開始日時">
            <b-input
              v-model="startDatetime"
              type="text"
              size="is-small"
              placeholder="開始日時"
            />
          </b-field>
          <b-field label="編成">
            <b-input
              v-model="organization"
              type="text"
              size="is-small"
              placeholder="構成"
            />
          </b-field>
          <b-field label="沈黙時間">
            <b-input
              v-model="silentHours"
              type="number"
              size="is-small"
              placeholder="0"
            />
          </b-field>
          <b-field label="ダミー役欠け">
            <b-switch v-model="isAvailableDummySkill" />
          </b-field>
          <b-field label="初心者村">
            <b-switch v-model="isForBeginner" />
          </b-field>
          <b-field class="m-t-40">
            <b-button
              :disabled="submitting"
              @click="createVillage"
              type="is-primary"
              >村を作成</b-button
            >
          </b-field>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// component
import loading from '~/components/loading.vue'
// type
import ReservedVillages from '~/components/type/reserved-villages'

@Component({
  components: {}
})
export default class extends Vue {
  /** head */
  private head() {
    return { title: ' | 村作成' }
  }

  /** data */
  private reservedVillages: ReservedVillages | null = null
  private isLoadingReservedVillages: boolean = false

  private organization: string = '村村村村村村村村村占霊狩狼狼狼狂'
  private createDatetime: string = this.defaultStartDatetime()
  private startDatetime: string = this.defaultStartDatetime()
  private silentHours: number = 0
  private isAvailableDummySkill: boolean = false
  private isForBeginner: boolean = false
  private submitting: boolean = false

  /** computed */

  /** created */
  private created() {
    this.loadReservedVillages()
  }

  /** methods */
  private async loadReservedVillages(): Promise<void> {
    this.isLoadingReservedVillages = true
    this.reservedVillages = await this.$axios.$get('/reserved-village/list')
    this.isLoadingReservedVillages = false
  }

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
      .$post('/reserved-village', {
        organization: this.organization,
        create_datetime: this.formatDateTime(new Date(this.createDatetime)),
        start_datetime: this.formatDateTime(new Date(this.startDatetime)),
        silent_hours: this.silentHours,
        available_dummy_skill: this.isAvailableDummySkill,
        for_beginner: this.isForBeginner
      })
      .catch(err => {
        console.log(err)
      })
    this.submitting = false

    this.loadReservedVillages()
  }

  private async deleteReservedVillage(id: number): Promise<any> {
    await this.$axios.$delete(`/reserved-village/${id}`).catch(err => {
      console.log(err)
    })
    this.loadReservedVillages()
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
