import React from 'react'
import { Monitor, Tablet, Smartphone } from 'lucide-react'
import type { ViewportConfig } from '@/types/editor'

// Enhanced viewport configuration
export const viewports: ViewportConfig[] = [
  {
    width: 1920,
    height: "auto" as const,
    label: "Desktop Large",
    icon: React.createElement(Monitor, { className: "w-4 h-4" }),
  },
  {
    width: 1440,
    height: "auto" as const, 
    label: "Desktop",
    icon: React.createElement(Monitor, { className: "w-4 h-4" }),
  },
  {
    width: 768,
    height: "auto" as const,
    label: "Tablet",
    icon: React.createElement(Tablet, { className: "w-4 h-4" }),
  },
  {
    width: 375,
    height: "auto" as const,
    label: "Mobile",
    icon: React.createElement(Smartphone, { className: "w-4 h-4" }),
  },
]

export const KEYBOARD_SHORTCUTS = {
  general: [
    { action: "Save Page", shortcut: "⌘S" },
    { action: "Toggle Preview", shortcut: "⌘I" },
    { action: "Fullscreen", shortcut: "⌘F" },
  ],
  navigation: [
    { action: "Close Dialog", shortcut: "Esc" },
    { action: "Quick Search", shortcut: "⌘K" },
  ],
  editing: [
    { action: "Undo", shortcut: "⌘Z" },
    { action: "Redo", shortcut: "⌘⇧Z" },
    { action: "Duplicate", shortcut: "⌘D" },
  ],
}