<template>
  <div>
    <div class="content has-text-left">
      <p>現在のカミングアウト: {{ currentComingout }}</p>
      <p style="font-weight: 700; margin-bottom: 6px;">CO対象（2つまで）</p>
      <b-field>
        <b-select v-model="co1" expanded size="is-small">
          <option value="">COを取り消す</option>
          <option
            v-for="skill in selectableSkills"
            :value="skill.code"
            :key="skill.code"
            >{{ skill.name }}</option
          >
        </b-select>
        <b-button size="is-small" type="is-primary" @click="cancelFirst"
          >消す</b-button
        >
      </b-field>
      <b-field>
        <b-select
          v-model="co2"
          expanded
          size="is-small"
          :disabled="!co1 || co1 === ''"
        >
          <option
            v-for="skill in selectableSkills"
            :value="skill.code"
            :key="skill.code"
            >{{ skill.name }}</option
          >
        </b-select>
        <b-button
          size="is-small"
          type="is-primary"
          :disabled="!co1 || co1 === ''"
          @click="cancelSecond"
          >消す</b-button
        >
      </b-field>
    </div>
    <b-button
      :disabled="!canSubmit"
      @click="setComingout"
      type="is-primary"
      size="is-small"
      expanded
      >カミングアウトする</b-button
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// components
// type
import Village from '~/components/type/village'
import Chara from '~/components/type/chara'
import Skill from '~/components/type/skill'
import VillageComingOutSituation from '~/components/type/village-coming-out-situation'
import api from '~/components/village/village-api'
import toast from '~/components/village/village-toast'
@Component({
  components: {}
})
export default class Comingout extends Vue {
  @Prop({ type: Object })
  private village!: Village

  @Prop({ type: Object })
  private situation!: VillageComingOutSituation

  private submitting: boolean = false
  private co1: string | null = null
  private co2: string | null = null
  private get currentComingout(): string {
    const colist = this.situation.current_coming_outs.list
    if (colist.length === 0) return 'なし'
    return colist.map(co => co.skill.name).join('と')
  }

  private get canSubmit(): boolean {
    const colist: string[] = []
    if (!!this.co1 && this.co1 !== '') colist.push(this.co1)
    if (!!this.co2 && this.co2 !== '' && this.co1 !== this.co2)
      colist.push(this.co2)
    return !this.isSame(colist) && !this.submitting
  }

  private get selectableSkills(): Skill[] {
    return this.situation.selectable_skill_list
  }

  private cancelFirst(): void {
    this.co1 = this.co2
    this.co2 = ''
  }

  private cancelSecond(): void {
    this.co2 = ''
  }

  private reset(): void {
    const colist = this.situation.current_coming_outs.list
    if (colist.length > 0) {
      this.co1 = colist[0].skill.code
    }
    if (colist.length > 1) {
      this.co2 = colist[1].skill.code
    }
  }

  private setComingout(): void {
    const self = this
    const colist: string[] = []
    if (!!this.co1 && this.co1 !== '') {
      colist.push(this.co1)
      if (!!this.co2 && this.co2 !== '' && this.co1 !== this.co2) {
        colist.push(this.co2)
      }
    }

    this.$buefy.dialog.confirm({
      title: 'カミングアウト確認',
      message:
        colist.length > 0
          ? '本当にカミングアウトしますか？'
          : '本当にカミングアウトを取り消しますか？',
      confirmText:
        colist.length > 0 ? 'カミングアウトする' : 'カミングアウトを取り消す',
      type: 'is-primary',
      hasIcon: true,
      onConfirm: async () => {
        await self.comingout()
      },
      size: 'is-small',
      cancelText: 'キャンセル'
    })
  }

  private async comingout(): Promise<void> {
    this.submitting = true
    const colist: string[] = []
    if (!!this.co1 && this.co1 !== '') {
      colist.push(this.co1)
      if (!!this.co2 && this.co2 !== '' && this.co1 !== this.co2) {
        colist.push(this.co2)
      }
    }
    await api.postComingout(this, this.village!.id, colist)
    this.submitting = false
    if (colist.length > 0) {
      toast.success(this, 'カミングアウトしました')
    } else {
      toast.success(this, 'カミングアウトを取り消しました')
    }
    this.$emit('reload')
  }

  private isSame(colist: string[]): boolean {
    const currentList = this.situation.current_coming_outs.list
    if (colist.length !== currentList.length) return false
    return !colist.some(
      co => !currentList.some(current => current.skill.code === co)
    )
  }
}
</script>
