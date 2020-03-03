<template>
  <section class="section">
    <div class="container has-text-left is-size-7">
      <h1 class="title is-5">共通ルール</h1>
      <div class="content">
        <ul>
          <li>
            同村しているプレイヤーの画面の向こうにはあなたと同様人間がいます。<br />他者を思いやり、迷惑をかけないプレイを心がけるようお願いします。
          </li>
          <li>
            正常な運営を妨げる行為がなされた場合、管理人の裁量によりアクセス禁止措置等が取られる可能性があります。
          </li>
        </ul>
      </div>
      <h1 class="title is-5">自動生成村のルール</h1>
      <div class="content">
        <ul>
          <li>
            参加如何に関わらず、エピローグを迎えていない村の情報を別の場所でやり取りしないでください。
          </li>
          <li>
            参加を促す目的でプロローグ中の村を宣伝することは許可します。ただし自身の参加有無は伏せてください。
          </li>
          <li>
            エピローグを迎えるまでは、自身が希望した役職について言及しないでください。
          </li>
        </ul>
      </div>
      <h2 class="title is-5">自動生成村の仕様</h2>
      <h3 class="title is-6">村生成</h3>
      <div class="content">
        <ul>
          <li>システムにより自動で村が作成される予定です。</li>
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
              <li>
                開始日時時点で最低開始人数以上の人数がいる場合、1日目に遷移します。
              </li>
              <li>
                開始日時までに最低開始人数が揃わなかった場合、廃村となります。
              </li>
              <li>24時間発言がない参加者は自動で村を去ります。</li>
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
      <h3 class="title is-6">発言</h3>
      <div class="content">
        <ul>
          <li>
            発言種別ごとに1日に発言できる回数と最大文字数が制限されます。
            <ul>
              <li>
                通常発言は1日に20回、1回に200文字まで
              </li>
              <li>人狼の囁きは1日に40回、1回に200文字まで</li>
              <li>死者の呻きは1日に40回、1回に200文字まで</li>
              <li>独り言は1日に100回、1回に200文字まで</li>
              <li>なお、プロローグ、エピローグは発言回数が制限されません。</li>
            </ul>
          </li>
          <li>
            発言中にアンカー文字列を含めると、クリックすることでその発言を表示することができるようになります。
            <ul>
              <li>&gt;&gt;1 通常発言へのアンカー</li>
              <li>&gt;&gt;*1 人狼の囁きへのアンカー</li>
              <li>&gt;&gt;+1 死者の呻きへのアンカー</li>
              <li>&gt;&gt;-1 独り言へのアンカー（エピローグ後のみ）</li>
              <li>
                いずれのアンカーも、自分が見られない発言はクリックしても発言が表示されません。
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <h3 class="title is-6">役職希望、割り当て</h3>
      <div class="content">
        <ul>
          <li>
            ダミーキャラ（きぐるみ ピギー）には必ず村人が割り当てられます。
          </li>
          <li>
            以下の順に役職が割り当てられます。
            <ul>
              <li>第1希望で役職を指定した人を割り当て</li>
              <li>第2希望で役職を指定した人を割り当て</li>
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
      <h3 class="title is-6">日付更新時の処理順</h3>
      <div class="content">
        <ol>
          <li>突然死</li>
          <li>処刑</li>
          <li>霊視</li>
          <li>占い</li>
          <li>護衛</li>
          <li>襲撃</li>
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
          <li>
            突然死者は以降の村に参加することができなくなります。
            <ul>
              <li>
                突然死した方は管理者まで直接ご連絡ください。会話させていただいたのち入村制限を解除します。
              </li>
              <li>
                連絡いただければ基本的に制限解除しますが、改善が見込めない場合など、解除しない場合があります。
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <h3 class="title is-6">役職</h3>
      <div class="content">
        <b-table
          :data="skills"
          ref="table"
          striped
          narrowed
          searchable
          :show-detail-icon="false"
          :mobile-cards="false"
          id="skill-table"
        >
          <template slot-scope="props">
            <b-table-column field="name" label="役職">
              <template>
                {{ props.row.name }}
              </template>
            </b-table-column>
            <b-table-column field="short_name" label="略称" width="40" centered>
              <template>
                {{ props.row.short_name }}
              </template>
            </b-table-column>
            <b-table-column field="camp" label="所属陣営" centered>
              <template>
                {{ props.row.camp }}
              </template>
            </b-table-column>
            <b-table-column field="ability" label="能力">
              <template>
                <span
                  v-for="(ability, index) in props.row.abilities"
                  :key="ability.name"
                >
                  {{ index !== 0 ? ',' : '' }}
                  <a :href="'#' + ability.link">{{ ability.name }}</a>
                </span>
              </template>
            </b-table-column>
            <b-table-column field="seer_result" label="占い結果">
              <template>
                {{ props.row.seer_result }}
              </template>
            </b-table-column>
            <b-table-column field="psychic_result" label="霊視結果">
              <template>
                {{ props.row.psychic_result }}
              </template>
            </b-table-column>
            <b-table-column field="visible_whisper" label="囁き可視" centered>
              <template>
                {{ props.row.visible_whisper }}
              </template>
            </b-table-column>
            <b-table-column
              field="count_camp"
              label="勝敗判定カウント"
              centered
            >
              <template>
                {{ props.row.count_camp }}
              </template>
            </b-table-column>
          </template>
        </b-table>
      </div>
      <h3 class="title is-6">能力</h3>
      <h4 class="is-7"><strong>全般</strong></h4>
      <div class="content">
        <ul>
          <li>
            日付更新時に、「日付更新時の処理順」の順に能力が行使されます。
          </li>
          <li>
            行使する前に死亡していた場合、能力は行使されません。
            <ul>
              <li>例：占い師が処刑された場合、占いは実行されません。</li>
              <li>
                ただし、襲撃については他の襲撃能力者が生存していれば行使されます。
              </li>
            </ul>
          </li>
          <li>
            対象を選択する能力の場合、日付更新時点でのセット先はランダムです。
          </li>
        </ul>
      </div>
      <h4 class="is-7"><strong>占い</strong></h4>
      <div class="content">
        <ul>
          <li>毎晩生存者1名を占い、人狼かそうでないかを知ることができます。</li>
          <li>対象が突然死、処刑された場合も知ることができます。</li>
          <li>
            妖狐など、占われると死亡する役職を占うと、対象を無惨な死体として死亡させることができます。
          </li>
        </ul>
      </div>
      <h4 class="is-7"><strong>霊視</strong></h4>
      <div class="content">
        <ul>
          <li>
            突然死、処刑された人が人狼かそうでないかを知ることができます。
          </li>
        </ul>
      </div>
      <h4 class="is-7"><strong>護衛</strong></h4>
      <div class="content">
        <ul>
          <li>
            初日以外の毎晩、自分以外の1名を人狼の襲撃から護衛することができます。
            （つまり、ダミーキャラの襲撃は防ぐことができません。）
          </li>
          <li>護衛が成功したか知ることはできません。</li>
        </ul>
      </div>
      <h4 class="is-7"><strong>襲撃</strong></h4>
      <div class="content">
        <ul>
          <li>毎晩1名を襲撃し、無惨な死体として死亡させられます。</li>
          <li>
            襲撃対象は襲撃能力者全員で連動しているので、誰かが変更すると自分の画面でも変わります。
          </li>
          <li>
            1日目はダミーキャラ（きぐるみ
            ピギー）しか襲撃対象として選択できません。
          </li>
          <li>2日目以降は襲撃しないこともできます。</li>
        </ul>
      </div>

      <h3 class="title is-6">陣営</h3>
      <div class="content">
        <ul>
          <li>陣営詳細を記載する予定です</li>
          <li>村人陣営</li>
          <li>人狼陣営</li>
          <li>...</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
// component
// type

interface Skill {
  name: string
  short_name: string
  camp: string
  abilities: Ability[]
  seer_result: string
  psychic_result: string
  visible_whisper: string
  count_camp: string
}

interface Ability {
  name: string
  link: string
}

@Component({
  components: {}
})
export default class extends Vue {
  /** head */
  private head() {
    return { title: ' | ルール' }
  }

  private get skills(): Skill[] {
    return [
      {
        name: '村人',
        short_name: '村',
        camp: '村人',
        abilities: [],
        seer_result: '人狼ではない',
        psychic_result: '人狼ではない',
        visible_whisper: '×',
        count_camp: '人間'
      },
      {
        name: '占い師',
        short_name: '占',
        camp: '村人',
        abilities: [
          {
            name: '占い',
            link: 'divine'
          }
        ],
        seer_result: '人狼ではない',
        psychic_result: '人狼ではない',
        visible_whisper: '×',
        count_camp: '人間'
      },
      {
        name: '霊能者',
        short_name: '霊',
        camp: '村人',
        abilities: [
          {
            name: '霊視',
            link: 'psychic'
          }
        ],
        seer_result: '人狼ではない',
        psychic_result: '人狼ではない',
        visible_whisper: '×',
        count_camp: '人間'
      },
      {
        name: '狩人',
        short_name: '狩',
        camp: '村人',
        abilities: [
          {
            name: '護衛',
            link: 'guard'
          }
        ],
        seer_result: '人狼ではない',
        psychic_result: '人狼ではない',
        visible_whisper: '×',
        count_camp: '人間'
      },
      {
        name: '人狼',
        short_name: '狼',
        camp: '人狼',
        abilities: [
          {
            name: '襲撃',
            link: 'attack'
          }
        ],
        seer_result: '人狼',
        psychic_result: '人狼',
        visible_whisper: '○',
        count_camp: '人狼'
      },
      {
        name: '狂人',
        short_name: '狂',
        camp: '人狼',
        abilities: [],
        seer_result: '人狼ではない',
        psychic_result: '人狼ではない',
        visible_whisper: '×',
        count_camp: '人間'
      }
    ]
  }
}
</script>

<style lang="scss">
.b-table {
  overflow: auto;
  white-space: nowrap;
}
</style>
