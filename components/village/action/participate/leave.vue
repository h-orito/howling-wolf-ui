<template>
  <action-card :title="'退村する'" :exists-content="false">
    <template v-slot:footer>
      <b-button @click="confirmLeave" type="is-danger" size="is-small">
        退村する
      </b-button>
    </template>
  </action-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import actionCard from '~/components/village/action/action-card.vue'
import Village from '~/components/type/village'
import SituationAsParticipant from '~/components/type/situation-as-participant'

@Component({
  components: { actionCard }
})
export default class Leave extends Vue {
  @Prop({ type: Object })
  private village!: Village

  @Prop({ type: Object })
  private situation!: SituationAsParticipant

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
        this.$buefy.toast.open('退村しました。')
      },
      size: 'is-small',
      cancelText: 'キャンセル'
    })
  }

  private async leave(): Promise<void> {
    try {
      await this.$axios.$post(`/village/${this.village!.id}/leave`, {})
      this.$emit('reload')
    } catch (error) {}
  }
}
</script>
