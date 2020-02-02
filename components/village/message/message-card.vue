<template>
  <div v-if="message != null" class="card">
    <message-say
      v-if="isSayType"
      :message="message"
      :is-progress="isProgress"
    />
    <message-public-system
      v-if="message.content.type.code === 'PUBLIC_SYSTEM'"
      :message="message"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Message from '~/components/type/message'
import messageSay from '~/components/village/message/message-say.vue'
import messagePublicSystem from '~/components/village/message/message-public-system.vue'
import messageText from '~/components/village/message/message-text.vue'

@Component({
  components: {
    messageText,
    messageSay,
    messagePublicSystem
  }
})
export default class MessageCard extends Vue {
  @Prop({ type: Object })
  private message!: Message

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
}
</script>
