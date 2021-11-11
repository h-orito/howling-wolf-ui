<template>
  <section class="section">
    <div class="container has-text-left is-size-7">
      <h1 class="title is-5">ルール</h1>
      <div class="content">
        <ul>
          <li>
            同村しているプレイヤーの画面の向こうにはあなたと同様人間がいます。<br />他者を思いやり、迷惑をかけないプレイを心がけるようお願いします。
            <ul>
              <li>
                人狼は他者（キャラクター）を疑うゲームですが、プレイヤー自身を否定したり貶したりしないようご注意ください。
              </li>
            </ul>
          </li>
          <li>
            正常な運営を妨げる行為がなされた場合、管理人の裁量によりアクセス禁止措置等が取られる可能性があります。
          </li>
        </ul>
        <ul>
          <li>
            参加如何に関わらず、エピローグを迎えていない村の情報を別の場所でやり取りしないでください。
            <ul>
              <li>
                参加を促す目的でプロローグ中の村を宣伝することは許可します。ただし自身の参加有無は伏せてください。
              </li>
            </ul>
          </li>
          <li>
            エピローグを迎えるまでは、自身が希望した役職について言及しないでください。
          </li>
          <li>
            勝利を目指してください。
          </li>
          <li>
            エピローグを迎えるまでは、キャラクターを誰が演じているのか悟られないようにしてください。<br />
            また、他人について誰が演じているかわかったとしても、中身推理はしないでください。<br />
            例. 「この人は狼のときこういう発言はしないから狼ではない」
          </li>
        </ul>
      </div>
      <h2 class="title is-5">仕様</h2>
      <h3 class="title is-6">村生成</h3>
      <div class="content">
        <ul>
          <li>システムにより自動で村が作成されます。</li>
          <li>プレイヤーが村を作成することはできません。</li>
        </ul>
      </div>
      <h3 class="title is-6">流れ</h3>
      <div class="content">
        <ul>
          <li>
            プロローグ
            <ul>
              <li>プレイヤーはキャラクターを選んで村に参加できます。</li>
              <li>プレイヤーは開始2時間前まで退村することができます。</li>
              <li>
                開始日時時点で最低開始人数以上の人数がいる場合、1日目に遷移します。
              </li>
              <li>
                開始日時までに最低開始人数が揃わなかった場合、プロローグが1日ずつ延長されます。ただし、次の村が建っていた場合は廃村となります。
              </li>
              <li>
                24時間通常発言がない参加者は自動で村を去ります。（ただし開始2時間前以降は去りません）
              </li>
              <li>
                初心者村である場合、1戦以上参加したことのある方は、村建てから24時間経過するまで参加することができません。
              </li>
            </ul>
          </li>
          <li>
            1日目
            <ul>
              <li>役職が割り当てられます。</li>
              <li>投票および処刑はありません。</li>
              <li>
                人狼の襲撃対象はダミーキャラ（きぐるみ ピギー）固定になります。
              </li>
              <li>占い師は占い対象を選択することができます。</li>
              <li>狩人は能力行使できません。</li>
            </ul>
          </li>
          <li>
            2日目以降
            <ul>
              <li>処刑するための投票先を選択できるようになります。</li>
              <li>人狼が襲撃対象を選択できるようになります。</li>
              <li>狩人が護衛対象を選択できるようになります。</li>
              <li>
                日付更新時、いずれかの陣営の勝利条件に当てはまった場合はエピローグに遷移します。
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <h3 class="title is-6">発言</h3>
      <message />
      <h3 class="title is-6">役職希望、割り当て</h3>
      <div class="content">
        <ul>
          <li>
            ダミーキャラ（きぐるみ ピギー）の役職割り当てが最初に行われます。
            <ul>
              <li>
                村の設定でダミー役欠けが「あり」となっている場合、襲撃で死亡する役職のいずれかが割り当てられます。
                <ul>
                  <li>
                    例. 編成が「村村村村村村村村村占霊狩狼狼狼狂狐」の場合
                  </li>
                  <li>
                    村人が9/13、占い師、霊能者、狩人、狂人がそれぞれ1/13の確率で割り当てられます。
                  </li>
                  <li>
                    人狼は襲撃できないため割り当てられません。
                  </li>
                  <li>
                    妖狐は襲撃により死亡しないため割り当てられません。
                  </li>
                  <li>
                    猫又は襲撃者を道連れにしてしまうため割り当てられません。
                  </li>
                </ul>
              </li>
              <li>
                村の設定でダミー役欠けが「なし」となっている場合、必ず村人が割り当てられます。
              </li>
            </ul>
          </li>
          <li>
            ダミーキャラの割り当て後、以下の順に役職が割り当てられます。
            <ul>
              <li>第1希望で役職を指定した人を割り当て</li>
              <li>第1希望でおまかせ（XX陣営）を指定した人を割り当て</li>
              <li>第2希望で役職を指定した人を割り当て</li>
              <li>第2希望でおまかせ（XX陣営）を指定した人を割り当て</li>
              <li>
                ここまでで割り当てられなかった人とおまかせの人を割り当て
              </li>
            </ul>
          </li>
          <li>
            村の設定で役職希望が無効となっている場合、全員がおまかせ扱いになります。
          </li>
        </ul>
      </div>
      <h3 class="title is-6">時短希望（コミット）</h3>
      <div class="content">
        <ul>
          <li>
            進行中、生存者は時短希望ができます。
          </li>
          <li>
            ダミーキャラ以外の生存者全員が時短を希望すると、すぐに次の日に遷移します。
          </li>
          <li>
            時短により次の日に遷移した場合、次の日が長くなります。（通常の更新時間を迎えた場合と同じ時間になります）
          </li>
          <li>何人時短希望しているか知ることはできません。</li>
          <li>
            すぐに次の日に遷移して問題ないと本人が判断した場合、いつでも時短希望して構いません。
          </li>
          <li>
            決着を迎えていない村で時短希望について言及することは禁止します。
            <ul>
              <li>例えば、以下はすべてNGです。</li>
              <li>時短希望している/していないと言及すること</li>
              <li>時短希望する/しないことを促すこと</li>
              <li>
                時短希望により次の日に遷移した/しないこと自体を推理要素に含んで発言すること（独り言であれば構いません）
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <h3 class="title is-6">カミングアウト</h3>
      <div class="content">
        <ul>
          <li>
            進行中の通常発言ができる時間帯に生存者は役職カミングアウトをすることができます。
          </li>
          <li>
            カミングアウトすると、発言の名前の横と、参加者一覧の名前の横に役職カミングアウト内容が表示されます。
          </li>
          <li>
            表示上わかりやすくするための補助機能で、必ずカミングアウトしなければいけないわけではありません。
          </li>
          <li>
            このカミングアウトに自身の役職を主張する以外の目的をもたせること、またそれを促すことは禁止します。
            <ul>
              <li>
                例.
                「xxさんもう発言回数がないね。聞きたいことがあるんだけど、XXならYYをカミングアウト、そうでないならZZをカミングアウトして答えてくれない？」
              </li>
            </ul>
          </li>
          <li>カミングアウトは何回でも変更や取り下げが可能です。</li>
        </ul>
      </div>
      <h3 class="title is-6">ブラックリスト</h3>
      <div class="content">
        <ul>
          <li>
            5人までブラックリスト対象に設定することができます。
            <ul>
              <li>
                誰が誰をブラックリスト登録しているかは他の人からはわかりません。
              </li>
              <li>追加は対象の戦績ページから行うことができます。</li>
              <li>
                削除は対象の戦績ページか自分の戦績ページ（自己紹介編集）から行うことができます。
              </li>
            </ul>
          </li>
          <li>
            参加中のいずれかの人からブラックリスト対象にされている人は、その村に入村できなくなります。
          </li>
          <li>
            自分がブラックリスト対象にしている人がすでに入村していても自分は入村することができます。
            <ul>
              <li>
                ブラックリスト対象がすでに入村しているかはわかりません。
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <h3 class="title is-6">日付更新時の処理順</h3>
      <div class="content">
        <ol>
          <li>突然死</li>
          <li>処刑</li>
          <li>道連れ（処刑）</li>
          <li>霊視</li>
          <li>占い</li>
          <li>護衛</li>
          <li>襲撃</li>
          <li>道連れ（襲撃）</li>
          <li>背徳者の後追い</li>
          <li>勝敗判定</li>
        </ol>
      </div>
      <h3 class="title is-6">突然死</h3>
      <div class="content">
        <ul>
          <li>
            前日に一度も通常発言をしていなかった生存者は進行中の日付更新のタイミングで突然死します。
          </li>
          <li>突然死者の投票は無効票となり、集計されません。</li>
          <li>突然死者の能力は、人狼の襲撃以外は無効となります。</li>
          <li>突然死者はエピローグ以外で一切の発言ができなくなります。</li>
          <li>突然死者は自陣営が勝利していても敗北となります。</li>
          <li>
            突然死者は以降の村に参加することができなくなります。
            <ul>
              <li>
                突然死した方は管理者まで直接ご連絡ください。やむを得ない事情があったと判断した場合、入村制限を解除します。
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <h3 class="title is-6" id="vote">投票</h3>
      <div class="content">
        <ul>
          <li>
            2日目から投票による処刑が始まります。<br />（最初に処刑死者が出るのは3日目朝）
          </li>
          <li>日付更新時点では自分にセットされています。</li>
          <li>翌朝に集計され、最多票となった人が処刑されます。</li>
          <li>
            最多票者が複数いる場合はランダムで処刑される人が決まります。
          </li>
          <li>
            自動生成村では無記名投票となり、被得票数のみが公表されます。
          </li>
        </ul>
      </div>
      <h3 class="title is-6">役職</h3>
      <skill :skill-list="skillList" @scroll="scrollAbility($event)" />
      <h3 class="title is-6">能力</h3>
      <ability />
      <h3 class="title is-6">陣営、勝利条件</h3>
      <div class="content">
        <b-table
          :data="camps"
          ref="table"
          striped
          narrowed
          :show-detail-icon="false"
          :mobile-cards="false"
          id="camp-table"
        >
          <template slot-scope="props">
            <b-table-column field="name" label="陣営">
              <template>
                {{ props.row.name }}
              </template>
            </b-table-column>
            <b-table-column field="win_condition" label="勝利条件">
              <template>
                {{ props.row.win_condition }}
              </template>
            </b-table-column>
          </template>
        </b-table>
        <ul>
          <li>
            「人間」「人狼」どちらにカウントされるかは能力欄の「勝敗判定カウント」を参照してください。
            <ul>
              <li>
                「勝敗判定カウント」が「-」の場合はどちらにもカウントされません。
              </li>
            </ul>
          </li>
          <li>同時に条件を満たした場合、上にあるものが優先されます。</li>
        </ul>
      </div>
      <h3 class="title is-6">その他</h3>
      <div class="content">
        <ul>
          <li>
            発言時に「@国主」もしくは「＠国主」をつけて発言すると管理人に通知されます。対応が必要な際にご活用ください。
          </li>
          <li>Twitterでの連絡のほうが反応は早めです。</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// component
// type
import Skill from '~/components/type/skill'
import Skills from '~/components/type/skills'
const message = () => import('~/components/rule/message.vue')
const skill = () => import('~/components/rule/skill.vue')
const ability = () => import('~/components/rule/ability.vue')

interface Camp {
  name: string
  win_condition: string
}

@Component({
  components: { skill, ability, message }
})
export default class extends Vue {
  /** head */
  private head() {
    return { title: ' | ルール' }
  }

  /** data */
  private skillList: Skill[] = []

  /** computed */
  private get camps(): Camp[] {
    return [
      {
        name: '狐陣営',
        win_condition:
          '人狼陣営または村人陣営が勝利条件を満たした状態で妖狐が生存'
      },
      {
        name: '人狼陣営',
        win_condition:
          '夜明け時点で生存している「人狼」の数 ≧ 生存している「人間」の数'
      },
      {
        name: '村人陣営',
        win_condition: '夜明け時点で「人狼」が全員死亡'
      }
    ]
  }

  /** created */
  private async created(): Promise<void> {
    const skills: Skills = await this.$axios.$get('/skill/list')
    this.skillList = skills.list
  }

  /** method */
}
</script>

<style lang="scss" scoped>
.b-table {
  overflow: auto;
  white-space: nowrap;
}
</style>
