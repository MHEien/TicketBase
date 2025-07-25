export interface Page {
    id: string
    title: string
    slug: string
    description?: string
    content: Record<string, any> // Reka.js state configuration
    status: 'draft' | 'published' | 'archived'
    isHomepage: boolean
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
    featuredImage?: string
    metadata?: Record<string, any>
    sortOrder: number
    organizationId: string
    createdBy: string
    updatedBy: string
    createdAt: string
    updatedAt: string
  }