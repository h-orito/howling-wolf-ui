<template>
  <p class="hw-message-text">
    <message-line
      v-for="messageLine in escapeAndSplitMessage(messageText)"
      :key="messageLine.id"
      :message-line="messageLine"
      @click-anchor="$emit('click-anchor', $event)"
    />
  </p>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// type
// component
const messageLine = () =>
  import('~/components/village/message/message-line.vue')

@Component({
  components: {
    messageLine
  }
})
export default class MessageText extends Vue {
  @Prop({ type: String })
  private messageText!: string

  // html escape and line separate
  private escapeAndSplitMessage = (message: string): string[] => {
    return message
      .replace(/(\r\n|\n|\r)/gm, '<br>')
      .split('<br>')
      .map(item => {
        item = item
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')
        return item
      })
  }
}
</script>
