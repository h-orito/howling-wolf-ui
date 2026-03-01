// ユーザー設定の型定義
export interface VillageUserSettings {
  paging: PagingSettings
  actionWindow?: ActionWindowSettings
  messageDisplay?: MessageDisplaySettings
  theme?: ThemeSettings
  operation?: OperationSettings
}

export interface PagingSettings {
  isPaging: boolean
  messagePerPage: number
}

export interface ActionWindowSettings {
  fixedPanelKey?: string | null
  openMap?: Record<string, boolean>
}

export interface MessageDisplaySettings {
  isDispDate: boolean
  isCharLarge: boolean
  isImgLarge: boolean
}

export interface ThemeSettings {
  isDark: boolean
}

export interface OperationSettings {
  isOpenFilterNewtab: boolean
  isPasteAnchor: boolean
}

const DEFAULT_PAGING: PagingSettings = {
  isPaging: true,
  messagePerPage: 50
}

const DEFAULT_ACTION_WINDOW: ActionWindowSettings = {
  openMap: {}
}

const DEFAULT_MESSAGE_DISPLAY: MessageDisplaySettings = {
  isDispDate: false,
  isCharLarge: false,
  isImgLarge: false
}

const DEFAULT_THEME: ThemeSettings = {
  isDark: false
}

const DEFAULT_OPERATION: OperationSettings = {
  isOpenFilterNewtab: false,
  isPasteAnchor: false
}

const DEFAULT_SETTINGS: VillageUserSettings = {
  paging: DEFAULT_PAGING,
  actionWindow: DEFAULT_ACTION_WINDOW,
  messageDisplay: DEFAULT_MESSAGE_DISPLAY,
  theme: DEFAULT_THEME,
  operation: DEFAULT_OPERATION
}

const COOKIE_NAME = 'village-user-settings'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/**
 * 村ページのユーザー設定管理(Cookie + Store)
 */
export const useUserSettings = () => {
  const settingsStore = useVillageUserSettingsStore()

  const settingsCookie = useCookie<VillageUserSettings>(COOKIE_NAME, {
    default: () => ({ ...DEFAULT_SETTINGS }),
    maxAge: COOKIE_MAX_AGE,
    path: '/'
  })

  const loadFromCookie = () => {
    if (!settingsCookie.value) {
      settingsCookie.value = JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
    }
    settingsStore.saveSettings(JSON.parse(JSON.stringify(settingsCookie.value)))
  }

  const saveToCookie = () => {
    if (settingsStore.settings) {
      settingsCookie.value = JSON.parse(JSON.stringify(settingsStore.settings))
    }
  }

  const paging = computed<PagingSettings>(
    () => settingsStore.settings?.paging ?? DEFAULT_PAGING
  )

  const actionWindow = computed<ActionWindowSettings>(
    () => settingsStore.settings?.actionWindow ?? DEFAULT_ACTION_WINDOW
  )

  const messageDisplay = computed<MessageDisplaySettings>(
    () => settingsStore.settings?.messageDisplay ?? DEFAULT_MESSAGE_DISPLAY
  )

  const theme = computed<ThemeSettings>(
    () => settingsStore.settings?.theme ?? DEFAULT_THEME
  )

  const operation = computed<OperationSettings>(
    () => settingsStore.settings?.operation ?? DEFAULT_OPERATION
  )

  const fixedPanelKey = computed<string | null>(
    () => actionWindow.value.fixedPanelKey ?? null
  )

  const hasFixedPanel = computed<boolean>(() => fixedPanelKey.value !== null)

  const isFixedPanelOpen = computed<boolean>(() => {
    const key = fixedPanelKey.value
    if (!key) return false
    const openMap = actionWindow.value.openMap
    if (openMap && key in openMap) {
      return openMap[key] ?? true
    }
    return true
  })

  const setPaging = (pagingSettings: PagingSettings) => {
    settingsStore.updatePaging(pagingSettings)
    saveToCookie()
  }

  const setActionWindow = (actionWindowSettings: ActionWindowSettings) => {
    settingsStore.updateActionWindow(actionWindowSettings)
    saveToCookie()
  }

  const setMessageDisplay = (
    messageDisplaySettings: MessageDisplaySettings
  ) => {
    settingsStore.updateMessageDisplay(messageDisplaySettings)
    saveToCookie()
  }

  const setTheme = (themeSettings: ThemeSettings) => {
    settingsStore.updateTheme(themeSettings)
    saveToCookie()
  }

  const setOperation = (operationSettings: OperationSettings) => {
    settingsStore.updateOperation(operationSettings)
    saveToCookie()
  }

  const getActionPanelOpen = (
    panelKey: string,
    defaultOpen: boolean = true
  ): boolean => {
    const openMap = actionWindow.value.openMap
    if (openMap && panelKey in openMap) {
      return openMap[panelKey] ?? defaultOpen
    }
    return defaultOpen
  }

  const setActionPanelOpen = (panelKey: string, isOpen: boolean) => {
    const currentActionWindow = actionWindow.value
    const newOpenMap = { ...currentActionWindow.openMap, [panelKey]: isOpen }
    setActionWindow({
      ...currentActionWindow,
      openMap: newOpenMap
    })
  }

  const setFixedPanelKey = (panelKey: string | null) => {
    const currentActionWindow = actionWindow.value
    setActionWindow({
      ...currentActionWindow,
      fixedPanelKey: panelKey
    })
  }

  return {
    settings: settingsStore.settings,
    paging,
    actionWindow,
    messageDisplay,
    theme,
    operation,
    fixedPanelKey,
    hasFixedPanel,
    isFixedPanelOpen,

    loadFromCookie,
    setPaging,
    setActionWindow,
    setMessageDisplay,
    setTheme,
    setOperation,
    getActionPanelOpen,
    setActionPanelOpen,
    setFixedPanelKey
  }
}
