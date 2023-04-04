<template>
  <b-modal
    :active="isOpen"
    has-modal-card
    trap-focus
    aria-role="dialog"
    aria-modal
    :on-cancel="close"
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title has-text-left">自己紹介編集</p>
      </header>
      <section class="modal-card-body has-text-left">
        <notification>
          <li>
            戦績サイトに登録されるIDは以下の優先度となります。
            <ul>
              <li>他人狼サイトのID</li>
              <li>Twitterアカウントのユーザー名</li>
              <li>ニックネーム</li>
            </ul>
          </li>
        </notification>
        <section>
          <p style="font-weight: 700; margin-bottom: 6px;">ニックネーム</p>
          <p class="is-size-7">エピローグで全員に公開されます。<br /></p>
          <b-field>
            <b-input v-model="nickname" size="is-small" />
          </b-field>
          <p class="has-text-danger is-size-7" v-if="!validNickname">
            50字以内で入力してください
          </p>
        </section>
        <section>
          <p style="font-weight: 700; margin-bottom: 6px;">他人狼サイトのID</p>
          <p class="is-size-7">
            エピローグまでにこのIDを入力しておくと、戦績サイトにこのIDで登録されます。
          </p>
          <b-field>
            <b-input v-model="otherSiteName" size="is-small" />
          </b-field>
          <p class="has-text-danger is-size-7" v-if="!validOtherSiteName">
            20字以内で入力してください
          </p>
        </section>
        <section class="m-t-20">
          <p style="font-weight: 700; margin-bottom: 6px;">自己紹介</p>
          <b-input
            size="is-small"
            type="textarea"
            :rows="15"
            v-model="intro"
          ></b-input>
          <p class="has-text-right" v-html="counter"></p>
        </section>
        <section class="m-t-20">
          <p style="font-weight: 700; margin-bottom: 6px;">ブラックリスト</p>
          <p class="is-size-7">
            ここでは削除のみ可能です。追加は対象に加えたい方の戦績ページより行ってください。
          </p>
          <b-table :data="blacklistPlayers" :mobile-cards="false">
            <template slot-scope="props">
              <b-table-column field="blacklist_target" label="対象">
                <nuxt-link
                  :to="{
                    path: '/player-record',
                    query: { id: props.row.id }
                  }"
                  target="_blank"
                  class="is-size-7"
                  >{{ props.row.twitter_user_name }}</nuxt-link
                >
              </b-table-column>

              <b-table-column field="delete" label="削除">
                <b-button
                  type="is-danger"
                  size="is-small"
                  @click="removeBlacklist(props.row.id)"
                >
                  削除
                </b-button>
              </b-table-column>
            </template>

            <template slot="empty">
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <p>ブラックリスト対象がいません</p>
                </div>
              </section>
            </template>
          </b-table>
        </section>
      </section>
      <footer
        class="modal-card-foot"
        style="justify-content: flex-end !important;"
      >
        <b-button type="is-secondary" size="is-small" @click="close">
          キャンセル
        </b-button>
        <b-button
          type="is-primary"
          size="is-small"
          @click="save"
          :disabled="!canSave"
          >保存する</b-button
        >
      </footer>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// component
// type
import Player from '~/components/type/player'
const notification = () => import('~/components/common/notification.vue')

@Component({
  components: { notification }
})
export default class ModalIntro extends Vue {
  // ----------------------------------------------------------------
  // prop
  // ----------------------------------------------------------------
  @Prop({ type: Boolean })
  private isOpen: boolean = false

  @Prop({ type: String })
  private currentNickname!: string

  @Prop({ type: String })
  private currentOtherSiteName!: string | null

  @Prop({ type: String })
  private currentIntro!: string | null

  @Prop({ type: Array })
  private blacklistPlayers!: Array<Player>

  // ----------------------------------------------------------------
  // data
  // ----------------------------------------------------------------
  private nickname: string = this.currentNickname
  private otherSiteName: string | null = this.currentOtherSiteName
  private intro: string | null = this.currentIntro

  // ----------------------------------------------------------------
  // computed
  // ----------------------------------------------------------------
  private get validNickname(): boolean {
    return this.nickname.length <= 50
  }

  private get validOtherSiteName(): boolean {
    return !this.otherSiteName || this.otherSiteName.length <= 20
  }

  private get canSave(): boolean {
    const validIntro: boolean = !this.intro || this.intro.length <= 2000
    return this.validNickname && this.validOtherSiteName && validIntro
  }

  private get counter(): string {
    const current = !this.intro ? 0 : this.intro.length
    if (current > 2000) {
      return `文字数: <span class="has-text-danger">${current.toString()}/2000}</span>`
    } else {
      return `文字数: ${current.toString()}/2000`
    }
  }

  // ----------------------------------------------------------------
  // method
  // ----------------------------------------------------------------
  private async save(): Promise<void> {
    await this.$axios.$post(`/player/detail`, {
      nickname: this.nickname,
      other_site_name: this.otherSiteName,
      introduction: this.intro
    })
    this.close()
    this.$emit('refresh')
  }

  private close(): void {
    this.$emit('close-modal')
  }

  private async removeBlacklist(id: number): Promise<void> {
    await this.$emit('remove-blacklist', {
      id
    })
  }
}
</script>
