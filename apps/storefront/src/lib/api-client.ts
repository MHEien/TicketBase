import redaxios from "redaxios";
import { getAuthServerFn, getAuthFromClientCookie } from "./auth-cookies";

// Create API client instance with base configuration
const baseClient = redaxios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Enhanced API client with auth handling
const apiClient = {
  async get<T>(url: string, config?: any): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    const response = await baseClient.get(url, {
      ...config,
      headers: { ...authHeaders, ...config?.headers },
    });
    return response.data;
  },

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    const response = await baseClient.post(url, data, {
      ...config,
      headers: { ...authHeaders, ...config?.headers },
    });
    return response.data;
  },

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    const response = await baseClient.patch(url, data, {
      ...config,
      headers: { ...authHeaders, ...config?.headers },
    });
    return response.data;
  },

  async delete<T>(url: string, config?: any): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    const response = await baseClient.delete(url, {
      ...config,
      headers: { ...authHeaders, ...config?.headers },
    });
    return response.data;
  },

  async getAuthHeaders() {
    let token: string | null = null;

    // Try server-side cookie first (for SSR)
    if (typeof window === 'undefined') {
      try {
        const authData = await getAuthServerFn();
        token = authData?.token || null;
      } catch (error) {
        console.error('Error getting auth from server cookie:', error);
      }
    } else {
      // Client-side: try localStorage first (for backward compatibility)
      // then fall back to client cookie reading
      try {
        token = localStorage.getItem("auth_token") || getAuthFromClientCookie();
      } catch (error) {
        console.error('Error getting auth from client storage:', error);
      }
    }

    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

export { apiClient };
