export type UserRole = "owner" | "admin" | "manager" | "support" | "analyst";

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  permissions: string[];
  createdAt: Date;
  lastActive: Date;
  status: "active" | "inactive" | "pending";
  twoFactorEnabled: boolean;
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
    id: "users:manage",
    name: "Manage Users",
    description: "Can manage platform users",
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
    "users:manage",
    "analytics:view",
    "settings:edit",
  ],
  manager: [
    "events:create",
    "events:edit",
    "events:publish",
    "tickets:manage",
    "tickets:view-sales",
    "analytics:view",
  ],
  support: ["events:edit", "tickets:view-sales", "analytics:view"],
  analyst: ["tickets:view-sales", "analytics:view"],
};

// Sample users data
export const sampleUsers: User[] = [
  {
    id: "user-001",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "/abstract-profile.png",
    role: "owner",
    permissions: rolePermissions.owner,
    createdAt: new Date("2024-01-15"),
    lastActive: new Date("2025-05-09T14:32:00"),
    status: "active",
    twoFactorEnabled: true,
  },
  {
    id: "user-002",
    name: "Sarah Williams",
    email: "sarah@example.com",
    avatar: "/abstract-profile.png",
    role: "admin",
    permissions: rolePermissions.admin,
    createdAt: new Date("2024-02-10"),
    lastActive: new Date("2025-05-08T09:15:00"),
    status: "active",
    twoFactorEnabled: true,
  },
  {
    id: "user-003",
    name: "Michael Chen",
    email: "michael@example.com",
    avatar: "/abstract-profile.png",
    role: "manager",
    permissions: rolePermissions.manager,
    createdAt: new Date("2024-03-05"),
    lastActive: new Date("2025-05-09T11:45:00"),
    status: "active",
    twoFactorEnabled: false,
  },
  {
    id: "user-004",
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar: "/abstract-profile.png",
    role: "support",
    permissions: rolePermissions.support,
    createdAt: new Date("2024-03-20"),
    lastActive: new Date("2025-05-07T16:20:00"),
    status: "active",
    twoFactorEnabled: false,
  },
  {
    id: "user-005",
    name: "James Rodriguez",
    email: "james@example.com",
    avatar: "/abstract-profile.png",
    role: "analyst",
    permissions: rolePermissions.analyst,
    createdAt: new Date("2024-04-12"),
    lastActive: new Date("2025-05-06T13:10:00"),
    status: "active",
    twoFactorEnabled: false,
  },
  {
    id: "user-006",
    name: "Olivia Taylor",
    email: "olivia@example.com",
    avatar: "/abstract-profile.png",
    role: "manager",
    permissions: rolePermissions.manager,
    createdAt: new Date("2024-04-25"),
    lastActive: new Date("2025-05-02T10:30:00"),
    status: "inactive",
    twoFactorEnabled: true,
  },
  {
    id: "user-007",
    name: "Daniel Brown",
    email: "daniel@example.com",
    avatar: "/abstract-profile.png",
    role: "support",
    permissions: [...rolePermissions.support, "events:create"],
    createdAt: new Date("2024-05-01"),
    lastActive: new Date("2025-05-08T15:45:00"),
    status: "active",
    twoFactorEnabled: false,
  },
  {
    id: "user-008",
    name: "Sophia Martinez",
    email: "sophia@example.com",
    avatar: "/abstract-profile.png",
    role: "admin",
    permissions: rolePermissions.admin,
    createdAt: new Date("2024-05-05"),
    lastActive: new Date("2025-05-09T09:00:00"),
    status: "pending",
    twoFactorEnabled: false,
  },
];

// Function to get all users
export function getAllUsers(): User[] {
  return sampleUsers;
}

// Function to get a user by ID
export function getUserById(id: string): User | undefined {
  return sampleUsers.find((user) => user.id === id);
}

// Function to get users by role
export function getUsersByRole(role: UserRole): User[] {
  return sampleUsers.filter((user) => user.role === role);
}

// Function to get users by status
export function getUsersByStatus(status: User["status"]): User[] {
  return sampleUsers.filter((user) => user.status === status);
}

// Function to check if a user has a specific permission
export function hasPermission(user: User, permissionId: string): boolean {
  return user.permissions.includes(permissionId);
}
