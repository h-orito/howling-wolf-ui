<template>
  <div v-if="message != null" class="card">
    <message-normal
      v-if="message.content.type.code === 'NORMAL_SAY'"
      :message="message"
    />
    <message-public-system
      v-if="message.content.type.code === 'PUBLIC_SYSTEM'"
      :message="message"
    />
    <div
      v-if="
        message.content.type.code != 'NORMAL_SAY' &&
          message.content.type.code != 'PUBLIC_SYSTEM'
      "
    >
      <header v-if="message.from != null" class="card-header">
        <p class="card-header-title has-text-grey">
          {{ message.from.chara.chara_name.name }}
        </p>
      </header>
      <div class="card-content">
        <div class="content has-text-left">
          <message-text :message-text="message.content.text" />
        </div>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item has-text-left">
          <p class="content has-text-left is-size-7">
            <b-tag rounded>{{ message.content.type.name }}</b-tag>
            {{ message.time.datetime }}
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Message from '~/components/type/message'
import messageNormal from '~/components/village/message/message-normal.vue'
import messagePublicSystem from '~/components/village/message/message-public-system.vue'
import messageText from '~/components/village/message/message-text.vue'

@Component({
  components: {
    messageText,
    messageNormal,
    messagePublicSystem
  }
})
export default class MessageCard extends Vue {
  @Prop({ type: Object })
  private message!: Message

  private get anchorString(): string {
    let prefix: string = ''
    switch (this.message.content.type.code) {
      case 'NORMAL_SAY':
        prefix = ''
        break
      case 'MONOLOGUE_SAY':
        prefix = '-'
        break
      case 'GRAVE_SAY':
        prefix = '+'
        break
      case 'WEREWOLF_SAY':
        prefix = '*'
        break
      case 'MASON_SAY':
        prefix = '='
        break
      case 'SPECTATE_SAY':
        prefix = '@'
        break
      case 'CREATOR_SAY':
        prefix = '#'
        break
      default:
        prefix = ''
    }
    return `>>${prefix}${this.message.content.num}`
  }
}
</script>
