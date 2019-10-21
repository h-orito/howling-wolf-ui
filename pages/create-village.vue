<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-5">村を作成</h1>
      <div class="columns">
        <div class="column">
          <!-- 村名 -->
          <div class="field">
            <label class="label">村名</label>
            <div class="control">
              <input
                v-model="villageName"
                :class="villageNameError ? 'is-danger' : 'is-success'"
                class="input"
                type="text"
                placeholder="村名"
              />
            </div>
            <p v-if="villageNameError" class="help is-danger">
              {{ villageNameError }}
            </p>
          </div>

          <!-- 最低人数 -->
          <div class="field">
            <label class="label">最低人数</label>
            <div class="control">
              <input
                v-model="personNumMin"
                :class="personNumMinError ? 'is-danger' : 'is-success'"
                class="input"
                type="number"
                step="1"
                min="10"
                max="17"
              />
            </div>
            <p v-if="personNumMinError" class="help is-danger">
              {{ personNumMinError }}
            </p>
          </div>

          <!-- 最大人数 -->
          <div class="field">
            <label class="label">最大人数</label>
            <div class="control">
              <input
                v-model="personNumMax"
                :class="personNumMaxError ? 'is-danger' : 'is-success'"
                class="input"
                type="number"
                step="1"
                min="10"
                max="17"
              />
            </div>
            <p v-if="personNumMaxError" class="help is-danger">
              {{ personNumMaxError }}
            </p>
          </div>

          <!-- 昼時間 -->
          <div class="field">
            <label class="label">昼時間（秒）</label>
            <div class="control">
              <input
                v-model="noonSeconds"
                :class="noonSecondsError ? 'is-danger' : 'is-success'"
                class="input"
                type="number"
                step="30"
                min="180"
                max="86400"
              />
            </div>
            <p v-if="noonSecondsError" class="help is-danger">
              {{ noonSecondsError }}
            </p>
          </div>

          <!-- 夜時間 -->
          <div class="field">
            <label class="label">夜時間（秒）</label>
            <div class="control">
              <input
                v-model="nightSeconds"
                :class="nightSecondsError ? 'is-danger' : 'is-success'"
                class="input"
                type="number"
                step="30"
                min="0"
                max="600"
              />
            </div>
            <p v-if="nightSecondsError" class="help is-danger">
              {{ nightSecondsError }}
            </p>
          </div>

          <div class="field">
            <label class="label">開始日時</label>
            <div class="control">
              <datetime
                v-model="startDatetime"
                :minute-step="10"
                type="datetime"
                input-class="input"
                value-zone="Asia/Tokyo"
                zone="Asia/Tokyo"
                title="開始日時"
                format="yyyy/MM/dd HH:mm"
              ></datetime>
            </div>
            <p v-if="startDatetimeError" class="help is-danger">
              {{ startDatetimeError }}
            </p>
          </div>

          <div class="field" style="margin-top: 40px;">
            <div class="control has-text-centered">
              <button
                :disabled="submitting"
                @click="checkCreateVillage"
                class="button is-primary"
              >
                エラーチェック
              </button>
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
import { Component, Vue } from 'vue-property-decorator'
import axios from '@nuxtjs/axios'

@Component({
  components: {}
})
export default class extends Vue {
  /** head */
  private head() {
    return { title: '| 村を作成' }
  }

  /** data */
  private villageName: string = ''
  private villageNameError: string = ''
  private personNumMin: number = 10
  private personNumMinError: string = ''
  private personNumMax: number = 17
  private personNumMaxError: string = ''
  private noonSeconds: number = 86400
  private noonSecondsError: string = ''
  private nightSeconds: number = 0
  private nightSecondsError: string = ''
  private startDatetime: string = '2019-01-01T00:00:00.000Z'
  private startDatetimeError: string = ''
  private submitting: boolean = false // todo

  /** computed */
  // private get hasVillageNameError(): boolean {
  //   return this.villageNameError != null && this.villageNameError !== ''
  // }

  /** created */
  async created() {}

  /** methods */
  private checkCreateVillage(): void {
    this.$axios
      .$post('/village/confirm', {
        village_name: this.villageName,
        person_min_num: this.personNumMin,
        person_max_num: this.personNumMax,
        noon_seconds: this.noonSeconds,
        night_seconds: this.nightSeconds,
        start_datetime: formatDateTime(new Date(this.startDatetime))
      })
      .then(res => {
        Vue.prototype.$snackbar.open({
          duration: 5000,
          message: 'エラーなし',
          type: 'is-success',
          position: 'is-top-right',
          actionText: '',
          queue: false,
          onAction: () => {}
        })
      })
      .catch(err => {
        const code = parseInt(err.response && err.response.status)
        if (code !== 400) {
          return // validation error以外だったら何もしない
        }
        if (!err || !err.response || !err.response.data) {
          return // エラー内容なし
        }
        const errorFields = err!.response!.data!.errors.map(
          error => error.field
        )
        // エラー項目表示
        this.showErrorFields(errorFields)
      })
  }
  private async createVillage() {
    const res = await this.$axios
      .$post('/village', {
        village_name: this.villageName,
        person_min_num: this.personNumMin,
        person_max_num: this.personNumMax,
        noon_seconds: this.noonSeconds,
        night_seconds: this.nightSeconds,
        start_datetime: formatDateTime(new Date(this.startDatetime))
      })
      .catch(err => {
        const code = parseInt(err.response && err.response.status)
        if (code !== 400) {
          return // validation error以外だったら何もしない
        }
        if (!err || !err.response || !err.response.data) {
          return // エラー内容なし
        }
        const errorFields = err.response.data.errors.map(error => error.field)
        // エラー項目表示
        this.showErrorFields(errorFields)
      })
    location.href = `/long-village?id=${res.village_id}`
  }
  private showErrorFields(errorFields: Array<string>): void {
    if (errorFields.some(fieldName => fieldName === 'villageName')) {
      this.villageNameError = '村名は5文字以上40文字以内で入力してください'
    }
    if (errorFields.some(fieldName => fieldName === 'personMinNum')) {
      this.personNumMinError = '最低人数は10名以上17名以下で入力してください'
    }
    if (errorFields.some(fieldName => fieldName === 'personMaxNum')) {
      this.personNumMaxError =
        '最大人数は10名以上17名以下かつ最低人数以上で入力してください'
    }
    if (errorFields.some(fieldName => fieldName === 'noonSeconds')) {
      this.noonSecondsError = '昼時間は3分以上24時間以内で入力してください'
    }
    if (errorFields.some(fieldName => fieldName === 'nightSeconds')) {
      this.nightSecondsError = '夜時間は0秒以上10分以内で入力してください'
    }
  }
}

function formatDateTime(date) {
  return formatDateByFormat(date, 'yyyy-MM-ddTHH:mm:ss')
}

function formatDateByFormat(date, format) {
  format = format.replace(/yyyy/g, date.getFullYear())
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
  format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2))
  format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2))
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
  format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3))
  return format
}
</script>
