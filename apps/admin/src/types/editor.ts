export type ViewportType = 'desktop' | 'tablet' | 'mobile'
export type AutoSaveStatus = 'saved' | 'saving' | 'error' | 'unsaved'

export interface CollaborationUser {
  id: string
  name: string
  avatar: string
  color: string
  isActive: boolean
}

export interface PageSettings {
  title: string
  slug: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  isHomepage: boolean
}

export interface ViewportConfig {
  width: number
  height: "auto"
  label: string
  icon: React.ReactNode
}