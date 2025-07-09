import { c as createLucideIcon, u as useSession, j as jsxRuntimeExports, B as Button, s as signOut, r as reactExports, a as useRouter, b as Badge, d as useId, e as cn, O as Outlet } from './main-D54NVj6U.js';
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from './avatar-DaWuUHOH.js';
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuLabel, d as DropdownMenuSeparator, e as DropdownMenuItem } from './dropdown-menu-Cc3wlmA0.js';
import { u as useCommandMenu, a as useDashboardNav, b as useTheme, D as DashboardNavProvider } from './theme-provider-D8UMdaqp.js';
import { m as motion } from './proxy-DR25Kbh7.js';
import { C as ChartColumn, L as Layers } from './layers-oyITKq26.js';
import { U as Users } from './users-DGvlZmP3.js';
import { C as Calendar } from './calendar-Dh5IQ9Oq.js';
import { S as Settings } from './settings-S4HBAFRa.js';
import { S as Search } from './search-BS6yzFHd.js';
import { P as Plus } from './plus-CY3SNhnW.js';
import { R as Root, P as Portal, O as Overlay, C as Content, D as Dialog, a as DialogContent } from './dialog-DgPdtaM4.js';
import { T as Ticket } from './ticket-Cl-q8e77.js';
import './index-DACOVT_t.js';
import './chevron-right-VQ7fFc8Y.js';
import './index-DQRAsB8C.js';
import './index-B18GAnIN.js';

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Bell = createLucideIcon("Bell", [
  ["path", { d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9", key: "1qo2s2" }],
  ["path", { d: "M10.3 21a1.94 1.94 0 0 0 3.4 0", key: "qgo35s" }]
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Command$1 = createLucideIcon("Command", [
  [
    "path",
    { d: "M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3", key: "11bfej" }
  ]
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const FileText = createLucideIcon("FileText", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const House = createLucideIcon("House", [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const MessageSquare = createLucideIcon("MessageSquare", [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Moon = createLucideIcon("Moon", [
  ["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", key: "a7tn18" }]
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Sun = createLucideIcon("Sun", [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
]);

function AuthStatus({ user }) {
  const { data: session } = useSession();
  const sessionUser = session?.user || user;
  if (!sessionUser) {
    return null;
  }
  const initials = sessionUser.name ? sessionUser.name.split(" ").map((n) => n[0]).join("") : sessionUser.email?.charAt(0) || "U";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "relative h-8 w-8 rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-8 w-8", children: [
      "image" in sessionUser && sessionUser.image ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        AvatarImage,
        {
          src: sessionUser.image,
          alt: sessionUser.name || ""
        }
      ) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: initials })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { className: "w-56", align: "end", forceMount: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { className: "font-normal", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col space-y-1", children: [
        sessionUser.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium leading-none", children: sessionUser.name }),
        sessionUser.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-none text-muted-foreground", children: sessionUser.email }),
        sessionUser.role && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs leading-none text-muted-foreground mt-1", children: [
          "Role: ",
          sessionUser.role
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DropdownMenuItem,
        {
          className: "cursor-pointer",
          onSelect: () => signOut({ callbackUrl: "/login" }),
          children: "Sign out"
        }
      )
    ] })
  ] });
}

function CommandHub() {
  const [expanded, setExpanded] = reactExports.useState(false);
  const hubRef = reactExports.useRef(null);
  const { setIsOpen } = useCommandMenu();
  const router = useRouter();
  const { activeSection, setActiveSection } = useDashboardNav();
  const navItems = [
    { id: "overview", label: "Overview", icon: House },
    { id: "analytics", label: "Analytics", icon: ChartColumn },
    { id: "plugins", label: "Plugins", icon: Layers },
    { id: "users", label: "Users", icon: Users },
    { id: "events", label: "Events", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings }
  ];
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      if (hubRef.current && !hubRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleNewEvent = () => {
    router.navigate({ to: "/admin/events/new" });
  };
  const handleNavItemClick = (id) => {
    if (id === "events") {
      router.navigate({ to: "/admin/events" });
    } else if (id === "users") {
      router.navigate({ to: "/admin/users" });
    } else if (id === "settings") {
      router.navigate({ to: "/admin/settings" });
    } else if (id === "plugins") {
      router.navigate({ to: "/admin/settings/plugins" });
    } else {
      setActiveSection(id);
    }
    setExpanded(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      ref: hubRef,
      className: "fixed left-1/2 top-6 z-50 -translate-x-1/2 transform",
      animate: {
        width: expanded ? "calc(100% - 48px)" : "auto",
        maxWidth: expanded ? "1200px" : "800px"
      },
      transition: { duration: 0.3, ease: "easeInOut" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: "relative overflow-hidden rounded-full border bg-background/80 backdrop-blur-md",
          animate: {
            borderRadius: expanded ? "1rem" : "9999px",
            height: expanded ? "auto" : "56px"
          },
          transition: { duration: 0.3, ease: "easeInOut" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-14 items-center justify-between px-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-9 w-9 rounded-full",
                    onClick: () => setExpanded(!expanded),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Command$1, { className: "h-5 w-5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden items-center gap-1 md:flex", children: navItems.slice(0, 3).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: activeSection === item.id ? "secondary" : "ghost",
                    className: "h-9 gap-2 rounded-full px-3 text-sm",
                    onClick: () => handleNavItemClick(item.id),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-4 w-4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
                    ]
                  },
                  item.id
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "relative h-9 w-9 rounded-full",
                    onClick: () => {
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute right-0 top-0 h-2 w-2 rounded-full p-0" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-9 w-9 rounded-full",
                    onClick: () => {
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-5 w-5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    className: "h-9 gap-2 rounded-full px-3 text-sm",
                    onClick: () => setIsOpen(true),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Search..." }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden text-xs text-muted-foreground md:inline", children: "⌘K" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "default",
                    className: "h-9 gap-2 rounded-full px-3 text-sm",
                    onClick: handleNewEvent,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "New Event" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AuthStatus, {})
              ] })
            ] }),
            expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                className: "grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3",
                initial: { opacity: 0, height: 0 },
                animate: { opacity: 1, height: "auto" },
                exit: { opacity: 0, height: 0 },
                transition: { duration: 0.2 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-lg border bg-background/50 p-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium", children: "Navigation" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: navItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        variant: activeSection === item.id ? "secondary" : "ghost",
                        className: "justify-start gap-2 text-sm",
                        onClick: () => handleNavItemClick(item.id),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-4 w-4" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
                        ]
                      },
                      item.id
                    )) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-lg border bg-background/50 p-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium", children: "Recent Events" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [
                      "Summer Music Festival",
                      "Tech Conference 2023",
                      "Art Exhibition"
                    ].map((event, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        className: "w-full justify-start text-sm",
                        onClick: () => {
                          router.navigate({ to: "/admin/events" });
                          setExpanded(false);
                        },
                        children: event
                      },
                      i
                    )) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-lg border bg-background/50 p-3 md:col-span-2 lg:col-span-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium", children: "Quick Stats" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-background p-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Sales" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold", children: "$24,521" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-background p-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Active Events" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold", children: "12" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-background p-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Tickets Sold" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold", children: "1,245" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-background p-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "New Users" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold", children: "+85" })
                      ] })
                    ] })
                  ] })
                ]
              }
            )
          ]
        }
      )
    }
  );
}

var U=1,Y$1=.9,H=.8,J=.17,p=.1,u=.999,$=.9999;var k$1=.99,m=/[\\\/_+.#"@\[\(\{&]/,B$1=/[\\\/_+.#"@\[\(\{&]/g,K$1=/[\s-]/,X=/[\s-]/g;function G(_,C,h,P,A,f,O){if(f===C.length)return A===_.length?U:k$1;var T=`${A},${f}`;if(O[T]!==void 0)return O[T];for(var L=P.charAt(f),c=h.indexOf(L,A),S=0,E,N,R,M;c>=0;)E=G(_,C,h,P,c+1,f+1,O),E>S&&(c===A?E*=U:m.test(_.charAt(c-1))?(E*=H,R=_.slice(A,c-1).match(B$1),R&&A>0&&(E*=Math.pow(u,R.length))):K$1.test(_.charAt(c-1))?(E*=Y$1,M=_.slice(A,c-1).match(X),M&&A>0&&(E*=Math.pow(u,M.length))):(E*=J,A>0&&(E*=Math.pow(u,c-A))),_.charAt(c)!==C.charAt(f)&&(E*=$)),(E<p&&h.charAt(c-1)===P.charAt(f+1)||P.charAt(f+1)===P.charAt(f)&&h.charAt(c-1)!==P.charAt(f))&&(N=G(_,C,h,P,c+1,f+2,O),N*p>E&&(E=N*p)),E>S&&(S=E),c=h.indexOf(L,c+1);return O[T]=S,S}function D(_){return _.toLowerCase().replace(X," ")}function W(_,C,h){return _=h&&h.length>0?`${_+" "+h.join(" ")}`:_,G(_,C,D(_),D(C),0,0,{})}

// packages/react/compose-refs/src/compose-refs.tsx
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}

// src/slot.tsx
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (reactExports.Children.count(newElement) > 1) return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: reactExports.isValidElement(newElement) ? reactExports.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== reactExports.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1 ? reactExports.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
function isSlottable(child) {
  return reactExports.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}

// src/primitive.tsx
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});

var N='[cmdk-group=""]',Y='[cmdk-group-items=""]',be='[cmdk-group-heading=""]',le='[cmdk-item=""]',ce=`${le}:not([aria-disabled="true"])`,Z="cmdk-item-select",T="data-value",Re=(r,o,n)=>W(r,o,n),ue=reactExports.createContext(void 0),K=()=>reactExports.useContext(ue),de=reactExports.createContext(void 0),ee=()=>reactExports.useContext(de),fe=reactExports.createContext(void 0),me=reactExports.forwardRef((r,o)=>{let n=L(()=>{var e,a;return {search:"",value:(a=(e=r.value)!=null?e:r.defaultValue)!=null?a:"",selectedItemId:void 0,filtered:{count:0,items:new Map,groups:new Set}}}),u=L(()=>new Set),c=L(()=>new Map),d=L(()=>new Map),f=L(()=>new Set),p=pe(r),{label:b,children:m,value:R,onValueChange:x,filter:C,shouldFilter:S,loop:A,disablePointerSelection:ge=false,vimBindings:j=true,...O}=r,$=useId(),q=useId(),_=useId(),I=reactExports.useRef(null),v=ke();k(()=>{if(R!==void 0){let e=R.trim();n.current.value=e,E.emit();}},[R]),k(()=>{v(6,ne);},[]);let E=reactExports.useMemo(()=>({subscribe:e=>(f.current.add(e),()=>f.current.delete(e)),snapshot:()=>n.current,setState:(e,a,s)=>{var i,l,g,y;if(!Object.is(n.current[e],a)){if(n.current[e]=a,e==="search")J(),z(),v(1,W);else if(e==="value"){if(document.activeElement.hasAttribute("cmdk-input")||document.activeElement.hasAttribute("cmdk-root")){let h=document.getElementById(_);h?h.focus():(i=document.getElementById($))==null||i.focus();}if(v(7,()=>{var h;n.current.selectedItemId=(h=M())==null?void 0:h.id,E.emit();}),s||v(5,ne),((l=p.current)==null?void 0:l.value)!==void 0){let h=a!=null?a:"";(y=(g=p.current).onValueChange)==null||y.call(g,h);return}}E.emit();}},emit:()=>{f.current.forEach(e=>e());}}),[]),U=reactExports.useMemo(()=>({value:(e,a,s)=>{var i;a!==((i=d.current.get(e))==null?void 0:i.value)&&(d.current.set(e,{value:a,keywords:s}),n.current.filtered.items.set(e,te(a,s)),v(2,()=>{z(),E.emit();}));},item:(e,a)=>(u.current.add(e),a&&(c.current.has(a)?c.current.get(a).add(e):c.current.set(a,new Set([e]))),v(3,()=>{J(),z(),n.current.value||W(),E.emit();}),()=>{d.current.delete(e),u.current.delete(e),n.current.filtered.items.delete(e);let s=M();v(4,()=>{J(),(s==null?void 0:s.getAttribute("id"))===e&&W(),E.emit();});}),group:e=>(c.current.has(e)||c.current.set(e,new Set),()=>{d.current.delete(e),c.current.delete(e);}),filter:()=>p.current.shouldFilter,label:b||r["aria-label"],getDisablePointerSelection:()=>p.current.disablePointerSelection,listId:$,inputId:_,labelId:q,listInnerRef:I}),[]);function te(e,a){var i,l;let s=(l=(i=p.current)==null?void 0:i.filter)!=null?l:Re;return e?s(e,n.current.search,a):0}function z(){if(!n.current.search||p.current.shouldFilter===false)return;let e=n.current.filtered.items,a=[];n.current.filtered.groups.forEach(i=>{let l=c.current.get(i),g=0;l.forEach(y=>{let h=e.get(y);g=Math.max(h,g);}),a.push([i,g]);});let s=I.current;V().sort((i,l)=>{var h,F;let g=i.getAttribute("id"),y=l.getAttribute("id");return ((h=e.get(y))!=null?h:0)-((F=e.get(g))!=null?F:0)}).forEach(i=>{let l=i.closest(Y);l?l.appendChild(i.parentElement===l?i:i.closest(`${Y} > *`)):s.appendChild(i.parentElement===s?i:i.closest(`${Y} > *`));}),a.sort((i,l)=>l[1]-i[1]).forEach(i=>{var g;let l=(g=I.current)==null?void 0:g.querySelector(`${N}[${T}="${encodeURIComponent(i[0])}"]`);l==null||l.parentElement.appendChild(l);});}function W(){let e=V().find(s=>s.getAttribute("aria-disabled")!=="true"),a=e==null?void 0:e.getAttribute(T);E.setState("value",a||void 0);}function J(){var a,s,i,l;if(!n.current.search||p.current.shouldFilter===false){n.current.filtered.count=u.current.size;return}n.current.filtered.groups=new Set;let e=0;for(let g of u.current){let y=(s=(a=d.current.get(g))==null?void 0:a.value)!=null?s:"",h=(l=(i=d.current.get(g))==null?void 0:i.keywords)!=null?l:[],F=te(y,h);n.current.filtered.items.set(g,F),F>0&&e++;}for(let[g,y]of c.current)for(let h of y)if(n.current.filtered.items.get(h)>0){n.current.filtered.groups.add(g);break}n.current.filtered.count=e;}function ne(){var a,s,i;let e=M();e&&(((a=e.parentElement)==null?void 0:a.firstChild)===e&&((i=(s=e.closest(N))==null?void 0:s.querySelector(be))==null||i.scrollIntoView({block:"nearest"})),e.scrollIntoView({block:"nearest"}));}function M(){var e;return (e=I.current)==null?void 0:e.querySelector(`${le}[aria-selected="true"]`)}function V(){var e;return Array.from(((e=I.current)==null?void 0:e.querySelectorAll(ce))||[])}function X(e){let s=V()[e];s&&E.setState("value",s.getAttribute(T));}function Q(e){var g;let a=M(),s=V(),i=s.findIndex(y=>y===a),l=s[i+e];(g=p.current)!=null&&g.loop&&(l=i+e<0?s[s.length-1]:i+e===s.length?s[0]:s[i+e]),l&&E.setState("value",l.getAttribute(T));}function re(e){let a=M(),s=a==null?void 0:a.closest(N),i;for(;s&&!i;)s=e>0?we(s,N):De(s,N),i=s==null?void 0:s.querySelector(ce);i?E.setState("value",i.getAttribute(T)):Q(e);}let oe=()=>X(V().length-1),ie=e=>{e.preventDefault(),e.metaKey?oe():e.altKey?re(1):Q(1);},se=e=>{e.preventDefault(),e.metaKey?X(0):e.altKey?re(-1):Q(-1);};return reactExports.createElement(Primitive.div,{ref:o,tabIndex:-1,...O,"cmdk-root":"",onKeyDown:e=>{var s;(s=O.onKeyDown)==null||s.call(O,e);let a=e.nativeEvent.isComposing||e.keyCode===229;if(!(e.defaultPrevented||a))switch(e.key){case "n":case "j":{j&&e.ctrlKey&&ie(e);break}case "ArrowDown":{ie(e);break}case "p":case "k":{j&&e.ctrlKey&&se(e);break}case "ArrowUp":{se(e);break}case "Home":{e.preventDefault(),X(0);break}case "End":{e.preventDefault(),oe();break}case "Enter":{e.preventDefault();let i=M();if(i){let l=new Event(Z);i.dispatchEvent(l);}}}}},reactExports.createElement("label",{"cmdk-label":"",htmlFor:U.inputId,id:U.labelId,style:Te},b),B(r,e=>reactExports.createElement(de.Provider,{value:E},reactExports.createElement(ue.Provider,{value:U},e))))}),he=reactExports.forwardRef((r,o)=>{var _,I;let n=useId(),u=reactExports.useRef(null),c=reactExports.useContext(fe),d=K(),f=pe(r),p=(I=(_=f.current)==null?void 0:_.forceMount)!=null?I:c==null?void 0:c.forceMount;k(()=>{if(!p)return d.item(n,c==null?void 0:c.id)},[p]);let b=ve(n,u,[r.value,r.children,u],r.keywords),m=ee(),R=P(v=>v.value&&v.value===b.current),x=P(v=>p||d.filter()===false?true:v.search?v.filtered.items.get(n)>0:true);reactExports.useEffect(()=>{let v=u.current;if(!(!v||r.disabled))return v.addEventListener(Z,C),()=>v.removeEventListener(Z,C)},[x,r.onSelect,r.disabled]);function C(){var v,E;S(),(E=(v=f.current).onSelect)==null||E.call(v,b.current);}function S(){m.setState("value",b.current,true);}if(!x)return null;let{disabled:A,value:ge,onSelect:j,forceMount:O,keywords:$,...q}=r;return reactExports.createElement(Primitive.div,{ref:composeRefs(u,o),...q,id:n,"cmdk-item":"",role:"option","aria-disabled":!!A,"aria-selected":!!R,"data-disabled":!!A,"data-selected":!!R,onPointerMove:A||d.getDisablePointerSelection()?void 0:S,onClick:A?void 0:C},r.children)}),Ee=reactExports.forwardRef((r,o)=>{let{heading:n,children:u,forceMount:c,...d}=r,f=useId(),p=reactExports.useRef(null),b=reactExports.useRef(null),m=useId(),R=K(),x=P(S=>c||R.filter()===false?true:S.search?S.filtered.groups.has(f):true);k(()=>R.group(f),[]),ve(f,p,[r.value,r.heading,b]);let C=reactExports.useMemo(()=>({id:f,forceMount:c}),[c]);return reactExports.createElement(Primitive.div,{ref:composeRefs(p,o),...d,"cmdk-group":"",role:"presentation",hidden:x?void 0:true},n&&reactExports.createElement("div",{ref:b,"cmdk-group-heading":"","aria-hidden":true,id:m},n),B(r,S=>reactExports.createElement("div",{"cmdk-group-items":"",role:"group","aria-labelledby":n?m:void 0},reactExports.createElement(fe.Provider,{value:C},S))))}),ye=reactExports.forwardRef((r,o)=>{let{alwaysRender:n,...u}=r,c=reactExports.useRef(null),d=P(f=>!f.search);return !n&&!d?null:reactExports.createElement(Primitive.div,{ref:composeRefs(c,o),...u,"cmdk-separator":"",role:"separator"})}),Se=reactExports.forwardRef((r,o)=>{let{onValueChange:n,...u}=r,c=r.value!=null,d=ee(),f=P(m=>m.search),p=P(m=>m.selectedItemId),b=K();return reactExports.useEffect(()=>{r.value!=null&&d.setState("search",r.value);},[r.value]),reactExports.createElement(Primitive.input,{ref:o,...u,"cmdk-input":"",autoComplete:"off",autoCorrect:"off",spellCheck:false,"aria-autocomplete":"list",role:"combobox","aria-expanded":true,"aria-controls":b.listId,"aria-labelledby":b.labelId,"aria-activedescendant":p,id:b.inputId,type:"text",value:c?r.value:f,onChange:m=>{c||d.setState("search",m.target.value),n==null||n(m.target.value);}})}),Ce=reactExports.forwardRef((r,o)=>{let{children:n,label:u="Suggestions",...c}=r,d=reactExports.useRef(null),f=reactExports.useRef(null),p=P(m=>m.selectedItemId),b=K();return reactExports.useEffect(()=>{if(f.current&&d.current){let m=f.current,R=d.current,x,C=new ResizeObserver(()=>{x=requestAnimationFrame(()=>{let S=m.offsetHeight;R.style.setProperty("--cmdk-list-height",S.toFixed(1)+"px");});});return C.observe(m),()=>{cancelAnimationFrame(x),C.unobserve(m);}}},[]),reactExports.createElement(Primitive.div,{ref:composeRefs(d,o),...c,"cmdk-list":"",role:"listbox",tabIndex:-1,"aria-activedescendant":p,"aria-label":u,id:b.listId},B(r,m=>reactExports.createElement("div",{ref:composeRefs(f,b.listInnerRef),"cmdk-list-sizer":""},m)))}),xe=reactExports.forwardRef((r,o)=>{let{open:n,onOpenChange:u,overlayClassName:c,contentClassName:d,container:f,...p}=r;return reactExports.createElement(Root,{open:n,onOpenChange:u},reactExports.createElement(Portal,{container:f},reactExports.createElement(Overlay,{"cmdk-overlay":"",className:c}),reactExports.createElement(Content,{"aria-label":r.label,"cmdk-dialog":"",className:d},reactExports.createElement(me,{ref:o,...p}))))}),Ie=reactExports.forwardRef((r,o)=>P(u=>u.filtered.count===0)?reactExports.createElement(Primitive.div,{ref:o,...r,"cmdk-empty":"",role:"presentation"}):null),Pe=reactExports.forwardRef((r,o)=>{let{progress:n,children:u,label:c="Loading...",...d}=r;return reactExports.createElement(Primitive.div,{ref:o,...d,"cmdk-loading":"",role:"progressbar","aria-valuenow":n,"aria-valuemin":0,"aria-valuemax":100,"aria-label":c},B(r,f=>reactExports.createElement("div",{"aria-hidden":true},f)))}),_e=Object.assign(me,{List:Ce,Item:he,Input:Se,Group:Ee,Separator:ye,Dialog:xe,Empty:Ie,Loading:Pe});function we(r,o){let n=r.nextElementSibling;for(;n;){if(n.matches(o))return n;n=n.nextElementSibling;}}function De(r,o){let n=r.previousElementSibling;for(;n;){if(n.matches(o))return n;n=n.previousElementSibling;}}function pe(r){let o=reactExports.useRef(r);return k(()=>{o.current=r;}),o}var k=typeof window=="undefined"?reactExports.useEffect:reactExports.useLayoutEffect;function L(r){let o=reactExports.useRef();return o.current===void 0&&(o.current=r()),o}function P(r){let o=ee(),n=()=>r(o.snapshot());return reactExports.useSyncExternalStore(o.subscribe,n,n)}function ve(r,o,n,u=[]){let c=reactExports.useRef(),d=K();return k(()=>{var b;let f=(()=>{var m;for(let R of n){if(typeof R=="string")return R.trim();if(typeof R=="object"&&"current"in R)return R.current?(m=R.current.textContent)==null?void 0:m.trim():c.current}})(),p=u.map(m=>m.trim());d.value(r,f,p),(b=o.current)==null||b.setAttribute(T,f),c.current=f;}),c}var ke=()=>{let[r,o]=reactExports.useState(),n=L(()=>new Map);return k(()=>{n.current.forEach(u=>u()),n.current=new Map;},[r]),(u,c)=>{n.current.set(u,c),o({});}};function Me(r){let o=r.type;return typeof o=="function"?o(r.props):"render"in o?o.render(r.props):r}function B({asChild:r,children:o},n){return r&&reactExports.isValidElement(o)?reactExports.cloneElement(Me(o),{ref:o.ref},n(o.props.children)):n(o)}var Te={position:"absolute",width:"1px",height:"1px",padding:"0",margin:"-1px",overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",borderWidth:"0"};

const Command = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e,
  {
    ref,
    className: cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    ),
    ...props
  }
));
Command.displayName = _e.displayName;
const CommandInput = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border-b px-3", "cmdk-input-wrapper": "", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    _e.Input,
    {
      ref,
      className: cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props
    }
  )
] }));
CommandInput.displayName = _e.Input.displayName;
const CommandList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.List,
  {
    ref,
    className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
    ...props
  }
));
CommandList.displayName = _e.List.displayName;
const CommandEmpty = reactExports.forwardRef((props, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Empty,
  {
    ref,
    className: "py-6 text-center text-sm",
    ...props
  }
));
CommandEmpty.displayName = _e.Empty.displayName;
const CommandGroup = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Group,
  {
    ref,
    className: cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    ),
    ...props
  }
));
CommandGroup.displayName = _e.Group.displayName;
const CommandSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Separator,
  {
    ref,
    className: cn("-mx-1 h-px bg-border", className),
    ...props
  }
));
CommandSeparator.displayName = _e.Separator.displayName;
const CommandItem = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props
  }
));
CommandItem.displayName = _e.Item.displayName;

function CommandMenu({ isOpen, setIsOpen }) {
  const [query, setQuery] = reactExports.useState("");
  reactExports.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setIsOpen]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "overflow-hidden p-0 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Command, { className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CommandInput,
      {
        placeholder: "Type a command or search...",
        value: query,
        onValueChange: setQuery
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandList, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CommandEmpty, { children: "No results found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandGroup, { heading: "Suggestions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CommandItem,
          {
            onSelect: () => {
              setIsOpen(false);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "mr-2 h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Home" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CommandItem,
          {
            onSelect: () => {
              setIsOpen(false);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "mr-2 h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Analytics" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CommandItem,
          {
            onSelect: () => {
              setIsOpen(false);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "mr-2 h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Plugins" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandGroup, { heading: "Events", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CommandItem,
          {
            onSelect: () => {
              setIsOpen(false);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Create New Event" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CommandItem,
          {
            onSelect: () => {
              setIsOpen(false);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "mr-2 h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "View Event Calendar" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CommandItem,
          {
            onSelect: () => {
              setIsOpen(false);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "mr-2 h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Manage Tickets" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandGroup, { heading: "Other", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CommandItem,
          {
            onSelect: () => {
              setIsOpen(false);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "mr-2 h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "User Management" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CommandItem,
          {
            onSelect: () => {
              setIsOpen(false);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "mr-2 h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Settings" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CommandItem,
          {
            onSelect: () => {
              setIsOpen(false);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mr-2 h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Documentation" })
            ]
          }
        )
      ] })
    ] })
  ] }) }) });
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      variant: "outline",
      size: "icon",
      className: "relative h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm",
      onClick: () => setTheme(theme === "light" ? "dark" : "light"),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { scale: 0 },
            animate: { scale: 1, rotate: theme === "dark" ? 0 : 180 },
            transition: { duration: 0.3 },
            className: "absolute",
            children: theme === "dark" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Toggle theme" })
      ]
    }
  );
}

function AdminLayout() {
  useDashboardNav();
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const {
    isOpen,
    setIsOpen
  } = useCommandMenu();
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1e3);
    return () => clearTimeout(timer);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardNavProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen w-full bg-gradient-to-br from-background to-background/80", children: [
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute inset-0 flex items-center justify-center", initial: {
      opacity: 1
    }, animate: {
      opacity: 0
    }, exit: {
      opacity: 0
    }, transition: {
      duration: 0.5,
      delay: 0.5
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-24 w-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute inset-0 rounded-full border-2 border-primary/20", initial: {
        scale: 0.8,
        opacity: 0
      }, animate: {
        scale: 1,
        opacity: 1
      }, transition: {
        duration: 0.5
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute inset-0 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent", animate: {
        rotate: 360
      }, transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear"
      } })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { className: "flex h-screen flex-col", initial: {
      opacity: 0
    }, animate: {
      opacity: 1
    }, transition: {
      duration: 0.5
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CommandHub, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "relative flex-1 overflow-y-auto px-6 pb-6 pt-20 md:px-8 md:pt-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-6 right-6 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CommandMenu, { isOpen, setIsOpen })
  ] }) });
}
const SplitComponent = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardNavProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, {}) });
};

export { SplitComponent as component };
