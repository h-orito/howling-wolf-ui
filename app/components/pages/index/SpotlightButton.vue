<template>
  <component
    :is="componentType"
    :to="to"
    :href="href"
    :target="target"
    class="spotlight-shadow spotlight-button flex w-full cursor-pointer justify-center rounded-sm border border-[#dbdbdb] p-2 text-center leading-5 text-white"
    @click="$emit('click')"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  to?: string
  href?: string
  target?: string
}

const props = defineProps<Props>()
defineEmits<{
  click: []
}>()

const componentType = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button'
})
</script>

<style scoped>
.spotlight-button {
  font-size: 1rem;
  background: rgba(0, 0, 0, 0.3);
  text-decoration: none;
  transition: all 0.2s;
  text-shadow:
    2px 2px 5px rgba(97, 69, 69, 1),
    -2px 2px 5px rgba(97, 69, 69, 1),
    2px -2px 5px rgba(97, 69, 69, 1),
    -2px -2px 5px rgba(97, 69, 69, 1);
}

.spotlight-button:hover {
  background: rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.8);
  text-shadow: none;
}

.spotlight-button:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}
</style>
