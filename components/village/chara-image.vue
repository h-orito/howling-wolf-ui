<template functional>
  <img
    :class="[data.class, data.staticClass]"
    :src="
      props.chara.face_list.find(face => face.type === props.faceType).image_url
    "
    :alt="props.chara.chara_name.name"
    :width="
      (props.chara.display.width * (props.isLarge ? 1.5 : 1)) /
        (props.isSmall ? 2 : 1)
    "
    :height="
      (props.chara.display.height * (props.isLarge ? 1.5 : 1)) /
        (props.isSmall ? 2 : 1)
    "
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

  @Prop({ type: Boolean, default: false })
  private isSmall?: boolean

  @Prop({ type: Boolean, default: false })
  private isLarge?: boolean
}
</script>

<style lang="scss" scoped>
img {
  border-radius: 5px;
  vertical-align: bottom;
}
</style>
