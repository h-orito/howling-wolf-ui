<template>
  <div>
    <action-card title="退村" :id="id" :is-open="isOpen" :exists-footer="false">
      <template v-slot:content>
        <div class="action-button-area">
          <b-button @click="confirmLeave" type="is-danger" size="is-small">
            退村する
          </b-button>
        </div>
      </template>
    </action-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import actionCard from '~/components/village/action/action-card.vue'
import api from '~/components/village/village-api'
import toast from '~/components/village/village-toast'
import villageUserSettings from '~/components/village/user-settings/village-user-settings'

@Component({
  components: { actionCard }
})
export default class Leave extends Vue {
  private id: string = 'leave-aria-id'
  private isOpen: boolean =
    villageUserSettings.getActionWindow(this).open_map![this.id] == null
      ? true
      : villageUserSettings.getActionWindow(this).open_map![this.id]

  private get villageId(): number {
    return this.$store.getters.getVillageId!
  }

  private confirmLeave(): void {
    const self = this
    this.$buefy.dialog.confirm({
      title: '退村確認',
      message: '本当に退村しますか？',
      confirmText: '退村する',
      type: 'is-danger',
      hasIcon: true,
      onConfirm: async () => {
        await self.leave()
        toast.info(self, '退村しました')
      },
      size: 'is-small',
      cancelText: 'キャンセル'
    })
  }

  private async leave(): Promise<void> {
    try {
      await api.postLeave(this, this.villageId)
      this.$emit('reload')
    } catch (error) {}
  }
}
</script>
