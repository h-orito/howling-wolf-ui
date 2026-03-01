import { defineStore } from 'pinia'
import type {
  VillageUserSettings,
  PagingSettings,
  ActionWindowSettings,
  MessageDisplaySettings,
  ThemeSettings,
  OperationSettings
} from '~/composables/village/useUserSettings'

/**
 * 村ページのユーザー設定状態管理Store
 */
export const useVillageUserSettingsStore = defineStore(
  'village-user-settings',
  () => {
    // State
    const settings = ref<VillageUserSettings | null>(null)

    // Actions
    const saveSettings = (userSettings: VillageUserSettings) => {
      settings.value = { ...userSettings }
    }

    const updatePaging = (paging: PagingSettings) => {
      if (settings.value) {
        settings.value.paging = paging
      }
    }

    const updateActionWindow = (actionWindow: ActionWindowSettings) => {
      if (settings.value) {
        settings.value.actionWindow = actionWindow
      }
    }

    const updateMessageDisplay = (messageDisplay: MessageDisplaySettings) => {
      if (settings.value) {
        settings.value.messageDisplay = messageDisplay
      }
    }

    const updateTheme = (theme: ThemeSettings) => {
      if (settings.value) {
        settings.value.theme = theme
      }
    }

    const updateOperation = (operation: OperationSettings) => {
      if (settings.value) {
        settings.value.operation = operation
      }
    }

    const reset = () => {
      settings.value = null
    }

    return {
      // State
      settings,

      // Actions
      saveSettings,
      updatePaging,
      updateActionWindow,
      updateMessageDisplay,
      updateTheme,
      updateOperation,
      reset
    }
  }
)
