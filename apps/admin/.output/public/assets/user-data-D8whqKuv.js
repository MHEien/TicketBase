import { c as createLucideIcon } from './main-D54NVj6U.js';

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const UserCog = createLucideIcon("UserCog", [
  ["circle", { cx: "18", cy: "15", r: "3", key: "gjjjvw" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["path", { d: "M10 15H6a4 4 0 0 0-4 4v2", key: "1nfge6" }],
  ["path", { d: "m21.7 16.4-.9-.3", key: "12j9ji" }],
  ["path", { d: "m15.2 13.9-.9-.3", key: "1fdjdi" }],
  ["path", { d: "m16.6 18.7.3-.9", key: "heedtr" }],
  ["path", { d: "m19.1 12.2.3-.9", key: "1af3ki" }],
  ["path", { d: "m19.6 18.7-.4-1", key: "1x9vze" }],
  ["path", { d: "m16.8 12.3-.4-1", key: "vqeiwj" }],
  ["path", { d: "m14.3 16.6 1-.4", key: "1qlj63" }],
  ["path", { d: "m20.7 13.8 1-.4", key: "1v5t8k" }]
]);

const availablePermissions = [
  {
    id: "events:create",
    name: "Create Events",
    description: "Can create new events"
  },
  {
    id: "events:edit",
    name: "Edit Events",
    description: "Can edit existing events"
  },
  {
    id: "events:delete",
    name: "Delete Events",
    description: "Can delete events"
  },
  {
    id: "events:publish",
    name: "Publish Events",
    description: "Can publish events"
  },
  {
    id: "tickets:manage",
    name: "Manage Tickets",
    description: "Can manage ticket types and pricing"
  },
  {
    id: "tickets:view-sales",
    name: "View Ticket Sales",
    description: "Can view ticket sales data"
  },
  {
    id: "users:manage",
    name: "Manage Users",
    description: "Can manage platform users"
  },
  {
    id: "analytics:view",
    name: "View Analytics",
    description: "Can view platform analytics"
  },
  {
    id: "settings:edit",
    name: "Edit Settings",
    description: "Can edit platform settings"
  },
  {
    id: "billing:manage",
    name: "Manage Billing",
    description: "Can manage billing and subscriptions"
  }
];
const rolePermissions = {
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
    "settings:edit"
  ],
  manager: [
    "events:create",
    "events:edit",
    "events:publish",
    "tickets:manage",
    "tickets:view-sales",
    "analytics:view"
  ],
  support: ["events:edit", "tickets:view-sales", "analytics:view"],
  analyst: ["tickets:view-sales", "analytics:view"]
};
const sampleUsers = [
  {
    id: "user-001",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "/abstract-profile.png",
    role: "owner",
    permissions: rolePermissions.owner,
    createdAt: /* @__PURE__ */ new Date("2024-01-15"),
    lastActive: /* @__PURE__ */ new Date("2025-05-09T14:32:00"),
    status: "active",
    twoFactorEnabled: true
  },
  {
    id: "user-002",
    name: "Sarah Williams",
    email: "sarah@example.com",
    avatar: "/abstract-profile.png",
    role: "admin",
    permissions: rolePermissions.admin,
    createdAt: /* @__PURE__ */ new Date("2024-02-10"),
    lastActive: /* @__PURE__ */ new Date("2025-05-08T09:15:00"),
    status: "active",
    twoFactorEnabled: true
  },
  {
    id: "user-003",
    name: "Michael Chen",
    email: "michael@example.com",
    avatar: "/abstract-profile.png",
    role: "manager",
    permissions: rolePermissions.manager,
    createdAt: /* @__PURE__ */ new Date("2024-03-05"),
    lastActive: /* @__PURE__ */ new Date("2025-05-09T11:45:00"),
    status: "active",
    twoFactorEnabled: false
  },
  {
    id: "user-004",
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar: "/abstract-profile.png",
    role: "support",
    permissions: rolePermissions.support,
    createdAt: /* @__PURE__ */ new Date("2024-03-20"),
    lastActive: /* @__PURE__ */ new Date("2025-05-07T16:20:00"),
    status: "active",
    twoFactorEnabled: false
  },
  {
    id: "user-005",
    name: "James Rodriguez",
    email: "james@example.com",
    avatar: "/abstract-profile.png",
    role: "analyst",
    permissions: rolePermissions.analyst,
    createdAt: /* @__PURE__ */ new Date("2024-04-12"),
    lastActive: /* @__PURE__ */ new Date("2025-05-06T13:10:00"),
    status: "active",
    twoFactorEnabled: false
  },
  {
    id: "user-006",
    name: "Olivia Taylor",
    email: "olivia@example.com",
    avatar: "/abstract-profile.png",
    role: "manager",
    permissions: rolePermissions.manager,
    createdAt: /* @__PURE__ */ new Date("2024-04-25"),
    lastActive: /* @__PURE__ */ new Date("2025-05-02T10:30:00"),
    status: "inactive",
    twoFactorEnabled: true
  },
  {
    id: "user-007",
    name: "Daniel Brown",
    email: "daniel@example.com",
    avatar: "/abstract-profile.png",
    role: "support",
    permissions: [...rolePermissions.support, "events:create"],
    createdAt: /* @__PURE__ */ new Date("2024-05-01"),
    lastActive: /* @__PURE__ */ new Date("2025-05-08T15:45:00"),
    status: "active",
    twoFactorEnabled: false
  },
  {
    id: "user-008",
    name: "Sophia Martinez",
    email: "sophia@example.com",
    avatar: "/abstract-profile.png",
    role: "admin",
    permissions: rolePermissions.admin,
    createdAt: /* @__PURE__ */ new Date("2024-05-05"),
    lastActive: /* @__PURE__ */ new Date("2025-05-09T09:00:00"),
    status: "pending",
    twoFactorEnabled: false
  }
];
function getAllUsers() {
  return sampleUsers;
}
function getUserById(id) {
  return sampleUsers.find((user) => user.id === id);
}
function hasPermission(user, permissionId) {
  return user.permissions.includes(permissionId);
}

export { UserCog as U, availablePermissions as a, getUserById as b, getAllUsers as g, hasPermission as h };
