import { apiClient } from '../api-client';

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

export interface PagesResponse {
  pages: Page[];
  total: number;
  totalPages: number;
}

export const pagesApi = {
  // Public endpoints for storefront
  async getBySlug(slug: string, organizationId: string): Promise<Page> {
    const response = await apiClient.get(`/public/pages/by-slug/${slug}?organizationId=${organizationId}`) as { data: Page };
    return response.data;
  },

  async getHomepage(organizationId: string): Promise<Page | null> {
    try {
      const response = await apiClient.get(`/public/pages/homepage?organizationId=${organizationId}`) as { data: Page };
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async getPublishedPages(organizationId: string): Promise<PagesResponse> {
    const response = await apiClient.get(`/public/pages?organizationId=${organizationId}`) as { data: PagesResponse };
    return response.data;
  },

  // Admin endpoints (for future admin integration)
  async getAll(params?: {
    status?: string;
    search?: string;
    isHomepage?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<PagesResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get(`/pages?${queryParams.toString()}`) as { data: PagesResponse };
    return response.data;
  },

  async getById(id: string): Promise<Page> {
    const response = await apiClient.get(`/pages/${id}`) as { data: Page };
    return response.data;
  },

  async create(data: Partial<Page>): Promise<Page> {
    const response = await apiClient.post('/pages', data) as { data: Page };
    return response.data;
  },

  async update(id: string, data: Partial<Page>): Promise<Page> {
    const response = await apiClient.patch(`/pages/${id}`, data) as { data: Page };
    return response.data;
  },

  async publish(id: string): Promise<Page> {
    const response = await apiClient.patch(`/pages/${id}/publish`) as { data: Page };
    return response.data;
  },

  async unpublish(id: string): Promise<Page> {
    const response = await apiClient.patch(`/pages/${id}/unpublish`) as { data: Page };
    return response.data;
  },

  async duplicate(id: string): Promise<Page> {
    const response = await apiClient.post(`/pages/${id}/duplicate`) as { data: Page };
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/pages/${id}`);
  },
};
