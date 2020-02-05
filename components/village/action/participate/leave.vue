<template>
  <action-card :title="'退村する'" :exists-content="false">
    <template v-slot:footer>
      <b-button @click="confirmLeave" type="is-danger" size="is-small">
        退村する
      </b-button>
    </template>
    <b-modal
      :active.sync="isLeaveModalActive"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">退村</p>
        </header>
        <section class="modal-card-body">
          <p>本当に退村しますか？</p>
        </section>
        <footer class="modal-card-foot">
          <b-button
            type="is-secondary"
            size="is-small"
            @click="$parent.close()"
          >
            やめる
          </b-button>
          <b-button type="is-danger" size="is-small" @click="leave"
            >退村する</b-button
          >
        </footer>
      </div>
    </b-modal>
  </action-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import actionCard from '~/components/village/action/action-card.vue'
import SituationAsParticipant from '~/components/type/situation-as-participant'

@Component({
  components: { actionCard }
})
export default class Leave extends Vue {
  @Prop({ type: Object })
  private situation!: SituationAsParticipant

  private isLeaveModalActive: boolean = false

  private confirmLeave(): void {
    this.$buefy.dialog.confirm({
      title: '退村確認',
      message: '本当に退村しますか？',
      confirmText: '退村する',
      type: 'is-danger',
      hasIcon: true,
      onConfirm: async () => {
        await this.$emit('leave')
        this.$buefy.toast.open('退村しました。')
      },
      size: 'is-small',
      cancelText: 'キャンセル'
    })
  }

  private leave(): void {
    this.$emit('leave')
  }
}
</script>
