import {
  r as reactExports,
  j as jsxRuntimeExports,
  aM as React,
  aq as React$1,
  e as cn,
} from "./main-D54NVj6U.js";

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

// src/slot.tsx
// @__NO_SIDE_EFFECTS__
function createSlot$1(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone$1(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable$1);
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
function createSlotClone$1(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef$2(children);
      const props2 = mergeProps$1(slotProps, children.props);
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
var SLOTTABLE_IDENTIFIER$1 = Symbol("radix.slottable");
function isSlottable$1(child) {
  return (
    reactExports.isValidElement(child) &&
    typeof child.type === "function" &&
    "__radixId" in child.type &&
    child.type.__radixId === SLOTTABLE_IDENTIFIER$1
  );
}
function mergeProps$1(slotProps, childProps) {
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
function getElementRef$2(element) {
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
  const Slot = createSlot$1(`Primitive.${node}`);
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
      const childrenRef = getElementRef$1(children);
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

function createCollection(name) {
  const PROVIDER_NAME = name + "CollectionProvider";
  const [createCollectionContext, createCollectionScope] =
    createContextScope(PROVIDER_NAME);
  const [CollectionProviderImpl, useCollectionContext] =
    createCollectionContext(PROVIDER_NAME, {
      collectionRef: { current: null },
      itemMap: /* @__PURE__ */ new Map(),
    });
  const CollectionProvider = (props) => {
    const { scope, children } = props;
    const ref = React.useRef(null);
    const itemMap = React.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionProviderImpl, {
      scope,
      itemMap,
      collectionRef: ref,
      children,
    });
  };
  CollectionProvider.displayName = PROVIDER_NAME;
  const COLLECTION_SLOT_NAME = name + "CollectionSlot";
  const CollectionSlotImpl = createSlot(COLLECTION_SLOT_NAME);
  const CollectionSlot = React.forwardRef((props, forwardedRef) => {
    const { scope, children } = props;
    const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
    const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionSlotImpl, {
      ref: composedRefs,
      children,
    });
  });
  CollectionSlot.displayName = COLLECTION_SLOT_NAME;
  const ITEM_SLOT_NAME = name + "CollectionItemSlot";
  const ITEM_DATA_ATTR = "data-radix-collection-item";
  const CollectionItemSlotImpl = createSlot(ITEM_SLOT_NAME);
  const CollectionItemSlot = React.forwardRef((props, forwardedRef) => {
    const { scope, children, ...itemData } = props;
    const ref = React.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const context = useCollectionContext(ITEM_SLOT_NAME, scope);
    React.useEffect(() => {
      context.itemMap.set(ref, { ref, ...itemData });
      return () => void context.itemMap.delete(ref);
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionItemSlotImpl, {
      ...{ [ITEM_DATA_ATTR]: "" },
      ref: composedRefs,
      children,
    });
  });
  CollectionItemSlot.displayName = ITEM_SLOT_NAME;
  function useCollection(scope) {
    const context = useCollectionContext(name + "CollectionConsumer", scope);
    const getItems = React.useCallback(() => {
      const collectionNode = context.collectionRef.current;
      if (!collectionNode) return [];
      const orderedNodes = Array.from(
        collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`),
      );
      const items = Array.from(context.itemMap.values());
      const orderedItems = items.sort(
        (a, b) =>
          orderedNodes.indexOf(a.ref.current) -
          orderedNodes.indexOf(b.ref.current),
      );
      return orderedItems;
    }, [context.collectionRef, context.itemMap]);
    return getItems;
  }
  return [
    {
      Provider: CollectionProvider,
      Slot: CollectionSlot,
      ItemSlot: CollectionItemSlot,
    },
    useCollection,
    createCollectionScope,
  ];
}

// packages/react/use-layout-effect/src/use-layout-effect.tsx
var useLayoutEffect2$3 = globalThis?.document
  ? reactExports.useLayoutEffect
  : () => {};

// packages/react/id/src/id.tsx
var useReactId = React$1[" useId ".trim().toString()] || (() => void 0);
var count = 0;
function useId(deterministicId) {
  const [id, setId] = reactExports.useState(useReactId());
  useLayoutEffect2$3(() => {
    setId((reactId) => reactId ?? String(count++));
  }, [deterministicId]);
  return id ? `radix-${id}` : "";
}

// packages/react/use-callback-ref/src/use-callback-ref.tsx
function useCallbackRef(callback) {
  const callbackRef = reactExports.useRef(callback);
  reactExports.useEffect(() => {
    callbackRef.current = callback;
  });
  return reactExports.useMemo(
    () =>
      (...args) =>
        callbackRef.current?.(...args),
    [],
  );
}

// packages/react/use-layout-effect/src/use-layout-effect.tsx
var useLayoutEffect2$2 = globalThis?.document
  ? reactExports.useLayoutEffect
  : () => {};

// src/use-controllable-state.tsx
var useInsertionEffect =
  React$1[" useInsertionEffect ".trim().toString()] || useLayoutEffect2$2;
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

// packages/react/direction/src/direction.tsx
var DirectionContext = reactExports.createContext(void 0);
function useDirection(localDir) {
  const globalDir = reactExports.useContext(DirectionContext);
  return localDir || globalDir || "ltr";
}

var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] =
  createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] =
  createContextScope(GROUP_NAME, [createCollectionScope]);
var [RovingFocusProvider, useRovingFocusContext] =
  createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, {
    scope: props.__scopeRovingFocusGroup,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, {
      scope: props.__scopeRovingFocusGroup,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, {
        ...props,
        ref: forwardedRef,
      }),
    }),
  });
});
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME,
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = reactExports.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection(__scopeRovingFocusGroup);
  const isClickFocusRef = reactExports.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] =
    reactExports.useState(0);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusProvider, {
    scope: __scopeRovingFocusGroup,
    orientation,
    dir: direction,
    loop,
    currentTabStopId,
    onItemFocus: reactExports.useCallback(
      (tabStopId) => setCurrentTabStopId(tabStopId),
      [setCurrentTabStopId],
    ),
    onItemShiftTab: reactExports.useCallback(
      () => setIsTabbingBackOut(true),
      [],
    ),
    onFocusableItemAdd: reactExports.useCallback(
      () => setFocusableItemsCount((prevCount) => prevCount + 1),
      [],
    ),
    onFocusableItemRemove: reactExports.useCallback(
      () => setFocusableItemsCount((prevCount) => prevCount - 1),
      [],
    ),
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, {
      tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
      "data-orientation": orientation,
      ...groupProps,
      ref: composedRefs,
      style: { outline: "none", ...props.style },
      onMouseDown: composeEventHandlers(props.onMouseDown, () => {
        isClickFocusRef.current = true;
      }),
      onFocus: composeEventHandlers(props.onFocus, (event) => {
        const isKeyboardFocus = !isClickFocusRef.current;
        if (
          event.target === event.currentTarget &&
          isKeyboardFocus &&
          !isTabbingBackOut
        ) {
          const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
          event.currentTarget.dispatchEvent(entryFocusEvent);
          if (!entryFocusEvent.defaultPrevented) {
            const items = getItems().filter((item) => item.focusable);
            const activeItem = items.find((item) => item.active);
            const currentItem = items.find(
              (item) => item.id === currentTabStopId,
            );
            const candidateItems = [activeItem, currentItem, ...items].filter(
              Boolean,
            );
            const candidateNodes = candidateItems.map(
              (item) => item.ref.current,
            );
            focusFirst(candidateNodes, preventScrollOnEntryFocus);
          }
        }
        isClickFocusRef.current = false;
      }),
      onBlur: composeEventHandlers(props.onBlur, () =>
        setIsTabbingBackOut(false),
      ),
    }),
  });
});
var ITEM_NAME$1 = "RovingFocusGroupItem";
var RovingFocusGroupItem = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    focusable = true,
    active = false,
    tabStopId,
    children,
    ...itemProps
  } = props;
  const autoId = useId();
  const id = tabStopId || autoId;
  const context = useRovingFocusContext(ITEM_NAME$1, __scopeRovingFocusGroup);
  const isCurrentTabStop = context.currentTabStopId === id;
  const getItems = useCollection(__scopeRovingFocusGroup);
  const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } =
    context;
  reactExports.useEffect(() => {
    if (focusable) {
      onFocusableItemAdd();
      return () => onFocusableItemRemove();
    }
  }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.ItemSlot, {
    scope: __scopeRovingFocusGroup,
    id,
    focusable,
    active,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, {
      tabIndex: isCurrentTabStop ? 0 : -1,
      "data-orientation": context.orientation,
      ...itemProps,
      ref: forwardedRef,
      onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
        if (!focusable) event.preventDefault();
        else context.onItemFocus(id);
      }),
      onFocus: composeEventHandlers(props.onFocus, () =>
        context.onItemFocus(id),
      ),
      onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
        if (event.key === "Tab" && event.shiftKey) {
          context.onItemShiftTab();
          return;
        }
        if (event.target !== event.currentTarget) return;
        const focusIntent = getFocusIntent(
          event,
          context.orientation,
          context.dir,
        );
        if (focusIntent !== void 0) {
          if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
            return;
          event.preventDefault();
          const items = getItems().filter((item) => item.focusable);
          let candidateNodes = items.map((item) => item.ref.current);
          if (focusIntent === "last") candidateNodes.reverse();
          else if (focusIntent === "prev" || focusIntent === "next") {
            if (focusIntent === "prev") candidateNodes.reverse();
            const currentIndex = candidateNodes.indexOf(event.currentTarget);
            candidateNodes = context.loop
              ? wrapArray(candidateNodes, currentIndex + 1)
              : candidateNodes.slice(currentIndex + 1);
          }
          setTimeout(() => focusFirst(candidateNodes));
        }
      }),
      children:
        typeof children === "function"
          ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null })
          : children,
    }),
  });
});
RovingFocusGroupItem.displayName = ITEM_NAME$1;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last",
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft"
    ? "ArrowRight"
    : key === "ArrowRight"
      ? "ArrowLeft"
      : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key))
    return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key))
    return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;

// packages/react/use-layout-effect/src/use-layout-effect.tsx
var useLayoutEffect2$1 = globalThis?.document
  ? reactExports.useLayoutEffect
  : () => {};

// packages/react/use-size/src/use-size.tsx
function useSize(element) {
  const [size, setSize] = reactExports.useState(void 0);
  useLayoutEffect2$1(() => {
    if (element) {
      setSize({ width: element.offsetWidth, height: element.offsetHeight });
      const resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries)) {
          return;
        }
        if (!entries.length) {
          return;
        }
        const entry = entries[0];
        let width;
        let height;
        if ("borderBoxSize" in entry) {
          const borderSizeEntry = entry["borderBoxSize"];
          const borderSize = Array.isArray(borderSizeEntry)
            ? borderSizeEntry[0]
            : borderSizeEntry;
          width = borderSize["inlineSize"];
          height = borderSize["blockSize"];
        } else {
          width = element.offsetWidth;
          height = element.offsetHeight;
        }
        setSize({ width, height });
      });
      resizeObserver.observe(element, { box: "border-box" });
      return () => resizeObserver.unobserve(element);
    } else {
      setSize(void 0);
    }
  }, [element]);
  return size;
}

// packages/react/use-previous/src/use-previous.tsx
function usePrevious(value) {
  const ref = reactExports.useRef({ value, previous: value });
  return reactExports.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
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
  const ref = useComposedRefs(presence.ref, getElementRef(child));
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

var RADIO_NAME = "Radio";
var [createRadioContext, createRadioScope] = createContextScope(RADIO_NAME);
var [RadioProvider, useRadioContext] = createRadioContext(RADIO_NAME);
var Radio = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRadio,
    name,
    checked = false,
    required,
    disabled,
    value = "on",
    onCheck,
    form,
    ...radioProps
  } = props;
  const [button, setButton] = reactExports.useState(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
  const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
  const isFormControl = button ? form || !!button.closest("form") : true;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(RadioProvider, {
    scope: __scopeRadio,
    checked,
    disabled,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.button, {
        type: "button",
        role: "radio",
        "aria-checked": checked,
        "data-state": getState(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...radioProps,
        ref: composedRefs,
        onClick: composeEventHandlers(props.onClick, (event) => {
          if (!checked) onCheck?.();
          if (isFormControl) {
            hasConsumerStoppedPropagationRef.current =
              event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current)
              event.stopPropagation();
          }
        }),
      }),
      isFormControl &&
        /* @__PURE__ */ jsxRuntimeExports.jsx(RadioBubbleInput, {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" },
        }),
    ],
  });
});
Radio.displayName = RADIO_NAME;
var INDICATOR_NAME = "RadioIndicator";
var RadioIndicator = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeRadio, forceMount, ...indicatorProps } = props;
  const context = useRadioContext(INDICATOR_NAME, __scopeRadio);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, {
    present: forceMount || context.checked,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, {
      "data-state": getState(context.checked),
      "data-disabled": context.disabled ? "" : void 0,
      ...indicatorProps,
      ref: forwardedRef,
    }),
  });
});
RadioIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "RadioBubbleInput";
var RadioBubbleInput = reactExports.forwardRef(
  (
    { __scopeRadio, control, checked, bubbles = true, ...props },
    forwardedRef,
  ) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(inputProto, "checked");
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.input, {
      type: "radio",
      "aria-hidden": true,
      defaultChecked: checked,
      ...props,
      tabIndex: -1,
      ref: composedRefs,
      style: {
        ...props.style,
        ...controlSize,
        position: "absolute",
        pointerEvents: "none",
        opacity: 0,
        margin: 0,
      },
    });
  },
);
RadioBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
var RADIO_GROUP_NAME = "RadioGroup";
var [createRadioGroupContext, createRadioGroupScope] = createContextScope(
  RADIO_GROUP_NAME,
  [createRovingFocusGroupScope, createRadioScope],
);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var useRadioScope = createRadioScope();
var [RadioGroupProvider, useRadioGroupContext] =
  createRadioGroupContext(RADIO_GROUP_NAME);
var RadioGroup$1 = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRadioGroup,
    name,
    defaultValue,
    value: valueProp,
    required = false,
    disabled = false,
    orientation,
    dir,
    loop = true,
    onValueChange,
    ...groupProps
  } = props;
  const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
  const direction = useDirection(dir);
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? null,
    onChange: onValueChange,
    caller: RADIO_GROUP_NAME,
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupProvider, {
    scope: __scopeRadioGroup,
    name,
    required,
    disabled,
    value,
    onValueChange: setValue,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Root, {
      asChild: true,
      ...rovingFocusGroupScope,
      orientation,
      dir: direction,
      loop,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, {
        role: "radiogroup",
        "aria-required": required,
        "aria-orientation": orientation,
        "data-disabled": disabled ? "" : void 0,
        dir: direction,
        ...groupProps,
        ref: forwardedRef,
      }),
    }),
  });
});
RadioGroup$1.displayName = RADIO_GROUP_NAME;
var ITEM_NAME = "RadioGroupItem";
var RadioGroupItem$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeRadioGroup, disabled, ...itemProps } = props;
  const context = useRadioGroupContext(ITEM_NAME, __scopeRadioGroup);
  const isDisabled = context.disabled || disabled;
  const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
  const radioScope = useRadioScope(__scopeRadioGroup);
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const checked = context.value === itemProps.value;
  const isArrowKeyPressedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    const handleKeyDown = (event) => {
      if (ARROW_KEYS.includes(event.key)) {
        isArrowKeyPressedRef.current = true;
      }
    };
    const handleKeyUp = () => (isArrowKeyPressedRef.current = false);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Item, {
    asChild: true,
    ...rovingFocusGroupScope,
    focusable: !isDisabled,
    active: checked,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, {
      disabled: isDisabled,
      required: context.required,
      checked,
      ...radioScope,
      ...itemProps,
      name: context.name,
      ref: composedRefs,
      onCheck: () => context.onValueChange(itemProps.value),
      onKeyDown: composeEventHandlers((event) => {
        if (event.key === "Enter") event.preventDefault();
      }),
      onFocus: composeEventHandlers(itemProps.onFocus, () => {
        if (isArrowKeyPressedRef.current) ref.current?.click();
      }),
    }),
  });
});
RadioGroupItem$1.displayName = ITEM_NAME;
var INDICATOR_NAME2 = "RadioGroupIndicator";
var RadioGroupIndicator = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeRadioGroup, ...indicatorProps } = props;
  const radioScope = useRadioScope(__scopeRadioGroup);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioIndicator, {
    ...radioScope,
    ...indicatorProps,
    ref: forwardedRef,
  });
});
RadioGroupIndicator.displayName = INDICATOR_NAME2;
var Root2 = RadioGroup$1;
var Item2 = RadioGroupItem$1;
var Indicator = RadioGroupIndicator;

const RadioGroup = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, {
    className: cn("grid gap-2", className),
    ...props,
    ref,
  });
});
RadioGroup.displayName = Root2.displayName;
const RadioGroupItem = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Item2, {
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Indicator, {
        className: "flex items-center justify-center",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "h-2.5 w-2.5 rounded-full bg-current",
        }),
      }),
    });
  },
);
RadioGroupItem.displayName = Item2.displayName;

export { RadioGroup as R, RadioGroupItem as a };
