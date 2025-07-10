import redaxios from 'redaxios';

// Create API client instance with base configuration
const baseClient = redaxios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enhanced API client with auth handling
const apiClient = {
  async get<T>(url: string, config?: any): Promise<T> {
    const authHeaders = this.getAuthHeaders();
    const response = await baseClient.get(url, { 
      ...config, 
      headers: { ...authHeaders, ...config?.headers } 
    });
    return response.data;
  },

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const authHeaders = this.getAuthHeaders();
    const response = await baseClient.post(url, data, { 
      ...config, 
      headers: { ...authHeaders, ...config?.headers } 
    });
    return response.data;
  },

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const authHeaders = this.getAuthHeaders();
    const response = await baseClient.patch(url, data, { 
      ...config, 
      headers: { ...authHeaders, ...config?.headers } 
    });
    return response.data;
  },

  async delete<T>(url: string, config?: any): Promise<T> {
    const authHeaders = this.getAuthHeaders();
    const response = await baseClient.delete(url, { 
      ...config, 
      headers: { ...authHeaders, ...config?.headers } 
    });
    return response.data;
  },

  getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};

export { apiClient }; 