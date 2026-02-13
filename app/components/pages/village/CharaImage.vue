<template>
  <img
    :src="charaImageUrl"
    :alt="chara.chara_name.name"
    :width="imageWidth"
    :height="imageHeight"
    class="rounded-md align-bottom"
    loading="lazy"
  />
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { CharaView, CharaFace } from '~/lib/api/types'

interface Props {
  chara: DeepReadonly<CharaView> | CharaView
  faceType?: string
  isSmall?: boolean
  isLarge?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  faceType: 'NORMAL',
  isSmall: false,
  isLarge: false
})

const charaImageUrl = computed(() => {
  const face = props.chara.face_list.find(
    (f: DeepReadonly<CharaFace> | CharaFace) => f.type === props.faceType
  )
  return face?.image_url ?? ''
})

const imageWidth = computed(() => {
  const baseWidth = props.chara.display.width
  const multiplier = props.isLarge ? 1.5 : 1
  const divider = props.isSmall ? 2 : 1
  return Math.round((baseWidth * multiplier) / divider)
})

const imageHeight = computed(() => {
  const baseHeight = props.chara.display.height
  const multiplier = props.isLarge ? 1.5 : 1
  const divider = props.isSmall ? 2 : 1
  return Math.round((baseHeight * multiplier) / divider)
})
</script>
