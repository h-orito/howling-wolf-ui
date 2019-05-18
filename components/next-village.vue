<template>
  <div>
    <div v-if="nextVillage">
      <p class="content has-text-left">
        次に自動で作成される村は以下の設定になります。
      </p>
      <ul class="content has-text-left is-size-7" style="list-style: inside;">
        <li>村作成日時: {{ nextVillage.create_datetime }}</li>
        <li>村開始日時: {{ nextVillage.start_datetime }}</li>
        <li>
          閲覧可能時間: 毎日{{ nextVillage.viewable_start_datetime }}〜{{
            nextVillage.viewable_end_datetime
          }}
        </li>
        <li>
          発言可能時間: 毎日{{ nextVillage.sayable_start_datetime }}〜{{
            nextVillage.sayable_end_datetime
          }}
        </li>
        <li>
          人数: {{ nextVillage.person_min }}〜{{
            nextVillage.person_max
          }}人（開始日時に最低人数に満たない場合は自動解散）
        </li>
        <li>編成: {{ nextVillage.organization }}</li>
      </ul>
      <p class="content has-text-left">
        {{ nextVillage.create_datetime }}までに{{
          nextVillage.person_min - 1
        }}人の「開催希望」が集まれば村が作成されます。<br />
        現在、<span class="is-size-6 has-text-danger"
          >{{ nextVillage.participate_num }}人</span
        >が開催希望しています。
      </p>
      <button class="button is-primary">開催希望する</button>
      <p>
        <span class="is-size-7">
          （開始日時に最低人数に満たない場合は解散となるため、「開催されたら参加したい」という方のみ押下してください。）</span
        >
      </p>
    </div>
    <div v-if="!nextVillage">
      現在、自動で作成される村の予定はありません。
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {},
  props: {
    nextVillage: Object
  }
})
export default class VillageList extends Vue {
  /** data */
  /** head() */
  // private head() {
  //   return { title: 'タイトル' }
  // }
  /** computed */
  // public get hasVillage(): boolean {
  //   return this.villages && this.villages.length > 0
  // }
  /** methods() */
}
</script>
