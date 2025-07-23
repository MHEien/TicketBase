import axios from 'axios'

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.yourdomain.com' 
  : 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

export interface Page {
  id: string
  title: string
  slug: string
  content: any // Puck data structure
  status: 'draft' | 'published' | 'archived'
  isHomepage: boolean
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface CreatePageDto {
  title: string
  slug: string
  content?: any
  status?: 'draft' | 'published' | 'archived'
  isHomepage?: boolean
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
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
    const response = await api.get('/pages', { params: query })
    return response.data
  },

  // Get a single page by ID
  async getPage(id: string) {
    const response = await api.get(`/pages/${id}`)
    return response.data
  },

  // Create a new page
  async createPage(data: CreatePageDto) {
    const response = await api.post('/pages', data)
    return response.data
  },

  // Update a page
  async updatePage(id: string, data: UpdatePageDto) {
    const response = await api.patch(`/pages/${id}`, data)
    return response.data
  },

  // Delete a page
  async deletePage(id: string) {
    const response = await api.delete(`/pages/${id}`)
    return response.data
  },

  // Publish a page
  async publishPage(id: string) {
    const response = await api.patch(`/pages/${id}/publish`)
    return response.data
  },

  // Unpublish a page
  async unpublishPage(id: string) {
    const response = await api.patch(`/pages/${id}/unpublish`)
    return response.data
  },

  // Duplicate a page
  async duplicatePage(id: string) {
    const response = await api.post(`/pages/${id}/duplicate`)
    return response.data
  },

  // Public endpoints (used for preview)
  async getPublicPage(slug: string) {
    const response = await api.get(`/public/pages/${slug}`)
    return response.data
  },

  async getHomepage() {
    const response = await api.get('/public/pages/homepage')
    return response.data
  },
}
