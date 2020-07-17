<template>
  <img
    :src="imageUrl"
    :alt="chara.chara_name.name"
    :width="chara.display.width"
    :height="chara.display.height"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Chara from '~/components/type/chara'

@Component({
  components: {}
})
export default class CharaSelectModal extends Vue {
  @Prop({ type: Object })
  private chara!: Chara

  @Prop({ type: String, default: 'NORMAL' })
  private faceType?: string

  private get imageUrl(): string {
    return this.chara.face_list.find(face => face.type === this.faceType)!
      .image_url
  }
}
</script>

<style lang="scss" scoped></style>
