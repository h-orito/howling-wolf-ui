<template>
  <div v-if="message != null" class="card">
    <message-say
      v-if="isSayType"
      :message="message"
      :is-progress="isProgress"
    />
    <message-system v-if="isSystemType" :village="village" :message="message" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import messageSay from '~/components/village/message/message-say.vue'
import messageSystem from '~/components/village/message/message-system.vue'
import messageText from '~/components/village/message/message-text.vue'
// type
import Village from '~/components/type/village'
import Message from '~/components/type/message'

@Component({
  components: {
    messageText,
    messageSay,
    messageSystem
  }
})
export default class MessageCard extends Vue {
  @Prop({ type: Object })
  private message!: Message

  @Prop({ type: Object })
  private village!: Village

  @Prop({ type: Boolean })
  private isProgress!: boolean

  private get isSayType(): boolean {
    return [
      'NORMAL_SAY',
      'WEREWOLF_SAY',
      'GRAVE_SAY',
      'MONOLOGUE_SAY',
      'MASON_SAY',
      'SPECTATE_SAY'
    ].some(type => this.message.content.type.code === type)
  }

  private get isSystemType(): boolean {
    return [
      'PUBLIC_SYSTEM',
      'PRIVATE_SYSTEM',
      'PRIVATE_SEER',
      'PRIVATE_PSYCHIC',
      'PRIVATE_WEREWOLF',
      'PARTICIPANTS'
    ].some(type => this.message.content.type.code === type)
  }
}
</script>
