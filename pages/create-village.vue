<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-5">村を作成</h1>
      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">村名</label>
            <div class="control has-icons-left has-icons-right">
              <input
                v-model="villageName"
                @keyup="validateVillageName"
                :class="
                  !hasRoomName
                    ? ''
                    : hasRoomNameError
                    ? 'is-danger'
                    : 'is-success'
                "
                class="input"
                type="text"
                placeholder="村名"
              />
              <span class="icon is-small is-left">
                <i class="fas fa-comments"></i>
              </span>
              <span v-if="hasVillageName" class="icon is-small is-right">
                <i
                  v-if="hasVillageNameError"
                  class="fas fa-exclamation-triangle"
                ></i>
                <i v-if="!hasVillageNameError" class="fas fa-check"></i>
              </span>
            </div>
            <p v-if="hasRoomName" class="help is-danger">
              {{ villageNameError }}
            </p>
          </div>
          <!-- <div class="field">
            <label class="label">自分のニックネーム</label>
            <div class="control has-icons-left has-icons-right">
              <input
                :class="
                  !hasPlayerName
                    ? ''
                    : hasPlayerNameError
                    ? 'is-danger'
                    : 'is-success'
                "
                class="input"
                type="text"
                v-model="playerName"
                placeholder="ニックネーム"
                @keyup="validatePlayerName"
              />
              <span class="icon is-small is-left">
                <i class="fas fa-user-circle"></i>
              </span>
              <span v-if="hasPlayerName" class="icon is-small is-right">
                <i
                  v-if="hasPlayerNameError"
                  class="fas fa-exclamation-triangle"
                ></i>
                <i v-if="!hasPlayerNameError" class="fas fa-check"></i>
              </span>
            </div>
            <p v-if="hasPlayerName" class="help is-danger">
              {{ this.playerNameError }}
            </p>
          </div>
          <div class="field">
            <label class="label">部屋パスワード（任意）</label>
            <div class="control has-icons-left has-icons-right">
              <input
                :class="
                  !hasRoomPassword
                    ? ''
                    : hasRoomPasswordError
                    ? 'is-danger'
                    : 'is-success'
                "
                class="input"
                type="text"
                v-model="roomPassword"
                placeholder="パスワード"
                @keyup="validateRoomPassword"
              />
              <span class="icon is-small is-left">
                <i class="fas fa-key"></i>
              </span>
              <span v-if="hasRoomPassword" class="icon is-small is-right">
                <i
                  v-if="hasRoomPasswordError"
                  class="fas fa-exclamation-triangle"
                ></i>
                <i v-if="!hasRoomPasswordError" class="fas fa-check"></i>
              </span>
            </div>
            <p v-if="hasRoomPassword" class="help is-danger">
              {{ this.roomPasswordError }}
            </p>
          </div>
          <div class="field">
            <label class="label">レーティング</label>
            <div class="control has-text-centered">
              <div class="select">
                <select v-model="roomRating" :disabled="!hasRoomPassword">
                  <option value="">全年齢</option>
                  <option value="R15">R15</option>
                  <option value="R18">R18</option>
                </select>
              </div>
            </div>
            <p v-if="hasRoomPassword" class="help is-danger">
              {{ this.roomPasswordError }}
            </p>
          </div> -->
          <div class="field" style="margin-top: 40px;">
            <div class="control has-text-centered">
              <button
                :disabled="!canSubmit || submitting"
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

  /** computed */
  private get hasRoomName(): boolean {
    return this.villageName != null && this.villageName !== ''
  }
  private get canSubmit(): boolean {
    return true // todo
  }

  /** created */
  async created() {}

  /** methods */
  private validateVillageName(): void {}
}
</script>
