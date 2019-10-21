<template>
  <div v-if="message != null" class="card">
    <message-normal
      v-if="message.content.type.code === 'NORMAL_SAY'"
      :message="message"
    />
    <div v-if="message.content.type.code != 'NORMAL_SAY'">
      <header v-if="message.from != null" class="card-header">
        <p class="card-header-title has-text-grey">
          {{ message.from.chara.chara_name.name }}
        </p>
      </header>
      <div class="card-content">
        <div class="content has-text-left">
          <p class="has-text-left is-size-7">{{ message.content.text }}</p>
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

@Component({
  components: {
    messageNormal
  }
})
export default class MessageCard extends Vue {
  @Prop({ type: Object })
  private message!: Message
}
</script>
