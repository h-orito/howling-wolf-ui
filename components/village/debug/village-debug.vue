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
              :disabled="village.status.code !== 'PROLOGUE'"
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
                :disabled="village.status.code !== 'PROLOGUE'"
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
        </div>
      </template>
      <template v-slot:footer> </template>
    </action-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
// component
import actionCard from '~/components/village/action/action-card.vue'
// type
import DebugVillage from '~/components/type/debug-village'
import VillageParticipant from '~/components/type/village-participant'

@Component({
  components: { actionCard }
})
export default class Action extends Vue {
  @Prop({ type: Object })
  private village!: DebugVillage

  private participateCharaNum: number =
    this.participateMemberNumList.length !== 0
      ? this.participateMemberNumList[0]
      : 1

  private participantId: number = this.participantList[0].id

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

  private dummyLoginCharaName(participant: VillageParticipant): string {
    if (participant.skill == null) {
      return participant.chara.chara_name.name
    } else {
      return `${participant.chara.chara_name.name}: ${participant.skill.name}`
    }
  }

  private debugParticipate(): void {
    this.$emit('debug-participate', {
      num: this.participateCharaNum
    })
  }

  private dummyLogin(): void {
    this.$emit('dummy-login', {
      participantId: this.participantId
    })
  }

  private setNoSuddenlyDeath(): void {
    this.$emit('set-no-suddenly-death')
  }

  private changeDay(): void {
    this.$emit('debug-change-day')
  }
}
</script>
