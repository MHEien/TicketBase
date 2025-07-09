import {
  c as createLucideIcon,
  a9 as useCallbackRef,
  r as reactExports,
  x as useComposedRefs,
  j as jsxRuntimeExports,
  P as Primitive,
  w as composeEventHandlers,
  aa as dispatchDiscreteCustomEvent,
  ab as useLayoutEffect2,
  ac as ReactDOM,
  q as createContextScope,
  p as useControllableState,
  d as useId,
  ad as createContext2,
  ae as Presence,
  af as hideOthers,
  ag as ReactRemoveScroll,
  ah as Slot,
  ai as Slottable,
  e as cn,
  aj as buttonVariants,
  a as useRouter,
  u as useSession,
  ak as getDepartments,
  a8 as toast,
  B as Button,
  al as Link,
  I as Input,
  T as Card,
  _ as CardContent,
  b as Badge,
  am as deleteDepartment,
} from "./main-D54NVj6U.js";
import {
  T as Table,
  a as TableHeader,
  b as TableRow,
  c as TableHead,
  d as TableBody,
  e as TableCell,
} from "./table-DDJ6ebWY.js";
import {
  D as DropdownMenu,
  a as DropdownMenuTrigger,
  b as DropdownMenuContent,
  c as DropdownMenuLabel,
  e as DropdownMenuItem,
  d as DropdownMenuSeparator,
} from "./dropdown-menu-Cc3wlmA0.js";
import { P as Plus } from "./plus-CY3SNhnW.js";
import { S as Search } from "./search-BS6yzFHd.js";
import { U as Users } from "./users-DGvlZmP3.js";
import { P as Pencil } from "./pencil-Cjqq7VRy.js";
import { T as Trash2 } from "./trash-2-N6yWrD4G.js";
import "./index-DACOVT_t.js";
import "./chevron-right-VQ7fFc8Y.js";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const FolderTree = createLucideIcon("FolderTree", [
  [
    "path",
    {
      d: "M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z",
      key: "hod4my",
    },
  ],
  [
    "path",
    {
      d: "M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z",
      key: "w4yl2u",
    },
  ],
  ["path", { d: "M3 5a2 2 0 0 0 2 2h3", key: "f2jnh7" }],
  ["path", { d: "M3 3v13a2 2 0 0 0 2 2h3", key: "k8epm1" }],
]);

// packages/react/use-escape-keydown/src/useEscapeKeydown.tsx
function useEscapeKeydown(
  onEscapeKeyDownProp,
  ownerDocument = globalThis?.document,
) {
  const onEscapeKeyDown = useCallbackRef(onEscapeKeyDownProp);
  reactExports.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onEscapeKeyDown(event);
      }
    };
    ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      ownerDocument.removeEventListener("keydown", handleKeyDown, {
        capture: true,
      });
  }, [onEscapeKeyDown, ownerDocument]);
}

var DISMISSABLE_LAYER_NAME = "DismissableLayer";
var CONTEXT_UPDATE = "dismissableLayer.update";
var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
var originalBodyPointerEvents;
var DismissableLayerContext = reactExports.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set(),
});
var DismissableLayer = reactExports.forwardRef((props, forwardedRef) => {
  const {
    disableOutsidePointerEvents = false,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    onDismiss,
    ...layerProps
  } = props;
  const context = reactExports.useContext(DismissableLayerContext);
  const [node, setNode] = reactExports.useState(null);
  const ownerDocument = node?.ownerDocument ?? globalThis?.document;
  const [, force] = reactExports.useState({});
  const composedRefs = useComposedRefs(forwardedRef, (node2) => setNode(node2));
  const layers = Array.from(context.layers);
  const [highestLayerWithOutsidePointerEventsDisabled] = [
    ...context.layersWithOutsidePointerEventsDisabled,
  ].slice(-1);
  const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(
    highestLayerWithOutsidePointerEventsDisabled,
  );
  const index = node ? layers.indexOf(node) : -1;
  const isBodyPointerEventsDisabled =
    context.layersWithOutsidePointerEventsDisabled.size > 0;
  const isPointerEventsEnabled =
    index >= highestLayerWithOutsidePointerEventsDisabledIndex;
  const pointerDownOutside = usePointerDownOutside((event) => {
    const target = event.target;
    const isPointerDownOnBranch = [...context.branches].some((branch) =>
      branch.contains(target),
    );
    if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
    onPointerDownOutside?.(event);
    onInteractOutside?.(event);
    if (!event.defaultPrevented) onDismiss?.();
  }, ownerDocument);
  const focusOutside = useFocusOutside((event) => {
    const target = event.target;
    const isFocusInBranch = [...context.branches].some((branch) =>
      branch.contains(target),
    );
    if (isFocusInBranch) return;
    onFocusOutside?.(event);
    onInteractOutside?.(event);
    if (!event.defaultPrevented) onDismiss?.();
  }, ownerDocument);
  useEscapeKeydown((event) => {
    const isHighestLayer = index === context.layers.size - 1;
    if (!isHighestLayer) return;
    onEscapeKeyDown?.(event);
    if (!event.defaultPrevented && onDismiss) {
      event.preventDefault();
      onDismiss();
    }
  }, ownerDocument);
  reactExports.useEffect(() => {
    if (!node) return;
    if (disableOutsidePointerEvents) {
      if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
        originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
        ownerDocument.body.style.pointerEvents = "none";
      }
      context.layersWithOutsidePointerEventsDisabled.add(node);
    }
    context.layers.add(node);
    dispatchUpdate();
    return () => {
      if (
        disableOutsidePointerEvents &&
        context.layersWithOutsidePointerEventsDisabled.size === 1
      ) {
        ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
      }
    };
  }, [node, ownerDocument, disableOutsidePointerEvents, context]);
  reactExports.useEffect(() => {
    return () => {
      if (!node) return;
      context.layers.delete(node);
      context.layersWithOutsidePointerEventsDisabled.delete(node);
      dispatchUpdate();
    };
  }, [node, context]);
  reactExports.useEffect(() => {
    const handleUpdate = () => force({});
    document.addEventListener(CONTEXT_UPDATE, handleUpdate);
    return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, {
    ...layerProps,
    ref: composedRefs,
    style: {
      pointerEvents: isBodyPointerEventsDisabled
        ? isPointerEventsEnabled
          ? "auto"
          : "none"
        : void 0,
      ...props.style,
    },
    onFocusCapture: composeEventHandlers(
      props.onFocusCapture,
      focusOutside.onFocusCapture,
    ),
    onBlurCapture: composeEventHandlers(
      props.onBlurCapture,
      focusOutside.onBlurCapture,
    ),
    onPointerDownCapture: composeEventHandlers(
      props.onPointerDownCapture,
      pointerDownOutside.onPointerDownCapture,
    ),
  });
});
DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;
var BRANCH_NAME = "DismissableLayerBranch";
var DismissableLayerBranch = reactExports.forwardRef((props, forwardedRef) => {
  const context = reactExports.useContext(DismissableLayerContext);
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      context.branches.add(node);
      return () => {
        context.branches.delete(node);
      };
    }
  }, [context.branches]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, {
    ...props,
    ref: composedRefs,
  });
});
DismissableLayerBranch.displayName = BRANCH_NAME;
function usePointerDownOutside(
  onPointerDownOutside,
  ownerDocument = globalThis?.document,
) {
  const handlePointerDownOutside = useCallbackRef(onPointerDownOutside);
  const isPointerInsideReactTreeRef = reactExports.useRef(false);
  const handleClickRef = reactExports.useRef(() => {});
  reactExports.useEffect(() => {
    const handlePointerDown = (event) => {
      if (event.target && !isPointerInsideReactTreeRef.current) {
        let handleAndDispatchPointerDownOutsideEvent2 = function () {
          handleAndDispatchCustomEvent(
            POINTER_DOWN_OUTSIDE,
            handlePointerDownOutside,
            eventDetail,
            { discrete: true },
          );
        };
        const eventDetail = { originalEvent: event };
        if (event.pointerType === "touch") {
          ownerDocument.removeEventListener("click", handleClickRef.current);
          handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
          ownerDocument.addEventListener("click", handleClickRef.current, {
            once: true,
          });
        } else {
          handleAndDispatchPointerDownOutsideEvent2();
        }
      } else {
        ownerDocument.removeEventListener("click", handleClickRef.current);
      }
      isPointerInsideReactTreeRef.current = false;
    };
    const timerId = window.setTimeout(() => {
      ownerDocument.addEventListener("pointerdown", handlePointerDown);
    }, 0);
    return () => {
      window.clearTimeout(timerId);
      ownerDocument.removeEventListener("pointerdown", handlePointerDown);
      ownerDocument.removeEventListener("click", handleClickRef.current);
    };
  }, [ownerDocument, handlePointerDownOutside]);
  return {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => (isPointerInsideReactTreeRef.current = true),
  };
}
function useFocusOutside(onFocusOutside, ownerDocument = globalThis?.document) {
  const handleFocusOutside = useCallbackRef(onFocusOutside);
  const isFocusInsideReactTreeRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    const handleFocus = (event) => {
      if (event.target && !isFocusInsideReactTreeRef.current) {
        const eventDetail = { originalEvent: event };
        handleAndDispatchCustomEvent(
          FOCUS_OUTSIDE,
          handleFocusOutside,
          eventDetail,
          {
            discrete: false,
          },
        );
      }
    };
    ownerDocument.addEventListener("focusin", handleFocus);
    return () => ownerDocument.removeEventListener("focusin", handleFocus);
  }, [ownerDocument, handleFocusOutside]);
  return {
    onFocusCapture: () => (isFocusInsideReactTreeRef.current = true),
    onBlurCapture: () => (isFocusInsideReactTreeRef.current = false),
  };
}
function dispatchUpdate() {
  const event = new CustomEvent(CONTEXT_UPDATE);
  document.dispatchEvent(event);
}
function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
  const target = detail.originalEvent.target;
  const event = new CustomEvent(name, {
    bubbles: false,
    cancelable: true,
    detail,
  });
  if (handler) target.addEventListener(name, handler, { once: true });
  if (discrete) {
    dispatchDiscreteCustomEvent(target, event);
  } else {
    target.dispatchEvent(event);
  }
}

var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var FOCUS_SCOPE_NAME = "FocusScope";
var FocusScope = reactExports.forwardRef((props, forwardedRef) => {
  const {
    loop = false,
    trapped = false,
    onMountAutoFocus: onMountAutoFocusProp,
    onUnmountAutoFocus: onUnmountAutoFocusProp,
    ...scopeProps
  } = props;
  const [container, setContainer] = reactExports.useState(null);
  const onMountAutoFocus = useCallbackRef(onMountAutoFocusProp);
  const onUnmountAutoFocus = useCallbackRef(onUnmountAutoFocusProp);
  const lastFocusedElementRef = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) =>
    setContainer(node),
  );
  const focusScope = reactExports.useRef({
    paused: false,
    pause() {
      this.paused = true;
    },
    resume() {
      this.paused = false;
    },
  }).current;
  reactExports.useEffect(() => {
    if (trapped) {
      let handleFocusIn2 = function (event) {
          if (focusScope.paused || !container) return;
          const target = event.target;
          if (container.contains(target)) {
            lastFocusedElementRef.current = target;
          } else {
            focus(lastFocusedElementRef.current, { select: true });
          }
        },
        handleFocusOut2 = function (event) {
          if (focusScope.paused || !container) return;
          const relatedTarget = event.relatedTarget;
          if (relatedTarget === null) return;
          if (!container.contains(relatedTarget)) {
            focus(lastFocusedElementRef.current, { select: true });
          }
        },
        handleMutations2 = function (mutations) {
          const focusedElement = document.activeElement;
          if (focusedElement !== document.body) return;
          for (const mutation of mutations) {
            if (mutation.removedNodes.length > 0) focus(container);
          }
        };
      document.addEventListener("focusin", handleFocusIn2);
      document.addEventListener("focusout", handleFocusOut2);
      const mutationObserver = new MutationObserver(handleMutations2);
      if (container)
        mutationObserver.observe(container, { childList: true, subtree: true });
      return () => {
        document.removeEventListener("focusin", handleFocusIn2);
        document.removeEventListener("focusout", handleFocusOut2);
        mutationObserver.disconnect();
      };
    }
  }, [trapped, container, focusScope.paused]);
  reactExports.useEffect(() => {
    if (container) {
      focusScopesStack.add(focusScope);
      const previouslyFocusedElement = document.activeElement;
      const hasFocusedCandidate = container.contains(previouslyFocusedElement);
      if (!hasFocusedCandidate) {
        const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
        container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
        container.dispatchEvent(mountEvent);
        if (!mountEvent.defaultPrevented) {
          focusFirst(removeLinks(getTabbableCandidates(container)), {
            select: true,
          });
          if (document.activeElement === previouslyFocusedElement) {
            focus(container);
          }
        }
      }
      return () => {
        container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
        setTimeout(() => {
          const unmountEvent = new CustomEvent(
            AUTOFOCUS_ON_UNMOUNT,
            EVENT_OPTIONS,
          );
          container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
          container.dispatchEvent(unmountEvent);
          if (!unmountEvent.defaultPrevented) {
            focus(previouslyFocusedElement ?? document.body, { select: true });
          }
          container.removeEventListener(
            AUTOFOCUS_ON_UNMOUNT,
            onUnmountAutoFocus,
          );
          focusScopesStack.remove(focusScope);
        }, 0);
      };
    }
  }, [container, onMountAutoFocus, onUnmountAutoFocus, focusScope]);
  const handleKeyDown = reactExports.useCallback(
    (event) => {
      if (!loop && !trapped) return;
      if (focusScope.paused) return;
      const isTabKey =
        event.key === "Tab" &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey;
      const focusedElement = document.activeElement;
      if (isTabKey && focusedElement) {
        const container2 = event.currentTarget;
        const [first, last] = getTabbableEdges(container2);
        const hasTabbableElementsInside = first && last;
        if (!hasTabbableElementsInside) {
          if (focusedElement === container2) event.preventDefault();
        } else {
          if (!event.shiftKey && focusedElement === last) {
            event.preventDefault();
            if (loop) focus(first, { select: true });
          } else if (event.shiftKey && focusedElement === first) {
            event.preventDefault();
            if (loop) focus(last, { select: true });
          }
        }
      }
    },
    [loop, trapped, focusScope.paused],
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, {
    tabIndex: -1,
    ...scopeProps,
    ref: composedRefs,
    onKeyDown: handleKeyDown,
  });
});
FocusScope.displayName = FOCUS_SCOPE_NAME;
function focusFirst(candidates, { select = false } = {}) {
  const previouslyFocusedElement = document.activeElement;
  for (const candidate of candidates) {
    focus(candidate, { select });
    if (document.activeElement !== previouslyFocusedElement) return;
  }
}
function getTabbableEdges(container) {
  const candidates = getTabbableCandidates(container);
  const first = findVisible(candidates, container);
  const last = findVisible(candidates.reverse(), container);
  return [first, last];
}
function getTabbableCandidates(container) {
  const nodes = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
      if (node.disabled || node.hidden || isHiddenInput)
        return NodeFilter.FILTER_SKIP;
      return node.tabIndex >= 0
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP;
    },
  });
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}
function findVisible(elements, container) {
  for (const element of elements) {
    if (!isHidden(element, { upTo: container })) return element;
  }
}
function isHidden(node, { upTo }) {
  if (getComputedStyle(node).visibility === "hidden") return true;
  while (node) {
    if (upTo !== void 0 && node === upTo) return false;
    if (getComputedStyle(node).display === "none") return true;
    node = node.parentElement;
  }
  return false;
}
function isSelectableInput(element) {
  return element instanceof HTMLInputElement && "select" in element;
}
function focus(element, { select = false } = {}) {
  if (element && element.focus) {
    const previouslyFocusedElement = document.activeElement;
    element.focus({ preventScroll: true });
    if (
      element !== previouslyFocusedElement &&
      isSelectableInput(element) &&
      select
    )
      element.select();
  }
}
var focusScopesStack = createFocusScopesStack();
function createFocusScopesStack() {
  let stack = [];
  return {
    add(focusScope) {
      const activeFocusScope = stack[0];
      if (focusScope !== activeFocusScope) {
        activeFocusScope?.pause();
      }
      stack = arrayRemove(stack, focusScope);
      stack.unshift(focusScope);
    },
    remove(focusScope) {
      stack = arrayRemove(stack, focusScope);
      stack[0]?.resume();
    },
  };
}
function arrayRemove(array, item) {
  const updatedArray = [...array];
  const index = updatedArray.indexOf(item);
  if (index !== -1) {
    updatedArray.splice(index, 1);
  }
  return updatedArray;
}
function removeLinks(items) {
  return items.filter((item) => item.tagName !== "A");
}

var PORTAL_NAME$2 = "Portal";
var Portal$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { container: containerProp, ...portalProps } = props;
  const [mounted, setMounted] = reactExports.useState(false);
  useLayoutEffect2(() => setMounted(true), []);
  const container = containerProp || (mounted && globalThis?.document?.body);
  return container
    ? ReactDOM.createPortal(
        /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, {
          ...portalProps,
          ref: forwardedRef,
        }),
        container,
      )
    : null;
});
Portal$1.displayName = PORTAL_NAME$2;

var count = 0;
function useFocusGuards() {
  reactExports.useEffect(() => {
    const edgeGuards = document.querySelectorAll("[data-radix-focus-guard]");
    document.body.insertAdjacentElement(
      "afterbegin",
      edgeGuards[0] ?? createFocusGuard(),
    );
    document.body.insertAdjacentElement(
      "beforeend",
      edgeGuards[1] ?? createFocusGuard(),
    );
    count++;
    return () => {
      if (count === 1) {
        document
          .querySelectorAll("[data-radix-focus-guard]")
          .forEach((node) => node.remove());
      }
      count--;
    };
  }, []);
}
function createFocusGuard() {
  const element = document.createElement("span");
  element.setAttribute("data-radix-focus-guard", "");
  element.tabIndex = 0;
  element.style.outline = "none";
  element.style.opacity = "0";
  element.style.position = "fixed";
  element.style.pointerEvents = "none";
  return element;
}

var DIALOG_NAME = "Dialog";
var [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog = (props) => {
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
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
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
Dialog.displayName = DIALOG_NAME;
var TRIGGER_NAME$1 = "DialogTrigger";
var DialogTrigger = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeDialog, ...triggerProps } = props;
  const context = useDialogContext(TRIGGER_NAME$1, __scopeDialog);
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
DialogTrigger.displayName = TRIGGER_NAME$1;
var PORTAL_NAME$1 = "DialogPortal";
var [PortalProvider, usePortalContext] = createDialogContext(PORTAL_NAME$1, {
  forceMount: void 0,
});
var DialogPortal = (props) => {
  const { __scopeDialog, forceMount, children, container } = props;
  const context = useDialogContext(PORTAL_NAME$1, __scopeDialog);
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
DialogPortal.displayName = PORTAL_NAME$1;
var OVERLAY_NAME$1 = "DialogOverlay";
var DialogOverlay = reactExports.forwardRef((props, forwardedRef) => {
  const portalContext = usePortalContext(OVERLAY_NAME$1, props.__scopeDialog);
  const { forceMount = portalContext.forceMount, ...overlayProps } = props;
  const context = useDialogContext(OVERLAY_NAME$1, props.__scopeDialog);
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
DialogOverlay.displayName = OVERLAY_NAME$1;
var DialogOverlayImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeDialog, ...overlayProps } = props;
  const context = useDialogContext(OVERLAY_NAME$1, __scopeDialog);
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
var CONTENT_NAME$1 = "DialogContent";
var DialogContent = reactExports.forwardRef((props, forwardedRef) => {
  const portalContext = usePortalContext(CONTENT_NAME$1, props.__scopeDialog);
  const { forceMount = portalContext.forceMount, ...contentProps } = props;
  const context = useDialogContext(CONTENT_NAME$1, props.__scopeDialog);
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
DialogContent.displayName = CONTENT_NAME$1;
var DialogContentModal = reactExports.forwardRef((props, forwardedRef) => {
  const context = useDialogContext(CONTENT_NAME$1, props.__scopeDialog);
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
  const context = useDialogContext(CONTENT_NAME$1, props.__scopeDialog);
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
  const context = useDialogContext(CONTENT_NAME$1, __scopeDialog);
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning$1, {
            contentRef,
            descriptionId: context.descriptionId,
          }),
        ],
      }),
    ],
  });
});
var TITLE_NAME$1 = "DialogTitle";
var DialogTitle = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeDialog, ...titleProps } = props;
  const context = useDialogContext(TITLE_NAME$1, __scopeDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.h2, {
    id: context.titleId,
    ...titleProps,
    ref: forwardedRef,
  });
});
DialogTitle.displayName = TITLE_NAME$1;
var DESCRIPTION_NAME$1 = "DialogDescription";
var DialogDescription = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeDialog, ...descriptionProps } = props;
  const context = useDialogContext(DESCRIPTION_NAME$1, __scopeDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.p, {
    id: context.descriptionId,
    ...descriptionProps,
    ref: forwardedRef,
  });
});
DialogDescription.displayName = DESCRIPTION_NAME$1;
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
  contentName: CONTENT_NAME$1,
  titleName: TITLE_NAME$1,
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
var DescriptionWarning$1 = ({ contentRef, descriptionId }) => {
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
var Root = Dialog;
var Trigger = DialogTrigger;
var Portal = DialogPortal;
var Overlay = DialogOverlay;
var Content = DialogContent;
var Title = DialogTitle;
var Description = DialogDescription;
var Close = DialogClose;

var ROOT_NAME = "AlertDialog";
var [createAlertDialogContext, createAlertDialogScope] = createContextScope(
  ROOT_NAME,
  [createDialogScope],
);
var useDialogScope = createDialogScope();
var AlertDialog$1 = (props) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, {
    ...dialogScope,
    ...alertDialogProps,
    modal: true,
  });
};
AlertDialog$1.displayName = ROOT_NAME;
var TRIGGER_NAME = "AlertDialogTrigger";
var AlertDialogTrigger$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...triggerProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, {
    ...dialogScope,
    ...triggerProps,
    ref: forwardedRef,
  });
});
AlertDialogTrigger$1.displayName = TRIGGER_NAME;
var PORTAL_NAME = "AlertDialogPortal";
var AlertDialogPortal$1 = (props) => {
  const { __scopeAlertDialog, ...portalProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, {
    ...dialogScope,
    ...portalProps,
  });
};
AlertDialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "AlertDialogOverlay";
var AlertDialogOverlay$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...overlayProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, {
    ...dialogScope,
    ...overlayProps,
    ref: forwardedRef,
  });
});
AlertDialogOverlay$1.displayName = OVERLAY_NAME;
var CONTENT_NAME = "AlertDialogContent";
var [AlertDialogContentProvider, useAlertDialogContentContext] =
  createAlertDialogContext(CONTENT_NAME);
var AlertDialogContent$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, children, ...contentProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  const contentRef = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, contentRef);
  const cancelRef = reactExports.useRef(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(WarningProvider, {
    contentName: CONTENT_NAME,
    titleName: TITLE_NAME,
    docsSlug: "alert-dialog",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialogContentProvider,
      {
        scope: __scopeAlertDialog,
        cancelRef,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, {
          role: "alertdialog",
          ...dialogScope,
          ...contentProps,
          ref: composedRefs,
          onOpenAutoFocus: composeEventHandlers(
            contentProps.onOpenAutoFocus,
            (event) => {
              event.preventDefault();
              cancelRef.current?.focus({ preventScroll: true });
            },
          ),
          onPointerDownOutside: (event) => event.preventDefault(),
          onInteractOutside: (event) => event.preventDefault(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, {
              contentRef,
            }),
          ],
        }),
      },
    ),
  });
});
AlertDialogContent$1.displayName = CONTENT_NAME;
var TITLE_NAME = "AlertDialogTitle";
var AlertDialogTitle$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...titleProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Title, {
    ...dialogScope,
    ...titleProps,
    ref: forwardedRef,
  });
});
AlertDialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "AlertDialogDescription";
var AlertDialogDescription$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...descriptionProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Description, {
      ...dialogScope,
      ...descriptionProps,
      ref: forwardedRef,
    });
  },
);
AlertDialogDescription$1.displayName = DESCRIPTION_NAME;
var ACTION_NAME = "AlertDialogAction";
var AlertDialogAction$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...actionProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, {
    ...dialogScope,
    ...actionProps,
    ref: forwardedRef,
  });
});
AlertDialogAction$1.displayName = ACTION_NAME;
var CANCEL_NAME = "AlertDialogCancel";
var AlertDialogCancel$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...cancelProps } = props;
  const { cancelRef } = useAlertDialogContentContext(
    CANCEL_NAME,
    __scopeAlertDialog,
  );
  const dialogScope = useDialogScope(__scopeAlertDialog);
  const ref = useComposedRefs(forwardedRef, cancelRef);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, {
    ...dialogScope,
    ...cancelProps,
    ref,
  });
});
AlertDialogCancel$1.displayName = CANCEL_NAME;
var DescriptionWarning = ({ contentRef }) => {
  const MESSAGE = `\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;
  reactExports.useEffect(() => {
    const hasDescription = document.getElementById(
      contentRef.current?.getAttribute("aria-describedby"),
    );
    if (!hasDescription) console.warn(MESSAGE);
  }, [MESSAGE, contentRef]);
  return null;
};
var Root2 = AlertDialog$1;
var Trigger2 = AlertDialogTrigger$1;
var Portal2 = AlertDialogPortal$1;
var Overlay2 = AlertDialogOverlay$1;
var Content2 = AlertDialogContent$1;
var Action = AlertDialogAction$1;
var Cancel = AlertDialogCancel$1;
var Title2 = AlertDialogTitle$1;
var Description2 = AlertDialogDescription$1;

const AlertDialog = Root2;
const AlertDialogTrigger = Trigger2;
const AlertDialogPortal = Portal2;
const AlertDialogOverlay = reactExports.forwardRef(
  ({ className, ...props }, ref) =>
    /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay2, {
      className: cn(
        "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      ),
      ...props,
      ref,
    }),
);
AlertDialogOverlay.displayName = Overlay2.displayName;
const AlertDialogContent = reactExports.forwardRef(
  ({ className, ...props }, ref) =>
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, {
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Content2, {
          ref,
          className: cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
            className,
          ),
          ...props,
        }),
      ],
    }),
);
AlertDialogContent.displayName = Content2.displayName;
const AlertDialogHeader = ({ className, ...props }) =>
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    className: cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className,
    ),
    ...props,
  });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) =>
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    ),
    ...props,
  });
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = reactExports.forwardRef(
  ({ className, ...props }, ref) =>
    /* @__PURE__ */ jsxRuntimeExports.jsx(Title2, {
      ref,
      className: cn("text-lg font-semibold", className),
      ...props,
    }),
);
AlertDialogTitle.displayName = Title2.displayName;
const AlertDialogDescription = reactExports.forwardRef(
  ({ className, ...props }, ref) =>
    /* @__PURE__ */ jsxRuntimeExports.jsx(Description2, {
      ref,
      className: cn("text-sm text-muted-foreground", className),
      ...props,
    }),
);
AlertDialogDescription.displayName = Description2.displayName;
const AlertDialogAction = reactExports.forwardRef(
  ({ className, ...props }, ref) =>
    /* @__PURE__ */ jsxRuntimeExports.jsx(Action, {
      ref,
      className: cn(buttonVariants(), className),
      ...props,
    }),
);
AlertDialogAction.displayName = Action.displayName;
const AlertDialogCancel = reactExports.forwardRef(
  ({ className, ...props }, ref) =>
    /* @__PURE__ */ jsxRuntimeExports.jsx(Cancel, {
      ref,
      className: cn(
        buttonVariants({ variant: "outline" }),
        "mt-2 sm:mt-0",
        className,
      ),
      ...props,
    }),
);
AlertDialogCancel.displayName = Cancel.displayName;

const SplitComponent = function DepartmentsPage() {
  const [departments, setDepartments] = reactExports.useState([]);
  const [filteredDepartments, setFilteredDepartments] = reactExports.useState(
    [],
  );
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const router = useRouter();
  const { data: session } = useSession();
  const organizationId = session?.user?.organizationId;
  reactExports.useEffect(() => {
    if (organizationId) {
      fetchDepartments();
    }
  }, [organizationId]);
  reactExports.useEffect(() => {
    if (departments.length > 0) {
      const filtered = departments.filter(
        (dept) =>
          dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dept.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dept.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dept.code?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredDepartments(filtered);
    }
  }, [searchQuery, departments]);
  const fetchDepartments = async () => {
    if (!organizationId) return;
    setIsLoading(true);
    try {
      const data = await getDepartments(organizationId);
      setDepartments(data);
      setFilteredDepartments(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch departments",
        variant: "destructive",
      });
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (!organizationId) return;
    setDeletingId(id);
    try {
      await deleteDepartment(id, organizationId);
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
      fetchDepartments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete department",
        variant: "destructive",
      });
      console.error("Error deleting department:", error);
    } finally {
      setDeletingId(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "container mx-auto py-6",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex justify-between items-center mb-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                className: "text-3xl font-bold",
                children: "Departments",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-muted-foreground mt-1",
                children: "Manage your organization's departments and teams",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
            asChild: true,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
              to: "/admin/departments/new",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, {
                  className: "mr-2 h-4 w-4",
                }),
                " New Department",
              ],
            }),
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex items-center space-x-2 mb-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "relative flex-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, {
                className:
                  "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
                type: "search",
                placeholder: "Search departments...",
                className: "pl-8",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
            variant: "outline",
            onClick: () =>
              router.navigate({
                to: "/admin/departments",
              }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, {
                className: "mr-2 h-4 w-4",
              }),
              " View Hierarchy",
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, {
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, {
          className: "pt-6",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, {
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, {
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, {
                      children: "Name",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, {
                      children: "Code",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, {
                      children: "Members",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, {
                      children: "Status",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, {
                      className: "text-right",
                      children: "Actions",
                    }),
                  ],
                }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, {
                children: isLoading
                  ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, {
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        TableCell,
                        {
                          colSpan: 5,
                          className: "text-center py-10",
                          children: "Loading departments...",
                        },
                      ),
                    })
                  : filteredDepartments.length === 0
                    ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, {
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          TableCell,
                          {
                            colSpan: 5,
                            className: "text-center py-10",
                            children: searchQuery
                              ? "No departments found matching your search"
                              : "No departments found",
                          },
                        ),
                      })
                    : filteredDepartments.map((department) =>
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          TableRow,
                          {
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, {
                                className: "font-medium",
                                children:
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                    "div",
                                    {
                                      className: "flex flex-col",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                          Link,
                                          {
                                            to: "/admin/departments/$id",
                                            params: {
                                              id: department.id,
                                            },
                                            className: "hover:underline",
                                            children: department.name,
                                          },
                                        ),
                                        department.description &&
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                                            "span",
                                            {
                                              className:
                                                "text-sm text-muted-foreground truncate max-w-xs",
                                              children: department.description,
                                            },
                                          ),
                                      ],
                                    },
                                  ),
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, {
                                children: department.code || "-",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, {
                                children:
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                    "div",
                                    {
                                      className: "flex items-center",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                          Users,
                                          { className: "h-4 w-4 mr-1" },
                                        ),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                          "span",
                                          {
                                            children:
                                              department.users?.length || 0,
                                          },
                                        ),
                                      ],
                                    },
                                  ),
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, {
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  Badge,
                                  {
                                    variant: department.isActive
                                      ? "default"
                                      : "secondary",
                                    children: department.isActive
                                      ? "Active"
                                      : "Inactive",
                                  },
                                ),
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, {
                                className: "text-right",
                                children:
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                    DropdownMenu,
                                    {
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                          DropdownMenuTrigger,
                                          {
                                            asChild: true,
                                            children:
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                Button,
                                                {
                                                  variant: "ghost",
                                                  size: "icon",
                                                  children: [
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                      "span",
                                                      {
                                                        className: "sr-only",
                                                        children: "Open menu",
                                                      },
                                                    ),
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                      "svg",
                                                      {
                                                        width: "15",
                                                        height: "15",
                                                        viewBox: "0 0 15 15",
                                                        fill: "none",
                                                        xmlns:
                                                          "http://www.w3.org/2000/svg",
                                                        className: "h-4 w-4",
                                                        children:
                                                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                            "path",
                                                            {
                                                              d: "M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z",
                                                              fill: "currentColor",
                                                              fillRule:
                                                                "evenodd",
                                                              clipRule:
                                                                "evenodd",
                                                            },
                                                          ),
                                                      },
                                                    ),
                                                  ],
                                                },
                                              ),
                                          },
                                        ),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                          DropdownMenuContent,
                                          {
                                            align: "end",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                DropdownMenuLabel,
                                                { children: "Actions" },
                                              ),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                DropdownMenuItem,
                                                {
                                                  asChild: true,
                                                  children:
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                      Link,
                                                      {
                                                        to: `/admin/departments/$id`,
                                                        params: {
                                                          id: department.id,
                                                        },
                                                        children:
                                                          "View details",
                                                      },
                                                    ),
                                                },
                                              ),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                DropdownMenuItem,
                                                {
                                                  asChild: true,
                                                  children:
                                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                      Link,
                                                      {
                                                        to: `/admin/departments/$id`,
                                                        params: {
                                                          id: department.id,
                                                        },
                                                        children: [
                                                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                            Pencil,
                                                            {
                                                              className:
                                                                "mr-2 h-4 w-4",
                                                            },
                                                          ),
                                                          " Edit",
                                                        ],
                                                      },
                                                    ),
                                                },
                                              ),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                DropdownMenuItem,
                                                {
                                                  asChild: true,
                                                  children:
                                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                      Link,
                                                      {
                                                        to: `/admin/departments/$id`,
                                                        params: {
                                                          id: department.id,
                                                        },
                                                        children: [
                                                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                            Users,
                                                            {
                                                              className:
                                                                "mr-2 h-4 w-4",
                                                            },
                                                          ),
                                                          " Manage members",
                                                        ],
                                                      },
                                                    ),
                                                },
                                              ),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                DropdownMenuSeparator,
                                                {},
                                              ),
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                AlertDialog,
                                                {
                                                  children: [
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                      AlertDialogTrigger,
                                                      {
                                                        asChild: true,
                                                        children:
                                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                            DropdownMenuItem,
                                                            {
                                                              onSelect: (e) =>
                                                                e.preventDefault(),
                                                              children: [
                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  Trash2,
                                                                  {
                                                                    className:
                                                                      "mr-2 h-4 w-4",
                                                                  },
                                                                ),
                                                                " Delete",
                                                              ],
                                                            },
                                                          ),
                                                      },
                                                    ),
                                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                      AlertDialogContent,
                                                      {
                                                        children: [
                                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                            AlertDialogHeader,
                                                            {
                                                              children: [
                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  AlertDialogTitle,
                                                                  {
                                                                    children:
                                                                      "Delete Department",
                                                                  },
                                                                ),
                                                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                  AlertDialogDescription,
                                                                  {
                                                                    children: [
                                                                      'Are you sure you want to delete the department "',
                                                                      department.name,
                                                                      '"? This action cannot be undone.',
                                                                    ],
                                                                  },
                                                                ),
                                                              ],
                                                            },
                                                          ),
                                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                            AlertDialogFooter,
                                                            {
                                                              children: [
                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  AlertDialogCancel,
                                                                  {
                                                                    children:
                                                                      "Cancel",
                                                                  },
                                                                ),
                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  AlertDialogAction,
                                                                  {
                                                                    onClick:
                                                                      () =>
                                                                        handleDelete(
                                                                          department.id,
                                                                        ),
                                                                    disabled:
                                                                      deletingId ===
                                                                      department.id,
                                                                    children:
                                                                      deletingId ===
                                                                      department.id
                                                                        ? "Deleting..."
                                                                        : "Delete",
                                                                  },
                                                                ),
                                                              ],
                                                            },
                                                          ),
                                                        ],
                                                      },
                                                    ),
                                                  ],
                                                },
                                              ),
                                            ],
                                          },
                                        ),
                                      ],
                                    },
                                  ),
                              }),
                            ],
                          },
                          department.id,
                        ),
                      ),
              }),
            ],
          }),
        }),
      }),
    ],
  });
};

export { SplitComponent as component };
