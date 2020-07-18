<template functional>
  <a
    @click="listeners.click"
    v-html="props.sentence.text"
    href="javascript:void(0);"
  ></a>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import MesParts from '~/components/village/message/message-parts'

// type
import { MESSAGE_TYPE } from '~/components/const/consts'

@Component({})
export default class MessageAnchor extends Vue {
  @Prop({ type: Object })
  private sentence!: MesParts
}
</script>
