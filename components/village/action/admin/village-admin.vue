<template>
  <div>
    <action-card
      title="管理メニュー"
      :id="id"
      :is-open="isOpen"
      :exists-footer="false"
    >
      <template v-slot:content>
        <div class="content has-text-left">
          <div v-if="adminSituation.available_kick" class="m-b-20">
            <p style="font-weight: 700; margin-bottom: 6px">強制退村</p>
            <b-field>
              <b-select v-model="participantId" expanded size="is-small">
                <option
                  v-for="participant in participants"
                  :value="participant.id"
                  :key="participant.id"
                >
                  {{ participant.chara.chara_name.full_name }}
                </option>
              </b-select>
              <p class="control">
                <button class="button is-danger is-small" @click="kickConfirm">
                  強制退村確認
                </button>
              </p>
            </b-field>
          </div>
          <b-table
            :data="adminSituation.participant_list"
            :mobile-cards="false"
          >
            <template slot-scope="props">
              <b-table-column field="name" label="キャラ名">
                {{ props.row.name }}
              </b-table-column>
              <b-table-column field="twitter" label="twitter">
                <a
                  v-if="props.row.twitter_user_name"
                  :href="`https://twitter.com/${props.row.twitter_user_name}`"
                  target="_blank"
                >
                  {{ props.row.nickname }}@{{ props.row.twitter_user_name }}
                </a>
                <p v-else>{{ props.row.nickname }}</p>
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
import villageUserSettings from '~/components/village/user-settings/village-user-settings'
import toast from '~/components/village/village-toast'
// type
import Village from '~/components/type/village'
import VillageParticipant from '~/components/type/village-participant'
import VillageAdminSituation from '~/components/type/village-admin-situation'
import SituationAsParticipant from '~/components/type/situation-as-participant'

@Component({
  components: { actionCard },
})
export default class VillageAdmin extends Vue {
  private participantId: number = this.participants[0].id
  private id: string = 'admin-aria-id'
  private isOpen: boolean =
    villageUserSettings.getActionWindow(this).open_map![this.id] == null
      ? true
      : villageUserSettings.getActionWindow(this).open_map![this.id]

  private get situation(): SituationAsParticipant {
    return this.$store.getters.getSituation!
  }

  private get adminSituation(): VillageAdminSituation {
    return this.situation.admin
  }

  private get village(): Village {
    return this.$store.getters.getVillage
  }

  private get participants(): VillageParticipant[] {
    return this.village.participant.member_list
  }

  private kickConfirm(): void {
    const self = this
    this.$buefy.dialog.confirm({
      title: '強制退村確認',
      message: '本当に強制退村させますか？',
      confirmText: '退村させる',
      type: 'is-danger',
      hasIcon: true,
      iconPack: 'fas',
      onConfirm: async () => {
        await self.kick()
        toast.info(self, '退村させました')
      },
      size: 'is-small',
      cancelText: 'キャンセル'
    })
  }

  private async kick(): Promise<void> {
    try {
      await this.$axios.$post(`/admin/village/${this.village.id}/kick`, {
        target_id: this.participantId
      })
      this.$emit('reload')
    } catch (error) {}
  }
}
</script>

<style lang="scss" scoped>
.dark-theme {
  .card {
    background-color: transparent;
    color: #eee;
  }
}
