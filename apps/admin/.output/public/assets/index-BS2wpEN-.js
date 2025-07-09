import { r as reactExports, a as useRouter, u as useSession, aN as Route, aO as getDepartmentById, a8 as toast, j as jsxRuntimeExports, B as Button, T as Card, _ as CardContent, al as Link, b as Badge, $ as CardHeader, a1 as CardTitle, ar as Separator } from './main-D54NVj6U.js';
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from './tabs-DWHFZA6o.js';
import { A as ArrowLeft } from './arrow-left-D-CnOb33.js';
import { U as Users } from './users-DGvlZmP3.js';
import { P as Pencil } from './pencil-Cjqq7VRy.js';
import { S as Settings } from './settings-S4HBAFRa.js';
import './index-DACOVT_t.js';

const SplitComponent = function DepartmentDetailPage() {
  const [department, setDepartment] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  useRouter();
  const {
    data: session
  } = useSession();
  const {
    id
  } = Route.useParams();
  const organizationId = session?.user?.organizationId;
  reactExports.useEffect(() => {
    if (organizationId) {
      fetchDepartment();
    }
  }, [organizationId, id]);
  const fetchDepartment = async () => {
    if (!organizationId) return;
    setLoading(true);
    try {
      const data = await getDepartmentById(id, organizationId);
      setDepartment(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch department details",
        variant: "destructive"
      });
      console.error("Error fetching department:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => window.history.back(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Back"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Loading department details..." }) })
    ] });
  }
  if (!department) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => window.history.back(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Back"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-2", children: "Department Not Found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "The department you're looking for doesn't exist or you don't have permission to view it." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/departments", children: "Go to Departments" }) })
      ] }) }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => window.history.back(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
      "Back"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: department.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mt-2 space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: department.isActive ? "default" : "secondary", children: department.isActive ? "Active" : "Inactive" }),
          department.code && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: department.code })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/departments/$id", params: {
          id: department.id
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "mr-2 h-4 w-4" }),
          "Manage Members"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/departments/$id", params: {
          id: department.id
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "mr-2 h-4 w-4" }),
          "Edit Department"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "details", className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "details", children: "Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "members", children: "Members" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "settings", children: "Settings" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "details", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Department Information" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            department.description ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed", children: department.description }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "No description provided" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-muted-foreground", children: "Slug" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: department.slug })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-muted-foreground", children: "Code" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: department.code || "N/A" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-muted-foreground", children: "Parent Department" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: department.parentDepartment ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/departments/$id", params: {
                    id: department.parentDepartment.id
                  }, className: "text-primary hover:underline", children: department.parentDepartment.name }) : "None (Top Level)" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-muted-foreground", children: "Created" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: new Date(department.createdAt).toLocaleDateString() })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-muted-foreground", children: "Department Contact" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm mt-1", children: [
                  department.settings?.contactEmail ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                    "Email: ",
                    department.settings.contactEmail
                  ] }) : null,
                  department.settings?.contactPhone ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                    "Phone: ",
                    department.settings.contactPhone
                  ] }) : null,
                  department.settings?.location ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                    "Location: ",
                    department.settings.location
                  ] }) : null,
                  !department.settings?.contactEmail && !department.settings?.contactPhone && !department.settings?.location && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground italic", children: "No contact information" })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Department Stats" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center py-2 border-b", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Total Members" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: department.users?.length || 0 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center py-2 border-b", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Child Departments" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: department.childDepartments?.length || 0 })
            ] }),
            department.childDepartments && department.childDepartments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium mb-2", children: "Sub-departments" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: department.childDepartments.map((child) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/departments/$id", params: {
                id: child.id
              }, className: "text-sm text-primary hover:underline block p-2 rounded-md border", children: child.name }) }, child.id)) })
            ] })
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "members", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Department Members" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/departments/$id", params: {
            id: department.id
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "mr-2 h-4 w-4" }),
            "Manage Members"
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: department.users && department.users.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: department.users.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center p-3 rounded-md border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3", children: user.avatar ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.avatar, alt: user.name, className: "w-8 h-8 rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: user.name.charAt(0) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: user.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: user.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: user.role })
        ] }, user.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "No members in this department" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/departments/$id", params: {
            id: department.id
          }, children: "Add Members" }) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "settings", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Department Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/departments/$id", params: {
            id: department.id
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "mr-2 h-4 w-4" }),
            "Edit Settings"
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium mb-2", children: "Appearance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-md border", style: {
                  backgroundColor: department.settings?.color || "#3498db"
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: department.settings?.color || "#3498db" })
              ] }),
              department.settings?.icon && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: department.settings.icon }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Department Icon" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium mb-2", children: "Ticket Settings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Auto-assign Tickets" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: department.settings?.autoAssignTickets ? "default" : "secondary", children: department.settings?.autoAssignTickets ? "Enabled" : "Disabled" })
              ] }),
              department.settings?.defaultTicketAssignee && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Default Assignee" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: department.settings.defaultTicketAssignee })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium mb-2", children: "Notification Preferences" }),
            department.settings?.notificationPreferences ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "New Tickets" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: department.settings.notificationPreferences.newTicket ? "default" : "secondary", children: department.settings.notificationPreferences.newTicket ? "Enabled" : "Disabled" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Ticket Assignments" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: department.settings.notificationPreferences.ticketAssigned ? "default" : "secondary", children: department.settings.notificationPreferences.ticketAssigned ? "Enabled" : "Disabled" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Ticket Closures" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: department.settings.notificationPreferences.ticketClosed ? "default" : "secondary", children: department.settings.notificationPreferences.ticketClosed ? "Enabled" : "Disabled" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Daily Summary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: department.settings.notificationPreferences.dailySummary ? "default" : "secondary", children: department.settings.notificationPreferences.dailySummary ? "Enabled" : "Disabled" })
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "No notification preferences configured" })
          ] })
        ] }) })
      ] }) })
    ] })
  ] });
};

export { SplitComponent as component };
