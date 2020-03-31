<template>
  <div>
    <b-button @click="confirmLeave" type="is-danger" size="is-small" expanded>
      退村する
    </b-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Village from '~/components/type/village'
import SituationAsParticipant from '~/components/type/situation-as-participant'

@Component({
  components: {}
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
        this.$buefy.toast.open({
          message: '退村しました。',
          type: 'is-info',
          position: 'is-top'
        })
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
