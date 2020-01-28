<template>
  <div v-if="message.content.type.code == 'PUBLIC_SYSTEM'">
    <div class="card-content p-t-10 p-b-10 m-b-5">
      <div class="content has-text-left">
        <message-text :message-text="message.content.text" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import messageText from '~/components/village/message/message-text.vue'
import Message from '~/components/type/message'

@Component({
  components: {
    messageText
  }
})
export default class MessageCard extends Vue {
  @Prop({ type: Object })
  private message!: Message
}
</script>
