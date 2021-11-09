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
        <p class="modal-card-title has-text-left">村の情報</p>
      </header>
      <section class="modal-card-body has-text-left" v-if="village">
        <div class="content">
          <b-table
            :data="settings"
            ref="table"
            detailed
            :show-detail-icon="false"
            :mobile-cards="false"
          >
            <template slot-scope="props">
              <b-table-column field="name" label="設定">
                <template>
                  {{ props.row.name }}
                  <a v-if="props.row.description" @click="toggle(props.row)">
                    <b-icon
                      pack="fas"
                      icon="question-circle"
                      size="is-small"
                    ></b-icon>
                  </a>
                </template>
              </b-table-column>

              <b-table-column
                field="value"
                label=""
                v-html="props.row.value.replace(/\n/g, '<br />')"
              />
            </template>

            <template slot="detail" slot-scope="props">
              <p v-html="props.row.description.replace(/\n/g, '<br />')"></p>
            </template>
          </b-table>
        </div>
      </section>
      <footer
        class="modal-card-foot"
        style="justify-content: flex-end !important;"
      >
        <b-button type="is-secondary" size="is-small" @click="close">
          閉じる
        </b-button>
      </footer>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// component
// type
import Village from '~/components/type/village'
import VillageTime from '~/components/type/village-time'
import Chara from '~/components/type/chara'
import { VILLAGE_STATUS } from '~/components/const/consts'

interface Settings {
  name: string
  value: string
  description?: string | null
}

@Component({
  components: {}
})
export default class ModalVillageInfo extends Vue {
  @Prop({ type: String })
  private charachipName?: string | null

  @Prop({ type: Boolean })
  private isOpen!: boolean

  private get village(): Village | null {
    return this.$store.getters.getVillage
  }

  private get settings(): Settings[] {
    if (!this.village) return []
    const settings: Settings[] = []

    this.addCapacitySetting(settings)
    this.addTimeSetting(settings)
    this.addCharachipSetting(settings)
    this.addOrganizationSetting(settings)
    this.addRuleSetting(settings)
    this.addPasswordSetting(settings)

    return settings
  }

  private toggle(row: any): void {
    ;(this.$refs as any).table.toggleDetails(row)
  }

  private close(): void {
    this.$emit('close')
  }

  // 設定用
  private addCapacitySetting(settings: Settings[]): void {
    if (!this.village) return
    if (
      this.village.status.code === VILLAGE_STATUS.PROLOGUE ||
      this.village.status.code === VILLAGE_STATUS.CANCEL
    ) {
      const capacity = this.village.setting.capacity
      settings.push({
        name: '最低人数',
        value: `${capacity.min}人`,
        description:
          '開始予定日時時点でこの人数が集まると進行中に遷移します（集まらなければ廃村となります）。\nダミーを含む人数です。'
      })
      settings.push({
        name: '最大人数',
        value: `${capacity.max}人`,
        description:
          'この人数まで参加することができます。\nダミーを含む人数です。'
      })
    } else {
      settings.push({
        name: '人数',
        value: `${this.village!.participant.count}人`
      })
    }
  }

  private addTimeSetting(settings: Settings[]): void {
    if (!this.village) return
    const timeSetting = this.village.setting.time
    if (this.village.status.code === VILLAGE_STATUS.PROLOGUE) {
      settings.push({
        name: '開始日時',
        value: timeSetting.start_datetime
      })
    }
    settings.push({
      name: '更新間隔',
      value: this.interval(timeSetting.day_change_interval_seconds),
      description: '実際にこの時間が経過すると村の1日が進行します。'
    })
    settings.push({
      name: '発言可能時間',
      value: this.sayableTime(timeSetting),
      description:
        '進行中に通常発言が可能な時間です。\n24時間の場合はいつでも発言できます。\n通常発言以外（独り言や死者の呻き、人狼の囁き等）はいつでも発言できます。'
    })
  }

  private sayableTime(timeSetting: VillageTime): string {
    const silentHours = timeSetting.silent_hours
    if (!silentHours || silentHours === 0) return '24時間'
    const start = timeSetting.sayable_start.substring(0, 5)
    const end = timeSetting.sayable_end.substring(0, 5)
    const isNextday =
      parseInt(start.substring(0, 2)) > parseInt(end.substring(0, 2))
    return `${start} - ${isNextday ? '翌' : ''}${end}(${24 - silentHours}時間)`
  }

  private addCharachipSetting(settings: Settings[]): void {
    if (!this.village) return
    if (!this.charachipName) return
    settings.push({
      name: 'キャラチップ',
      value: this.charachipName
    })
    const self = this
    const dummyCharaName = this.village.participant.member_list.find(member => {
      return member.chara.id === self.village!.setting.charachip.dummy_chara_id
    })!.chara.chara_name.full_name
    settings.push({
      name: 'ダミーキャラ',
      value: dummyCharaName,
      description:
        '最初に人狼に襲撃されるキャラです。\n1日目の人狼の襲撃はこのキャラに固定されます。'
    })
  }

  private addOrganizationSetting(settings: Settings[]): void {
    if (!this.village) return
    if (
      this.village.status.code === VILLAGE_STATUS.PROLOGUE ||
      this.village.status.code === VILLAGE_STATUS.CANCEL
    ) {
      const org = Object.entries(
        this.village.setting.organizations.organization
      )
        .map(entry => `${entry[0]}人: ${entry[1]}`)
        .join('\n')
      settings.push({
        name: '編成',
        value: org,
        description:
          '人数に応じた配役です。役職詳細は仕様ページを参照ください。'
      })
    } else {
      const org: string = this.village.setting.organizations.organization[
        this.village.participant.count
      ]
      settings.push({
        name: '編成',
        value: org,
        description: 'この村の配役です。役職詳細は仕様ページを参照ください。'
      })
    }
  }

  private addRuleSetting(settings: Settings[]): void {
    if (!this.village) return
    const rules = this.village.setting.rules
    // 投票
    settings.push({
      name: '投票',
      value: rules.open_vote ? '記名投票' : '無記名投票',
      description:
        '「記名投票」の場合、処刑の投票結果について、誰が誰に投票したかがわかります。\n「無記名投票」の場合、誰に何票入ったかのみがわかります。\n自動生成村の場合、常に「無記名投票」となります。'
    })
    // 役職希望
    settings.push({
      name: '役職希望',
      value: rules.available_skill_request ? '有効' : '無効',
      description:
        '「有効」の場合、割り当てられる役職の希望を出すことができます（自分以外の希望は見られません）。\n他に誰も希望していなかった場合はその役職が割り当てられます。'
    })
    // 見学
    settings.push({
      name: '見学',
      value: rules.available_spectate ? '可能' : '不可',
      description:
        '「可能」の場合、見学者として参加できます。\n見学者は死亡した人とのみ会話することができます（プロローグとエピローグでは全員と会話できます）。\n自動生成村の場合、常に「不可」となります。'
    })
    // 墓下役職公開
    settings.push({
      name: '墓下役職公開',
      value: rules.open_skill_in_grave ? '公開' : '非公開',
      description:
        '「公開」の場合、死亡した人と見学者は全員の役職を知ることができます。\n自動生成村の場合、常に「非公開」となります。'
    })
    // 墓下会話オープン
    settings.push({
      name: '墓下会話公開',
      value: rules.visible_grave_message ? '公開' : '非公開',
      description:
        '「公開」の場合、生存している参加者が死者の呻きと見学者の発言を見られるようになります。\n自動生成村の場合、常に「非公開」となります。'
    })
    // 突然死
    settings.push({
      name: '突然死',
      value: rules.available_suddenly_death ? 'あり' : 'なし',
      description:
        '「あり」の場合、日付更新のタイミングで、前日に一度も通常発言をしなかった生存者が突然死します。'
    })
    // 時短希望
    settings.push({
      name: '時短希望',
      value: rules.available_commit ? 'あり' : 'なし',
      description:
        '「あり」の場合、生存者全員が時短を希望すると、日付が更新されます。\n時短により余った時間は翌日に繰り越されます。\n自動生成村の場合、常に「あり」となります。'
    })
    // 発言制限
    const restricts = rules.message_restrict.restrict_list
      .map(restrict => {
        return `${restrict.type.name}: 1発言ごとに${restrict.length}文字${restrict.line}行まで、1日に${restrict.count}回まで`
      })
      .join('\n')
    settings.push({
      name: '発言制限',
      value: restricts,
      description:
        '発言文字数や発言回数の制限です。\n記載がない発言種別は1発言ごとに200文字20行で、1日の回数は無制限となります。'
    })
    // ダミー役欠け
    settings.push({
      name: 'ダミー役欠け',
      value: rules.available_dummy_skill ? 'あり' : 'なし',
      description:
        '「あり」の場合、きぐるみ ピギーに村人以外の役職が割り当てられる可能性があります。\n「なし」の場合、必ず村人が割り当てられます。'
    })
    // 初心者村
    settings.push({
      name: '初心者村か',
      value: rules.for_beginner ? 'はい' : 'いいえ',
      description:
        '初心者村の場合、村建てから24時間経過するまでは1戦以上参加したことのある方の参加が制限されます。'
    })
  }

  private addPasswordSetting(settings: Settings[]): void {
    if (!this.village) return
    settings.push({
      name: '入村パスワード',
      value: this.village.setting.password.join_password_required
        ? 'あり'
        : 'なし',
      description:
        '「あり」の場合、参加する際にパスワード入力が必要になります。\n自動生成村の場合、常に「なし」となります。'
    })
  }

  private interval(seconds: number): string {
    let hms = ''
    const h = (seconds / 3600) | 0
    const m = ((seconds % 3600) / 60) | 0
    const s = seconds % 60

    if (h !== 0) hms += `${h}時間`
    if (m !== 0) hms += `${m}分`
    if (s !== 0) hms += `${s}秒`

    return hms
  }
}
</script>

<style lang="scss" scoped>
/** header, footerを隠さない */
.modal-card {
  max-height: calc(100vh - 6.5rem);
}
</style>
