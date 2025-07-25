import { apiClient } from "./api-client";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  permissions: string[];
  organizationId: string;
  departmentId?: string;
  createdAt: Date;
  lastActive: Date;
  status: UserStatus;
  twoFactorEnabled: boolean;
  department?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export type UserRole = "owner" | "admin" | "manager" | "support" | "analyst";
export type UserStatus = "active" | "inactive" | "pending";

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: UserRole;
  permissions: string[];
  organizationId?: string;
  departmentId?: string;
  status: UserStatus;
  twoFactorEnabled: boolean;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  avatar?: string;
  role?: UserRole;
  permissions?: string[];
  departmentId?: string;
  status?: UserStatus;
  twoFactorEnabled?: boolean;
  password?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UserQueryParams {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  departmentId?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "email" | "role" | "createdAt" | "lastActive";
  sortOrder?: "ASC" | "DESC";
}

export interface PaginatedUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  byRole: Record<string, number>;
}

// Available permissions in the system
export const availablePermissions: Permission[] = [
  {
    id: "events:create",
    name: "Create Events",
    description: "Can create new events",
  },
  {
    id: "events:edit",
    name: "Edit Events",
    description: "Can edit existing events",
  },
  {
    id: "events:delete",
    name: "Delete Events",
    description: "Can delete events",
  },
  {
    id: "events:publish",
    name: "Publish Events",
    description: "Can publish events",
  },
  {
    id: "tickets:manage",
    name: "Manage Tickets",
    description: "Can manage ticket types and pricing",
  },
  {
    id: "tickets:view-sales",
    name: "View Ticket Sales",
    description: "Can view ticket sales data",
  },
  {
    id: "users:create",
    name: "Create Users",
    description: "Can create new users",
  },
  {
    id: "users:view",
    name: "View Users",
    description: "Can view user information and statistics",
  },
  {
    id: "users:update",
    name: "Update Users",
    description: "Can edit user information and permissions",
  },
  {
    id: "users:delete",
    name: "Delete Users",
    description: "Can delete users from the platform",
  },
  {
    id: "activities:view",
    name: "View Activity Logs",
    description: "Can view user activity logs and system events",
  },
  {
    id: "analytics:view",
    name: "View Analytics",
    description: "Can view platform analytics",
  },
  {
    id: "settings:edit",
    name: "Edit Settings",
    description: "Can edit platform settings",
  },
  {
    id: "billing:manage",
    name: "Manage Billing",
    description: "Can manage billing and subscriptions",
  },
];

// Default permissions for each role
export const rolePermissions: Record<UserRole, string[]> = {
  owner: availablePermissions.map((p) => p.id),
  admin: [
    "events:create",
    "events:edit",
    "events:delete",
    "events:publish",
    "tickets:manage",
    "tickets:view-sales",
    "users:create",
    "users:view",
    "users:update",
    "users:delete",
    "activities:view",
    "analytics:view",
    "settings:edit",
  ],
  manager: [
    "events:create",
    "events:edit",
    "events:publish",
    "tickets:manage",
    "tickets:view-sales",
    "users:view",
    "analytics:view",
  ],
  support: [
    "events:edit",
    "tickets:view-sales",
    "users:view",
    "activities:view",
    "analytics:view",
  ],
  analyst: [
    "tickets:view-sales",
    "users:view",
    "activities:view",
    "analytics:view",
  ],
};

/**
 * Fetch all users with filtering and pagination
 */
export async function fetchUsers(
  params?: UserQueryParams,
): Promise<PaginatedUsersResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.search) {
      queryParams.append("search", params.search);
    }
    if (params?.role) {
      queryParams.append("role", params.role);
    }
    if (params?.status) {
      queryParams.append("status", params.status);
    }
    if (params?.departmentId) {
      queryParams.append("departmentId", params.departmentId);
    }
    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }
    if (params?.sortBy) {
      queryParams.append("sortBy", params.sortBy);
    }
    if (params?.sortOrder) {
      queryParams.append("sortOrder", params.sortOrder);
    }

    const url = `/api/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await apiClient.get(url);

    // Transform date strings back to Date objects
    return {
      ...response.data,
      users: response.data.users.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastActive: new Date(user.lastActive),
      })),
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

/**
 * Fetch a single user by ID
 */
export async function fetchUser(id: string): Promise<User> {
  try {
    const response = await apiClient.get(`/api/users/${id}`);
    const user = response.data;

    // Transform date strings back to Date objects
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      lastActive: new Date(user.lastActive),
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

/**
 * Create a new user
 */
export async function createUser(userData: CreateUserDto): Promise<User> {
  try {
    const response = await apiClient.post("/api/users", userData);
    const user = response.data;

    // Transform date strings back to Date objects
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      lastActive: new Date(user.lastActive),
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

/**
 * Update an existing user
 */
export async function updateUser(
  id: string,
  userData: UpdateUserDto,
): Promise<User> {
  try {
    const response = await apiClient.put(`/api/users/${id}`, userData);
    const user = response.data;

    // Transform date strings back to Date objects
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      lastActive: new Date(user.lastActive),
    };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

/**
 * Change user password
 */
export async function changePassword(
  id: string,
  passwordData: ChangePasswordDto,
): Promise<{ message: string }> {
  try {
    const response = await apiClient.put(
      `/api/users/${id}/password`,
      passwordData,
    );
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<{ message: string }> {
  try {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

/**
 * Get user statistics
 */
export async function fetchUserStats(): Promise<UserStats> {
  try {
    const response = await apiClient.get("/api/users/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user: User, permissionId: string): boolean {
  return user.permissions.includes(permissionId);
}

/**
 * Get users by role
 */
export async function fetchUsersByRole(role: UserRole): Promise<User[]> {
  const response = await fetchUsers({ role });
  return response.users;
}

/**
 * Get users by status
 */
export async function fetchUsersByStatus(status: UserStatus): Promise<User[]> {
  const response = await fetchUsers({ status });
  return response.users;
}
