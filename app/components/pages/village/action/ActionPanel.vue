<template>
  <div
    :class="[
      'rounded-lg border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800',
      { 'action-panel-fixed': isFixed }
    ]"
  >
    <!-- アコーディオンヘッダー -->
    <button
      type="button"
      class="flex w-full cursor-pointer items-center justify-between rounded-t-lg bg-gray-100 p-4 text-left dark:bg-gray-700"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {{ title }}
      </h3>
      <div class="flex items-center gap-2">
        <!-- 固定表示ボタン -->
        <button
          type="button"
          class="text-xs text-(--ui-primary) hover:underline"
          @click.stop="toggleFixed"
        >
          {{ isFixed ? '固定解除' : '固定表示' }}
        </button>
        <Icon
          name="i-heroicons-chevron-right-20-solid"
          size="sm"
          :class="
            'shrink-0 text-gray-500 transition-transform duration-200 dark:text-gray-400' +
            (isOpen ? ' rotate-90' : '')
          "
        />
      </div>
    </button>

    <!-- アコーディオンコンテンツ -->
    <Transition @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
      <div v-show="isOpen" class="overflow-hidden">
        <div class="space-y-4 p-4 text-left">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import Icon from '~/components/ui/icon/Icon.vue'
import { useUserSettings } from '~/composables/village/useUserSettings'

interface Props {
  /** パネルのタイトル */
  title: string
  /** パネルの識別キー（設定保存用、例: 'participate', 'say'） */
  panelKey: string
  /** 初期状態で開いているかどうか（デフォルト: true） */
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: true
})

// ユーザー設定
const {
  fixedPanelKey,
  getActionPanelOpen,
  setActionPanelOpen,
  setFixedPanelKey
} = useUserSettings()

// アコーディオン開閉状態（保存された設定を優先）
const isOpen = ref(getActionPanelOpen(props.panelKey, props.defaultOpen))

// 固定状態
const isFixed = computed(() => fixedPanelKey.value === props.panelKey)

// 開閉状態が変わったら保存
watch(isOpen, (newValue) => {
  setActionPanelOpen(props.panelKey, newValue)
})

// 固定表示の切り替え
const toggleFixed = () => {
  if (isFixed.value) {
    setFixedPanelKey(null)
  } else {
    setFixedPanelKey(props.panelKey)
  }
}

// アコーディオンアニメーション用のコールバック
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

// 外部から開閉状態を制御できるように公開
defineExpose({
  isOpen,
  isFixed,
  open: () => {
    isOpen.value = true
  },
  close: () => {
    isOpen.value = false
  },
  toggle: () => {
    isOpen.value = !isOpen.value
  }
})
</script>

<style scoped>
.action-panel-fixed {
  position: fixed;
  z-index: 10;
  left: 0;
  right: 0;
  bottom: 2rem;
  bottom: calc(2rem + env(safe-area-inset-bottom));
  max-height: 30dvh;
  overflow-y: scroll;
  border-right: 0;
  border-left: 0;
  border-bottom: 0;
  border-radius: 0;
}

/* タブレット表示時（左サイドバー分を左にずらす） */
@media screen and (min-width: 768px) {
  .action-panel-fixed {
    left: 280px;
    right: 0;
  }
}

/* デスクトップ表示時（左右サイドバー分を考慮） */
@media screen and (min-width: 1024px) {
  .action-panel-fixed {
    left: 280px;
    right: 280px;
  }
}
</style>
