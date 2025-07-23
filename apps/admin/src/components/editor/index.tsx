// Main component export
export { Route } from './editor'

// Type exports
export type {
  ViewportType,
  AutoSaveStatus,
  CollaborationUser,
  PageSettings,
  ViewportConfig
} from '@/types/editor'

// Configuration exports
export { config} from '@/lib/puck/config'
export { viewports, KEYBOARD_SHORTCUTS } from '@/lib/puck/constants'

// Utility exports
export {
  formatTimeAgo,
  createDefaultPageData,
  createNewPageSettings,
  getAutoSaveStatusConfig
} from '@/lib/utils'

// Component exports
export { PageEditorHeader } from '@/components/editor/PageEditorHeader'
export { PageSettingsDialog } from '@/components/editor/PageSettingsDialog'
export { KeyboardShortcutsDialog } from './KeyboardShortcutDialog'