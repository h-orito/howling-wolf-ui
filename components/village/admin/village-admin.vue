<template>
  <div>
    <hr />
    <action-card :title="'管理者メニュー'" :exists-footer="false">
      <template v-slot:content>
        <div class="content has-text-left">
          <b-table :data="situation.participant_list" :mobile-cards="false">
            <template slot-scope="props">
              <b-table-column field="name" label="キャラ名">
                {{ props.row.name }}
              </b-table-column>
              <b-table-column field="twitter" label="twitter">
                <a
                  :href="`https://twitter.com/${props.row.twitter_user_name}`"
                  target="_blank"
                >
                  {{ props.row.nickname }}@{{ props.row.twitter_user_name }}
                </a>
              </b-table-column>
              <b-table-column field="skill" label="役職">
                {{ props.row.skill_name }}
              </b-table-column>
            </template>

            <template slot="empty">
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <p>参加者がいません</p>
                </div>
              </section>
            </template>
          </b-table>
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
import VillageAdminSituation from '~/components/type/village-admin-situation'
const modalSay = () => import('~/components/village/action/say/modal-say.vue')

@Component({
  components: { actionCard }
})
export default class VillageAdmin extends Vue {
  @Prop({ type: Object })
  private situation!: VillageAdminSituation
}
</script>
