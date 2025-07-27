import { apiClient } from './api-client'

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

export interface CreatePageDto {
  title: string
  slug: string
  description?: string
  content: Record<string, any> // Reka.js state configuration
  status?: 'draft' | 'published' | 'archived'
  isHomepage?: boolean
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  featuredImage?: string
  metadata?: Record<string, any>
  sortOrder?: number
}

export interface UpdatePageDto extends Partial<CreatePageDto> {}

export interface PageQueryDto {
  page?: number
  limit?: number
  search?: string
  status?: 'draft' | 'published' | 'archived'
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

export const pagesApi = {
  // Get all pages for the organization
  async getPages(query?: PageQueryDto) {
    const response = await apiClient.get('/api/pages', { params: query })
    return response.data
  },

  // Get a single page by ID
  async getPage(id: string) {
    console.log('getPage', id)
    const response = await apiClient.get(`/api/pages/${id}`)
    return response.data
  },

  // Create a new page
  async createPage(data: CreatePageDto) {
    const response = await apiClient.post('/api/pages', data)
    return response.data
  },

  // Update a page
  async updatePage(id: string, data: UpdatePageDto) {
    const response = await apiClient.patch(`/api/pages/${id}`, data)
    return response.data
  },

  // Delete a page
  async deletePage(id: string) {
    const response = await apiClient.delete(`/api/pages/${id}`)
    return response.data
  },

  // Publish a page
  async publishPage(id: string) {
    const response = await apiClient.patch(`/api/pages/${id}/publish`)
    return response.data
  },

  // Unpublish a page
  async unpublishPage(id: string) {
    const response = await apiClient.patch(`/api/pages/${id}/unpublish`)
    return response.data
  },

  // Duplicate a page
  async duplicatePage(id: string) {
    const response = await apiClient.post(`/api/pages/${id}/duplicate`)
    return response.data
  },

  // Public endpoints (used for preview)
  async getPublicPage(slug: string, organizationId: string) {
    const response = await apiClient.get(`/api/public/pages/by-slug/${slug}`, {
      params: { organizationId }
    })
    return response.data
  },

  async getHomepage(organizationId: string) {
    const response = await apiClient.get('/api/public/pages/homepage', {
      params: { organizationId }
    })
    return response.data
  },

  async getPublishedPages(organizationId: string) {
    const response = await apiClient.get('/api/public/pages', {
      params: { organizationId }
    })
    return response.data
  },
}
