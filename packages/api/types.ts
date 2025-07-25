// Common types used across the API package

export interface Department {
  id: string;
  name: string;
  slug: string;
  description?: string;
  organizationId: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  users?: User[];
  children?: Department[];
}

export interface CreateDepartmentRequest {
  name: string;
  slug?: string;
  description?: string;
  organizationId: string;
  parentId?: string;
  isActive?: boolean;
}

export interface UpdateDepartmentRequest {
  name?: string;
  slug?: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'manager' | 'support' | 'analyst';
  permissions: string[];
  organizationId: string;
  departmentId?: string;
  createdAt: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'pending';
  twoFactorEnabled: boolean;
  department?: Department;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'manager' | 'support' | 'analyst';
  permissions?: string[];
  organizationId: string;
  departmentId?: string;
  status?: 'pending' | 'active' | 'inactive';
  twoFactorEnabled?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  role?: 'manager' | 'support' | 'analyst';
  permissions?: string[];
  organizationId?: string;
  departmentId?: string;
  status?: 'pending' | 'active' | 'inactive';
  twoFactorEnabled?: boolean;
}

// Users API specific types
export interface GetUsersParams {
  search?: string;
  role?: 'owner' | 'admin' | 'manager' | 'support' | 'analyst';
  status?: 'active' | 'inactive' | 'pending';
  departmentId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'email' | 'role' | 'createdAt' | 'lastActive';
  sortOrder?: 'ASC' | 'DESC';
}

export interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}


export interface Organization {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description?: string;
  organizationId: string;
  startDate: string;
  endDate?: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: any; // Puck configuration object
  organizationId: string;
  isHomepage: boolean;
  status: 'draft' | 'published' | 'archived';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePageDto {
  title: string;
  slug?: string;
  content?: any;
  organizationId: string;
  isHomepage?: boolean;
  status?: 'draft' | 'published' | 'archived';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface UpdatePageDto {
  title?: string;
  slug?: string;
  content?: any;
  isHomepage?: boolean;
  status?: 'draft' | 'published' | 'archived';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  userId: string;
  organizationId: string;
  entityType?: string;
  entityId?: string;
  metadata?: any;
  createdAt: string;
}

export interface CreateActivityDto {
  type: string;
  description: string;
  userId: string;
  organizationId: string;
  entityType?: string;
  entityId?: string;
  metadata?: any;
}

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  organizationName?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Analytics types
export interface AnalyticsData {
  metric: string;
  value: number;
  period: string;
  organizationId: string;
  createdAt: string;
}

export interface AnalyticsQuery {
  organizationId: string;
  metric?: string;
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}
