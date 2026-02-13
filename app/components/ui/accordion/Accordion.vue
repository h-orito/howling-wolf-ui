<template>
  <div>
    <div
      v-for="(item, index) in items"
      :key="item.slot || index"
      class="border-b border-white/10 last:border-b-0"
    >
      <!-- ヘッダー部分 -->
      <button
        type="button"
        class="flex w-full cursor-pointer items-center justify-between border-none bg-transparent py-2.5 text-sm text-white transition-colors duration-200 hover:text-blue-400"
        :aria-expanded="openStates[index]"
        :aria-controls="`accordion-content-${index}`"
        @click="toggle(index)"
      >
        <div class="flex items-center">
          <Icon v-if="item.icon" :name="item.icon" class="h-4 w-4 shrink-0" />
          <span class="ml-2">{{ item.label }}</span>
        </div>
        <Icon
          name="i-heroicons-chevron-right-20-solid"
          :class="`h-4 w-4 shrink-0 transition-transform duration-200 ${openStates[index] ? 'rotate-90' : ''}`"
        />
      </button>

      <!-- コンテンツ部分 -->
      <Transition @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
        <div
          v-show="openStates[index]"
          :id="`accordion-content-${index}`"
          class="overflow-hidden"
        >
          <div class="pb-2">
            <slot :name="item.slot" />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '~/components/ui/icon/Icon.vue'

interface AccordionItem {
  label: string
  slot: string
  defaultOpen?: boolean
  icon?: string
}

interface Props {
  items: AccordionItem[]
}

const props = defineProps<Props>()

// 各アイテムの開閉状態を管理
const openStates = ref<boolean[]>([])

// 初期化時にdefaultOpenの設定を反映
onMounted(() => {
  openStates.value = props.items.map((item) => item.defaultOpen ?? false)
})

// items変更時にも状態を更新
watch(
  () => props.items,
  (newItems) => {
    openStates.value = newItems.map(
      (item, index) => openStates.value[index] ?? item.defaultOpen ?? false
    )
  },
  { deep: true }
)

const toggle = (index: number) => {
  openStates.value[index] = !openStates.value[index]
}

// アニメーション用のコールバック
const onEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.transition = 'height 0.2s ease'
  element.style.overflow = 'hidden'
  element.style.height = '0'
  void element.offsetHeight // force reflow
  element.style.height = element.scrollHeight + 'px'
}

const onAfterEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = ''
  element.style.transition = ''
  element.style.overflow = ''
}

const onLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.transition = 'height 0.2s ease'
  element.style.overflow = 'hidden'
  element.style.height = element.scrollHeight + 'px'
  void element.offsetHeight // force reflow
  element.style.height = '0'
}
</script>
