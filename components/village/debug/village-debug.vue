<template>
  <div>
    <hr />
    <action-card :title="'デバッグメニュー'" :exists-footer="false">
      <template v-slot:content>
        <div class="content has-text-left">
          <p style="font-weight: 700; margin-bottom: 6px;">参加させる</p>
          <b-field>
            <b-select
              v-model="participateCharaNum"
              :disabled="!isPrologue"
              expanded
              size="is-small"
            >
              <option
                v-for="num in participateMemberNumList"
                :value="num"
                :key="num"
                >{{ `${num}人` }}</option
              >
            </b-select>
            <p class="control">
              <button
                :disabled="!isPrologue"
                class="button is-primary is-small"
                @click="debugParticipate"
              >
                参加させる
              </button>
            </p>
          </b-field>
          <p style="font-weight: 700; margin-bottom: 6px;">ダミーログイン</p>
          <b-field>
            <b-select v-model="participantId" expanded size="is-small">
              <option
                v-for="participant in participantList"
                :value="participant.id"
                :key="participant.id"
                >{{ dummyLoginCharaName(participant) }}</option
              >
            </b-select>
            <p class="control">
              <button class="button is-primary is-small" @click="dummyLogin">
                でログインする
              </button>
            </p>
          </b-field>
          <p style="font-weight: 700; margin-bottom: 6px;">突然死なしにする</p>
          <p class="control has-text-right">
            <button
              class="button is-primary is-small"
              @click="setNoSuddenlyDeath"
            >
              突然死なしにする
            </button>
          </p>
          <p style="font-weight: 700; margin-bottom: 6px;">日付を進める</p>
          <p class="control has-text-right">
            <button class="button is-primary is-small" @click="changeDay">
              日付を進める
            </button>
          </p>
          <p style="font-weight: 700; margin-bottom: 6px;">100回発言する</p>
          <p class="control has-text-right">
            <button class="button is-primary is-small" @click="sayMulti">
              100回発言する
            </button>
          </p>
        </div>
      </template>
      <template v-slot:footer> </template>
    </action-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// component
import actionCard from '~/components/village/action/action-card.vue'
// type
import DebugVillage from '~/components/type/debug-village'
import VillageParticipant from '~/components/type/village-participant'
import { VILLAGE_STATUS } from '~/components/const/consts'

@Component({
  components: { actionCard }
})
export default class Action extends Vue {
  // ----------------------------------------------------------------
  // props
  // ----------------------------------------------------------------
  @Prop({ type: Object })
  private village!: DebugVillage

  // ----------------------------------------------------------------
  // data
  // ----------------------------------------------------------------
  private participateCharaNum: number =
    this.participateMemberNumList.length !== 0
      ? this.participateMemberNumList[0]
      : 1

  private participantId: number = this.participantList[0].id

  // ----------------------------------------------------------------
  // computed
  // ----------------------------------------------------------------
  private get isPrologue(): boolean {
    return this.village.status.code === VILLAGE_STATUS.PROLOGUE
  }

  private get participateMemberNumList(): Array<number> {
    const min = this.village.setting.capacity.min - 1
    const max = this.village.setting.capacity.max - 1
    const list: number[] = []
    for (let i = min; i <= max; i++) {
      list.push(i)
    }
    return list
  }

  private get participantList(): Array<VillageParticipant> {
    return this.village.participant.member_list
  }

  // ----------------------------------------------------------------
  // methods
  // ----------------------------------------------------------------
  /** キャラ名と、開始後は役職名 */
  private dummyLoginCharaName(participant: VillageParticipant): string {
    if (participant.skill == null) {
      return participant.chara.chara_name.full_name
    } else {
      return `${participant.chara.chara_name.full_name}: ${participant.skill.name}`
    }
  }

  /** N名参加させる */
  private async debugParticipate(): Promise<void> {
    await this.$axios.$post(`/admin/village/${this.village!.id}/participate`, {
      participate_count: this.participateCharaNum
    })
    this.$emit('reload')
  }

  /** 選択したキャラでログインして表示 */
  private async dummyLogin(): Promise<void> {
    await this.$axios.$post(`/admin/village/${this.village!.id}/dummy-login`, {
      target_id: this.participantId
    })
    this.$emit('reload')
  }

  /** 村日付を進める */
  private async changeDay(): Promise<void> {
    await this.$axios.$post(`/admin/village/${this.village!.id}/change-day`)
    this.$emit('reload')
  }

  /** 突然死なしに変更 */
  private async setNoSuddenlyDeath(): Promise<void> {
    await this.$axios.$post(
      `/admin/village/${this.village!.id}/no-suddenly-death`
    )
    this.$emit('reload')
  }

  /** 突然死なしに変更 */
  private async sayMulti(): Promise<void> {
    await this.$axios.$post(`/admin/village/${this.village!.id}/multiple-say`)
    this.$emit('reload')
  }
}
</script>
