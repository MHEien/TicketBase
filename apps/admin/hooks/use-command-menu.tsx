"use client"

import { create } from "zustand"

interface CommandMenuState {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export const useCommandMenu = create<CommandMenuState>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}))
