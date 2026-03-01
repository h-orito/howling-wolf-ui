import type { Component } from 'vue'

// 24px outline icons
import {
  ArrowPathIcon as ArrowPathIconOutline,
  ExclamationCircleIcon as ExclamationCircleIconOutline,
  QuestionMarkCircleIcon as QuestionMarkCircleIconOutline,
  InformationCircleIcon as InformationCircleIconOutline,
  DocumentTextIcon as DocumentTextIconOutline,
  Cog6ToothIcon as Cog6ToothIconOutline,
  HomeIcon as HomeIconOutline,
  UsersIcon as UsersIconOutline,
  ChartBarIcon as ChartBarIconOutline,
  FunnelIcon as FunnelIconOutline,
  ScissorsIcon as ScissorsIconOutline
} from '@heroicons/vue/24/outline'

// 20px solid icons
import {
  ChevronLeftIcon as ChevronLeftIcon20Solid,
  ChevronRightIcon as ChevronRightIcon20Solid,
  ArrowUpIcon as ArrowUpIcon20Solid,
  ArrowDownIcon as ArrowDownIcon20Solid,
  ArrowLeftIcon as ArrowLeftIcon20Solid,
  ArrowRightIcon as ArrowRightIcon20Solid,
  ArrowPathIcon as ArrowPathIcon20Solid,
  Bars3Icon as Bars3Icon20Solid,
  MagnifyingGlassIcon as MagnifyingGlassIcon20Solid,
  XMarkIcon as XMarkIcon20Solid,
  FunnelIcon as FunnelIcon20Solid,
  PlusIcon as PlusIcon20Solid,
  TrashIcon as TrashIcon20Solid,
  ClipboardDocumentIcon as ClipboardDocumentIcon20Solid
} from '@heroicons/vue/20/solid'

// アイコン名からコンポーネントへのマッピング (i-heroicons-xxx形式)
export const heroiconsMap: Record<string, Component> = {
  // 24px outline (default)
  'i-heroicons-arrow-path': ArrowPathIconOutline,
  'i-heroicons-exclamation-circle': ExclamationCircleIconOutline,
  'i-heroicons-question-mark-circle': QuestionMarkCircleIconOutline,
  'i-heroicons-information-circle': InformationCircleIconOutline,
  'i-heroicons-document-text': DocumentTextIconOutline,
  'i-heroicons-cog-6-tooth': Cog6ToothIconOutline,
  'i-heroicons-home': HomeIconOutline,
  'i-heroicons-users': UsersIconOutline,
  'i-heroicons-chart-bar': ChartBarIconOutline,
  'i-heroicons-funnel': FunnelIconOutline,
  'i-heroicons-scissors': ScissorsIconOutline,

  // 20px solid
  'i-heroicons-chevron-left-20-solid': ChevronLeftIcon20Solid,
  'i-heroicons-chevron-right-20-solid': ChevronRightIcon20Solid,
  'i-heroicons-arrow-up-20-solid': ArrowUpIcon20Solid,
  'i-heroicons-arrow-down-20-solid': ArrowDownIcon20Solid,
  'i-heroicons-arrow-left-20-solid': ArrowLeftIcon20Solid,
  'i-heroicons-arrow-right-20-solid': ArrowRightIcon20Solid,
  'i-heroicons-arrow-path-20-solid': ArrowPathIcon20Solid,
  'i-heroicons-bars-3-20-solid': Bars3Icon20Solid,
  'i-heroicons-magnifying-glass-20-solid': MagnifyingGlassIcon20Solid,
  'i-heroicons-x-mark-20-solid': XMarkIcon20Solid,
  'i-heroicons-funnel-20-solid': FunnelIcon20Solid,
  'i-heroicons-plus-20-solid': PlusIcon20Solid,
  'i-heroicons-trash-20-solid': TrashIcon20Solid,
  'i-heroicons-clipboard-document-20-solid': ClipboardDocumentIcon20Solid
}
