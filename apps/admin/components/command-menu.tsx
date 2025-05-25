"use client"

import { useEffect, useState } from "react"
import { BarChart3, Calendar, FileText, Home, Layers, Plus, Settings, Ticket, Users } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface CommandMenuProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function CommandMenu({ isOpen, setIsOpen }: CommandMenuProps) {
  const [query, setQuery] = useState("")

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [isOpen, setIsOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <CommandInput placeholder="Type a command or search..." value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Suggestions">
              <CommandItem
                onSelect={() => {
                  setIsOpen(false)
                }}
              >
                <Home className="mr-2 h-4 w-4" />
                <span>Home</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setIsOpen(false)
                }}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Analytics</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setIsOpen(false)
                }}
              >
                <Layers className="mr-2 h-4 w-4" />
                <span>Plugins</span>
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Events">
              <CommandItem
                onSelect={() => {
                  setIsOpen(false)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>Create New Event</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setIsOpen(false)
                }}
              >
                <Calendar className="mr-2 h-4 w-4" />
                <span>View Event Calendar</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setIsOpen(false)
                }}
              >
                <Ticket className="mr-2 h-4 w-4" />
                <span>Manage Tickets</span>
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Other">
              <CommandItem
                onSelect={() => {
                  setIsOpen(false)
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>User Management</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setIsOpen(false)
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setIsOpen(false)
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>Documentation</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
