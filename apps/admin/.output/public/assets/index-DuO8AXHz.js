import { c as createLucideIcon, a as useRouter, r as reactExports, ap as Route, j as jsxRuntimeExports, B as Button, b as Badge, a6 as Check, T as Card, $ as CardHeader, a1 as CardTitle, a2 as CardDescription, _ as CardContent, Q as Switch, a3 as CardFooter, a5 as Label } from './main-D54NVj6U.js';
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from './avatar-DaWuUHOH.js';
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from './tabs-DWHFZA6o.js';
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, e as DropdownMenuItem, d as DropdownMenuSeparator } from './dropdown-menu-Cc3wlmA0.js';
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from './dialog-DgPdtaM4.js';
import { b as getUserById, U as UserCog, a as availablePermissions, h as hasPermission } from './user-data-D8whqKuv.js';
import { u as useToast } from './use-toast-nfgjIcjL.js';
import { A as ArrowLeft } from './arrow-left-D-CnOb33.js';
import { S as Shield } from './shield-BJrRhV_W.js';
import { S as SquarePen } from './square-pen-BFsfaAPy.js';
import { E as Ellipsis } from './ellipsis-pC1tMovR.js';
import { T as Trash2 } from './trash-2-N6yWrD4G.js';
import { C as Clock } from './clock-BDerWfP-.js';
import { M as Mail } from './mail-Bwy92L3K.js';
import { C as Calendar } from './calendar-Dh5IQ9Oq.js';
import { f as format } from './format-DdtoHLaj.js';
import './index-DACOVT_t.js';
import './chevron-right-VQ7fFc8Y.js';
import './index-B18GAnIN.js';

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Key = createLucideIcon("Key", [
  ["path", { d: "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4", key: "g0fldk" }],
  ["path", { d: "m21 2-9.6 9.6", key: "1j0ho8" }],
  ["circle", { cx: "7.5", cy: "15.5", r: "5.5", key: "yqb3hr" }]
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Lock = createLucideIcon("Lock", [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const LogOut = createLucideIcon("LogOut", [
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }],
  ["polyline", { points: "16 17 21 12 16 7", key: "1gabdz" }],
  ["line", { x1: "21", x2: "9", y1: "12", y2: "12", key: "1uyos4" }]
]);

const SplitComponent = function UserDetailPage() {
  const router = useRouter();
  const {
    toast
  } = useToast();
  const [user, setUser] = reactExports.useState(void 0);
  const [loading, setLoading] = reactExports.useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = reactExports.useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = reactExports.useState(false);
  const {
    id
  } = Route.useParams();
  reactExports.useEffect(() => {
    const fetchedUser = getUserById(id);
    setUser(fetchedUser);
    setLoading(false);
  }, [id]);
  const handleDeleteUser = () => {
    toast({
      title: "User Deleted",
      description: `${user?.name} has been removed from the platform.`,
      variant: "destructive"
    });
    setIsDeleteDialogOpen(false);
    router.navigate({
      to: "/admin/users"
    });
  };
  const handleResetPassword = () => {
    toast({
      title: "Password Reset Email Sent",
      description: `A password reset link has been sent to ${user?.email}.`
    });
    setIsResetPasswordDialogOpen(false);
  };
  const handleStatusToggle = () => {
    if (!user) return;
    const newStatus = user.status === "active" ? "inactive" : "active";
    toast({
      title: `User ${newStatus === "active" ? "Activated" : "Deactivated"}`,
      description: `${user.name} has been ${newStatus === "active" ? "activated" : "deactivated"}.`
    });
    setUser({
      ...user,
      status: newStatus
    });
  };
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "owner":
        return "default";
      case "admin":
        return "destructive";
      case "manager":
        return "purple";
      case "support":
        return "blue";
      case "analyst":
        return "green";
      default:
        return "secondary";
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Loading user details..." })
    ] }) });
  }
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", onClick: () => router.navigate({
        to: "/admin/users"
      }), className: "mb-8 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Back to Users" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-full bg-muted p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-2 text-2xl font-bold", children: "User Not Found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-6 text-muted-foreground", children: "The user you're looking for doesn't exist or has been removed." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => router.navigate({
          to: "/admin/users"
        }), className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Back to Users" })
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", onClick: () => router.navigate({
      to: "/admin/users"
    }), className: "mb-4 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Back to Users" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-16 w-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: user.avatar || "/abstract-profile.png", alt: user.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: user.name.charAt(0) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: user.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: getRoleBadgeVariant(user.role), className: "gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: user.role.charAt(0).toUpperCase() + user.role.slice(1) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: user.status === "active" ? "success" : user.status === "pending" ? "warning" : "secondary", children: user.status.charAt(0).toUpperCase() + user.status.slice(1) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: user.email })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "gap-2", onClick: () => router.push(`/users/${user.id}/edit`), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Edit" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setIsResetPasswordDialogOpen(true), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "mr-2 h-4 w-4" }),
              "Reset Password"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: handleStatusToggle, children: user.status === "active" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "mr-2 h-4 w-4" }),
              "Deactivate Account"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mr-2 h-4 w-4" }),
              "Activate Account"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "mr-2 h-4 w-4" }),
              "Force Logout"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setIsDeleteDialogOpen(true), className: "text-destructive focus:text-destructive", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-2 h-4 w-4" }),
              "Delete User"
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "permissions", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "permissions", children: "Permissions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "activity", children: "Activity Log" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "sessions", children: "Active Sessions" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "permissions", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "User Permissions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Manage what this user can access and modify on the platform." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: availablePermissions.map((permission) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: permission.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: permission.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: hasPermission(user, permission.id) })
          ] }, permission.id)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardFooter, { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Reset to Role Default" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "Save Changes" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "activity", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Activity Log" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Recent activity for this user on the platform." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [{
            action: "Logged in",
            time: new Date(2025, 4, 9, 14, 32),
            ip: "192.168.1.1",
            location: "New York, USA"
          }, {
            action: "Updated event 'Summer Music Festival'",
            time: new Date(2025, 4, 9, 13, 15),
            ip: "192.168.1.1",
            location: "New York, USA"
          }, {
            action: "Created new event",
            time: new Date(2025, 4, 8, 16, 45),
            ip: "192.168.1.1",
            location: "New York, USA"
          }, {
            action: "Changed password",
            time: new Date(2025, 4, 7, 10, 20),
            ip: "192.168.1.1",
            location: "New York, USA"
          }, {
            action: "Logged in",
            time: new Date(2025, 4, 7, 10, 15),
            ip: "192.168.1.1",
            location: "New York, USA"
          }].map((activity, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: activity.action }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: format(activity.time, "MMM d, yyyy 'at' h:mm a") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "IP: ",
                  activity.ip
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: activity.location })
              ] })
            ] })
          ] }, index)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "w-full", children: "View Full Activity Log" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "sessions", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Active Sessions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Devices and locations where this user is currently logged in." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [{
            device: "Chrome on Windows",
            lastActive: new Date(2025, 4, 9, 14, 32),
            ip: "192.168.1.1",
            location: "New York, USA",
            current: true
          }, {
            device: "Safari on iPhone",
            lastActive: new Date(2025, 4, 9, 12, 15),
            ip: "192.168.1.2",
            location: "New York, USA",
            current: false
          }, {
            device: "Firefox on MacOS",
            lastActive: new Date(2025, 4, 8, 18, 45),
            ip: "192.168.1.3",
            location: "New York, USA",
            current: false
          }].map((session, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 border-b pb-4 last:border-0 last:pb-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: session.device }),
                  session.current && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: "Current" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Last active:",
                    " ",
                    format(session.lastActive, "MMM d, yyyy 'at' h:mm a")
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "IP: ",
                    session.ip
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: session.location })
                ] })
              ] })
            ] }),
            !session.current && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-destructive hover:text-destructive", children: "Revoke" })
          ] }, index)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", className: "w-full", children: "Revoke All Other Sessions" }) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "User Information" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: user.email })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Account Created" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: format(new Date(user.createdAt), "MMMM d, yyyy") })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Last Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: format(new Date(user.lastActive), "MMMM d, yyyy 'at' h:mm a") })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Two-Factor Authentication" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: user.twoFactorEnabled ? "Enabled" : "Disabled" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Security" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "two-factor", children: "Two-factor Authentication" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Require two-factor authentication for this user" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { id: "two-factor", defaultChecked: user.twoFactorEnabled })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "force-reset", children: "Force Password Reset" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "User will be required to change password on next login" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { id: "force-reset" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full gap-2", onClick: () => setIsResetPasswordDialogOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Reset Password" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Danger Zone" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-destructive/20 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-2 font-medium text-destructive", children: "Delete User Account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-sm text-muted-foreground", children: "Permanently delete this user account and all associated data. This action cannot be undone." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", size: "sm", onClick: () => setIsDeleteDialogOpen(true), children: "Delete Account" })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isDeleteDialogOpen, onOpenChange: setIsDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete User" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Are you sure you want to delete this user? This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: user.avatar || "/abstract-profile.png", alt: user.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: user.name.charAt(0) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium", children: user.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: user.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: getRoleBadgeVariant(user.role), className: "mt-1 gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: user.role.charAt(0).toUpperCase() + user.role.slice(1) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setIsDeleteDialogOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: handleDeleteUser, children: "Delete User" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isResetPasswordDialogOpen, onOpenChange: setIsResetPasswordDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Reset Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Send a password reset link to this user's email address." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: user.avatar || "/abstract-profile.png", alt: user.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: user.name.charAt(0) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium", children: user.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: user.email })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setIsResetPasswordDialogOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleResetPassword, children: "Send Reset Link" })
      ] })
    ] }) })
  ] });
};

export { SplitComponent as component };
