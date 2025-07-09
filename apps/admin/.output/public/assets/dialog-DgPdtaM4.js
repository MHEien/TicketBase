import {
  r as reactExports,
  j as jsxRuntimeExports,
  aq as React,
  af as hideOthers,
  ag as ReactRemoveScroll,
  e as cn,
} from "./main-D54NVj6U.js";
import {
  P as Portal$1,
  u as useFocusGuards,
  F as FocusScope,
  D as DismissableLayer,
  X,
} from "./index-B18GAnIN.js";

// packages/core/primitive/src/primitive.tsx
function composeEventHandlers(
  originalEventHandler,
  ourEventHandler,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event) {
    originalEventHandler?.(event);
    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
}

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
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}

// packages/react/context/src/create-context.tsx
function createContext2(rootComponentName, defaultContext) {
  const Context = reactExports.createContext(defaultContext);
  const Provider = (props) => {
    const { children, ...context } = props;
    const value = reactExports.useMemo(() => context, Object.values(context));
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, {
      value,
      children,
    });
  };
  Provider.displayName = rootComponentName + "Provider";
  function useContext2(consumerName) {
    const context = reactExports.useContext(Context);
    if (context) return context;
    if (defaultContext !== void 0) return defaultContext;
    throw new Error(
      `\`${consumerName}\` must be used within \`${rootComponentName}\``,
    );
  }
  return [Provider, useContext2];
}
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext3(rootComponentName, defaultContext) {
    const BaseContext = reactExports.createContext(defaultContext);
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      const { scope, children, ...context } = props;
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      const value = reactExports.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, {
        value,
        children,
      });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName, scope) {
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      const context = reactExports.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(
        `\`${consumerName}\` must be used within \`${rootComponentName}\``,
      );
    }
    return [Provider, useContext2];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return reactExports.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = scope?.[scopeName] || scopeContexts;
      return reactExports.useMemo(
        () => ({
          [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts },
        }),
        [scope, contexts],
      );
    };
  };
  createScope.scopeName = scopeName;
  return [
    createContext3,
    composeContextScopes(createScope, ...createContextScopeDeps),
  ];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName,
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce(
        (nextScopes2, { useScope, scopeName }) => {
          const scopeProps = useScope(overrideScopes);
          const currentScope = scopeProps[`__scope${scopeName}`];
          return { ...nextScopes2, ...currentScope };
        },
        {},
      );
      return reactExports.useMemo(
        () => ({ [`__scope${baseScope.scopeName}`]: nextScopes }),
        [nextScopes],
      );
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}

// packages/react/use-layout-effect/src/use-layout-effect.tsx
var useLayoutEffect2$2 = globalThis?.document
  ? reactExports.useLayoutEffect
  : () => {};

// packages/react/id/src/id.tsx
var useReactId = React[" useId ".trim().toString()] || (() => void 0);
var count = 0;
function useId(deterministicId) {
  const [id, setId] = reactExports.useState(useReactId());
  useLayoutEffect2$2(() => {
    setId((reactId) => reactId ?? String(count++));
  }, [deterministicId]);
  return deterministicId || (id ? `radix-${id}` : "");
}

// packages/react/use-layout-effect/src/use-layout-effect.tsx
var useLayoutEffect2$1 = globalThis?.document
  ? reactExports.useLayoutEffect
  : () => {};

// src/use-controllable-state.tsx
var useInsertionEffect =
  React[" useInsertionEffect ".trim().toString()] || useLayoutEffect2$1;
function useControllableState({
  prop,
  defaultProp,
  onChange = () => {},
  caller,
}) {
  const [uncontrolledProp, setUncontrolledProp, onChangeRef] =
    useUncontrolledState({
      defaultProp,
      onChange,
    });
  const isControlled = prop !== void 0;
  const value = isControlled ? prop : uncontrolledProp;
  {
    const isControlledRef = reactExports.useRef(prop !== void 0);
    reactExports.useEffect(() => {
      const wasControlled = isControlledRef.current;
      if (wasControlled !== isControlled) {
        const from = wasControlled ? "controlled" : "uncontrolled";
        const to = isControlled ? "controlled" : "uncontrolled";
        console.warn(
          `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
        );
      }
      isControlledRef.current = isControlled;
    }, [isControlled, caller]);
  }
  const setValue = reactExports.useCallback(
    (nextValue) => {
      if (isControlled) {
        const value2 = isFunction(nextValue) ? nextValue(prop) : nextValue;
        if (value2 !== prop) {
          onChangeRef.current?.(value2);
        }
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, onChangeRef],
  );
  return [value, setValue];
}
function useUncontrolledState({ defaultProp, onChange }) {
  const [value, setValue] = reactExports.useState(defaultProp);
  const prevValueRef = reactExports.useRef(value);
  const onChangeRef = reactExports.useRef(onChange);
  useInsertionEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  reactExports.useEffect(() => {
    if (prevValueRef.current !== value) {
      onChangeRef.current?.(value);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef]);
  return [value, setValue, onChangeRef];
}
function isFunction(value) {
  return typeof value === "function";
}

// packages/react/use-layout-effect/src/use-layout-effect.tsx
var useLayoutEffect2 = globalThis?.document
  ? reactExports.useLayoutEffect
  : () => {};

function useStateMachine(initialState, machine) {
  return reactExports.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}

// src/presence.tsx
var Presence = (props) => {
  const { present, children } = props;
  const presence = usePresence(present);
  const child =
    typeof children === "function"
      ? children({ present: presence.isPresent })
      : reactExports.Children.only(children);
  const ref = useComposedRefs(presence.ref, getElementRef$1(child));
  const forceMount = typeof children === "function";
  return forceMount || presence.isPresent
    ? reactExports.cloneElement(child, { ref })
    : null;
};
Presence.displayName = "Presence";
function usePresence(present) {
  const [node, setNode] = reactExports.useState();
  const stylesRef = reactExports.useRef(null);
  const prevPresentRef = reactExports.useRef(present);
  const prevAnimationNameRef = reactExports.useRef("none");
  const initialState = present ? "mounted" : "unmounted";
  const [state, send] = useStateMachine(initialState, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended",
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted",
    },
    unmounted: {
      MOUNT: "mounted",
    },
  });
  reactExports.useEffect(() => {
    const currentAnimationName = getAnimationName(stylesRef.current);
    prevAnimationNameRef.current =
      state === "mounted" ? currentAnimationName : "none";
  }, [state]);
  useLayoutEffect2(() => {
    const styles = stylesRef.current;
    const wasPresent = prevPresentRef.current;
    const hasPresentChanged = wasPresent !== present;
    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current;
      const currentAnimationName = getAnimationName(styles);
      if (present) {
        send("MOUNT");
      } else if (
        currentAnimationName === "none" ||
        styles?.display === "none"
      ) {
        send("UNMOUNT");
      } else {
        const isAnimating = prevAnimationName !== currentAnimationName;
        if (wasPresent && isAnimating) {
          send("ANIMATION_OUT");
        } else {
          send("UNMOUNT");
        }
      }
      prevPresentRef.current = present;
    }
  }, [present, send]);
  useLayoutEffect2(() => {
    if (node) {
      let timeoutId;
      const ownerWindow = node.ownerDocument.defaultView ?? window;
      const handleAnimationEnd = (event) => {
        const currentAnimationName = getAnimationName(stylesRef.current);
        const isCurrentAnimation = currentAnimationName.includes(
          event.animationName,
        );
        if (event.target === node && isCurrentAnimation) {
          send("ANIMATION_END");
          if (!prevPresentRef.current) {
            const currentFillMode = node.style.animationFillMode;
            node.style.animationFillMode = "forwards";
            timeoutId = ownerWindow.setTimeout(() => {
              if (node.style.animationFillMode === "forwards") {
                node.style.animationFillMode = currentFillMode;
              }
            });
          }
        }
      };
      const handleAnimationStart = (event) => {
        if (event.target === node) {
          prevAnimationNameRef.current = getAnimationName(stylesRef.current);
        }
      };
      node.addEventListener("animationstart", handleAnimationStart);
      node.addEventListener("animationcancel", handleAnimationEnd);
      node.addEventListener("animationend", handleAnimationEnd);
      return () => {
        ownerWindow.clearTimeout(timeoutId);
        node.removeEventListener("animationstart", handleAnimationStart);
        node.removeEventListener("animationcancel", handleAnimationEnd);
        node.removeEventListener("animationend", handleAnimationEnd);
      };
    } else {
      send("ANIMATION_END");
    }
  }, [node, send]);
  return {
    isPresent: ["mounted", "unmountSuspended"].includes(state),
    ref: reactExports.useCallback((node2) => {
      stylesRef.current = node2 ? getComputedStyle(node2) : null;
      setNode(node2);
    }, []),
  };
}
function getAnimationName(styles) {
  return styles?.animationName || "none";
}
function getElementRef$1(element) {
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
          if (reactExports.Children.count(newElement) > 1)
            return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement)
            ? newElement.props.children
            : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, {
        ...slotProps,
        ref: forwardedRef,
        children: reactExports.isValidElement(newElement)
          ? reactExports.cloneElement(newElement, void 0, newChildren)
          : null,
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, {
      ...slotProps,
      ref: forwardedRef,
      children,
    });
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
        props2.ref = forwardedRef
          ? composeRefs(forwardedRef, childrenRef)
          : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1
      ? reactExports.Children.only(null)
      : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
function isSlottable(child) {
  return (
    reactExports.isValidElement(child) &&
    typeof child.type === "function" &&
    "__radixId" in child.type &&
    child.type.__radixId === SLOTTABLE_IDENTIFIER
  );
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
      overrideProps[propName] = [slotPropValue, childPropValue]
        .filter(Boolean)
        .join(" ");
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
  "ul",
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, {
      ...primitiveProps,
      ref: forwardedRef,
    });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});

var DIALOG_NAME = "Dialog";
var [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog$1 = (props) => {
  const {
    __scopeDialog,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = true,
  } = props;
  const triggerRef = reactExports.useRef(null);
  const contentRef = reactExports.useRef(null);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: DIALOG_NAME,
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogProvider, {
    scope: __scopeDialog,
    triggerRef,
    contentRef,
    contentId: useId(),
    titleId: useId(),
    descriptionId: useId(),
    open,
    onOpenChange: setOpen,
    onOpenToggle: reactExports.useCallback(
      () => setOpen((prevOpen) => !prevOpen),
      [setOpen],
    ),
    modal,
    children,
  });
};
Dialog$1.displayName = DIALOG_NAME;
var TRIGGER_NAME = "DialogTrigger";
var DialogTrigger = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeDialog, ...triggerProps } = props;
  const context = useDialogContext(TRIGGER_NAME, __scopeDialog);
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.button, {
    type: "button",
    "aria-haspopup": "dialog",
    "aria-expanded": context.open,
    "aria-controls": context.contentId,
    "data-state": getState(context.open),
    ...triggerProps,
    ref: composedTriggerRef,
    onClick: composeEventHandlers(props.onClick, context.onOpenToggle),
  });
});
DialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "DialogPortal";
var [PortalProvider, usePortalContext] = createDialogContext(PORTAL_NAME, {
  forceMount: void 0,
});
var DialogPortal$1 = (props) => {
  const { __scopeDialog, forceMount, children, container } = props;
  const context = useDialogContext(PORTAL_NAME, __scopeDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider, {
    scope: __scopeDialog,
    forceMount,
    children: reactExports.Children.map(children, (child) =>
      /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, {
        present: forceMount || context.open,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, {
          asChild: true,
          container,
          children: child,
        }),
      }),
    ),
  });
};
DialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "DialogOverlay";
var DialogOverlay$1 = reactExports.forwardRef((props, forwardedRef) => {
  const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog);
  const { forceMount = portalContext.forceMount, ...overlayProps } = props;
  const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
  return context.modal
    ? /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, {
        present: forceMount || context.open,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlayImpl, {
          ...overlayProps,
          ref: forwardedRef,
        }),
      })
    : null;
});
DialogOverlay$1.displayName = OVERLAY_NAME;
var Slot = createSlot("DialogOverlay.RemoveScroll");
var DialogOverlayImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeDialog, ...overlayProps } = props;
  const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
  return (
    // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
    // ie. when `Overlay` and `Content` are siblings
    /* @__PURE__ */ jsxRuntimeExports.jsx(ReactRemoveScroll, {
      as: Slot,
      allowPinchZoom: true,
      shards: [context.contentRef],
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, {
        "data-state": getState(context.open),
        ...overlayProps,
        ref: forwardedRef,
        style: { pointerEvents: "auto", ...overlayProps.style },
      }),
    })
  );
});
var CONTENT_NAME = "DialogContent";
var DialogContent$1 = reactExports.forwardRef((props, forwardedRef) => {
  const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog);
  const { forceMount = portalContext.forceMount, ...contentProps } = props;
  const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, {
    present: forceMount || context.open,
    children: context.modal
      ? /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentModal, {
          ...contentProps,
          ref: forwardedRef,
        })
      : /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentNonModal, {
          ...contentProps,
          ref: forwardedRef,
        }),
  });
});
DialogContent$1.displayName = CONTENT_NAME;
var DialogContentModal = reactExports.forwardRef((props, forwardedRef) => {
  const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
  const contentRef = reactExports.useRef(null);
  const composedRefs = useComposedRefs(
    forwardedRef,
    context.contentRef,
    contentRef,
  );
  reactExports.useEffect(() => {
    const content = contentRef.current;
    if (content) return hideOthers(content);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentImpl, {
    ...props,
    ref: composedRefs,
    trapFocus: context.open,
    disableOutsidePointerEvents: true,
    onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
      event.preventDefault();
      context.triggerRef.current?.focus();
    }),
    onPointerDownOutside: composeEventHandlers(
      props.onPointerDownOutside,
      (event) => {
        const originalEvent = event.detail.originalEvent;
        const ctrlLeftClick =
          originalEvent.button === 0 && originalEvent.ctrlKey === true;
        const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
        if (isRightClick) event.preventDefault();
      },
    ),
    onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) =>
      event.preventDefault(),
    ),
  });
});
var DialogContentNonModal = reactExports.forwardRef((props, forwardedRef) => {
  const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
  const hasInteractedOutsideRef = reactExports.useRef(false);
  const hasPointerDownOutsideRef = reactExports.useRef(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentImpl, {
    ...props,
    ref: forwardedRef,
    trapFocus: false,
    disableOutsidePointerEvents: false,
    onCloseAutoFocus: (event) => {
      props.onCloseAutoFocus?.(event);
      if (!event.defaultPrevented) {
        if (!hasInteractedOutsideRef.current)
          context.triggerRef.current?.focus();
        event.preventDefault();
      }
      hasInteractedOutsideRef.current = false;
      hasPointerDownOutsideRef.current = false;
    },
    onInteractOutside: (event) => {
      props.onInteractOutside?.(event);
      if (!event.defaultPrevented) {
        hasInteractedOutsideRef.current = true;
        if (event.detail.originalEvent.type === "pointerdown") {
          hasPointerDownOutsideRef.current = true;
        }
      }
      const target = event.target;
      const targetIsTrigger = context.triggerRef.current?.contains(target);
      if (targetIsTrigger) event.preventDefault();
      if (
        event.detail.originalEvent.type === "focusin" &&
        hasPointerDownOutsideRef.current
      ) {
        event.preventDefault();
      }
    },
  });
});
var DialogContentImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeDialog,
    trapFocus,
    onOpenAutoFocus,
    onCloseAutoFocus,
    ...contentProps
  } = props;
  const context = useDialogContext(CONTENT_NAME, __scopeDialog);
  const contentRef = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, contentRef);
  useFocusGuards();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FocusScope, {
        asChild: true,
        loop: true,
        trapped: trapFocus,
        onMountAutoFocus: onOpenAutoFocus,
        onUnmountAutoFocus: onCloseAutoFocus,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(DismissableLayer, {
          role: "dialog",
          id: context.contentId,
          "aria-describedby": context.descriptionId,
          "aria-labelledby": context.titleId,
          "data-state": getState(context.open),
          ...contentProps,
          ref: composedRefs,
          onDismiss: () => context.onOpenChange(false),
        }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TitleWarning, {
            titleId: context.titleId,
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, {
            contentRef,
            descriptionId: context.descriptionId,
          }),
        ],
      }),
    ],
  });
});
var TITLE_NAME = "DialogTitle";
var DialogTitle$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeDialog, ...titleProps } = props;
  const context = useDialogContext(TITLE_NAME, __scopeDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.h2, {
    id: context.titleId,
    ...titleProps,
    ref: forwardedRef,
  });
});
DialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "DialogDescription";
var DialogDescription$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeDialog, ...descriptionProps } = props;
  const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.p, {
    id: context.descriptionId,
    ...descriptionProps,
    ref: forwardedRef,
  });
});
DialogDescription$1.displayName = DESCRIPTION_NAME;
var CLOSE_NAME = "DialogClose";
var DialogClose = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeDialog, ...closeProps } = props;
  const context = useDialogContext(CLOSE_NAME, __scopeDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.button, {
    type: "button",
    ...closeProps,
    ref: forwardedRef,
    onClick: composeEventHandlers(props.onClick, () =>
      context.onOpenChange(false),
    ),
  });
});
DialogClose.displayName = CLOSE_NAME;
function getState(open) {
  return open ? "open" : "closed";
}
var TITLE_WARNING_NAME = "DialogTitleWarning";
var [WarningProvider, useWarningContext] = createContext2(TITLE_WARNING_NAME, {
  contentName: CONTENT_NAME,
  titleName: TITLE_NAME,
  docsSlug: "dialog",
});
var TitleWarning = ({ titleId }) => {
  const titleWarningContext = useWarningContext(TITLE_WARNING_NAME);
  const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`;
  reactExports.useEffect(() => {
    if (titleId) {
      const hasTitle = document.getElementById(titleId);
      if (!hasTitle) console.error(MESSAGE);
    }
  }, [MESSAGE, titleId]);
  return null;
};
var DESCRIPTION_WARNING_NAME = "DialogDescriptionWarning";
var DescriptionWarning = ({ contentRef, descriptionId }) => {
  const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME);
  const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`;
  reactExports.useEffect(() => {
    const describedById = contentRef.current?.getAttribute("aria-describedby");
    if (descriptionId && describedById) {
      const hasDescription = document.getElementById(descriptionId);
      if (!hasDescription) console.warn(MESSAGE);
    }
  }, [MESSAGE, contentRef, descriptionId]);
  return null;
};
var Root = Dialog$1;
var Portal = DialogPortal$1;
var Overlay = DialogOverlay$1;
var Content = DialogContent$1;
var Title = DialogTitle$1;
var Description = DialogDescription$1;
var Close = DialogClose;

const Dialog = Root;
const DialogPortal = Portal;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) =>
  /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    ),
    ...props,
  }),
);
DialogOverlay.displayName = Overlay.displayName;
const DialogContent = reactExports.forwardRef(
  ({ className, children, ...props }, ref) =>
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, {
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, {
          ref,
          className: cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
            className,
          ),
          ...props,
          children: [
            children,
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, {
              className:
                "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, {
                  className: "h-4 w-4",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                  className: "sr-only",
                  children: "Close",
                }),
              ],
            }),
          ],
        }),
      ],
    }),
);
DialogContent.displayName = Content.displayName;
const DialogHeader = ({ className, ...props }) =>
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    ),
    ...props,
  });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) =>
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    ),
    ...props,
  });
DialogFooter.displayName = "DialogFooter";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) =>
  /* @__PURE__ */ jsxRuntimeExports.jsx(Title, {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    ),
    ...props,
  }),
);
DialogTitle.displayName = Title.displayName;
const DialogDescription = reactExports.forwardRef(
  ({ className, ...props }, ref) =>
    /* @__PURE__ */ jsxRuntimeExports.jsx(Description, {
      ref,
      className: cn("text-sm text-muted-foreground", className),
      ...props,
    }),
);
DialogDescription.displayName = Description.displayName;

export {
  Content as C,
  Dialog as D,
  Overlay as O,
  Portal as P,
  Root as R,
  DialogContent as a,
  DialogHeader as b,
  DialogTitle as c,
  DialogDescription as d,
  DialogFooter as e,
};
