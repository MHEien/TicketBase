import React from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@repo/ui/components/ui/dialog'
import { Command } from 'lucide-react'
import { KEYBOARD_SHORTCUTS } from '@/lib/puck/constants'

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Command className="w-5 h-5 text-blue-500" />
            <span>Keyboard Shortcuts</span>
          </DialogTitle>
          <DialogDescription>
            Boost your productivity with these powerful shortcuts
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 bg-slate-50 px-3 py-1 rounded">General</h4>
            <div className="space-y-2 text-sm">
              {KEYBOARD_SHORTCUTS.general.map((shortcut, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{shortcut.action}</span>
                  <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">
                    {shortcut.shortcut}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 bg-slate-50 px-3 py-1 rounded">Navigation</h4>
            <div className="space-y-2 text-sm">
              {KEYBOARD_SHORTCUTS.navigation.map((shortcut, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{shortcut.action}</span>
                  <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">
                    {shortcut.shortcut}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 bg-slate-50 px-3 py-1 rounded">Editing</h4>
            <div className="space-y-2 text-sm">
              {KEYBOARD_SHORTCUTS.editing.map((shortcut, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{shortcut.action}</span>
                  <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">
                    {shortcut.shortcut}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}