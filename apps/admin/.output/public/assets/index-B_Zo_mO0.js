import { r as reactExports, j as jsxRuntimeExports } from "./main-D54NVj6U.js";
import {
  M as MotionConfigContext,
  i as isHTMLElement,
  u as useConstant,
  P as PresenceContext,
  a as usePresence,
  b as useIsomorphicLayoutEffect,
  L as LayoutGroupContext,
} from "./proxy-DR25Kbh7.js";

/**
 * Measurement functionality has to be within a separate component
 * to leverage snapshot lifecycle.
 */
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (element && prevProps.isPresent && !this.props.isPresent) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const size = this.props.sizeRef.current;
      size.height = element.offsetHeight || 0;
      size.width = element.offsetWidth || 0;
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {}
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, root }) {
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  /**
   * We create and inject a style block so we can apply this explicit
   * sizing in a non-destructive manner by just deleting the style block.
   *
   * We can't apply size via render as the measurement happens
   * in getSnapshotBeforeUpdate (post-render), likewise if we apply the
   * styles directly on the DOM node, we might be overwriting
   * styles set via the style prop.
   */
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right } = size.current;
    if (isPresent || !ref.current || !width || !height) return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce) style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            top: ${top}px !important;
          }
        `);
    }
    return () => {
      parent.removeChild(style);
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, {
    isPresent: isPresent,
    childRef: ref,
    sizeRef: size,
    children: reactExports.cloneElement(children, { ref }),
  });
}

const PresenceChild = ({
  children,
  initial,
  isPresent,
  onExitComplete,
  custom,
  presenceAffectsLayout,
  mode,
  anchorX,
  root,
}) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete) return; // can stop searching when any is incomplete
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      },
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  /**
   * If the presence of a child affects the layout of the components around it,
   * we want to make a new context value to ensure they get re-rendered
   * so they can detect that layout change.
   */
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  /**
   * If there's no `motion` components to fire exit animations, we want to remove this
   * component immediately.
   */
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  if (mode === "popLayout") {
    children = jsxRuntimeExports.jsx(PopChild, {
      isPresent: isPresent,
      anchorX: anchorX,
      root: root,
      children: children,
    });
  }
  return jsxRuntimeExports.jsx(PresenceContext.Provider, {
    value: context,
    children: children,
  });
};
function newChildrenMap() {
  return new Map();
}

const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  // We use forEach here instead of map as map mutates the component key by preprending `.$`
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child)) filtered.push(child);
  });
  return filtered;
}

const AnimatePresence = ({
  children,
  custom,
  initial = true,
  onExitComplete,
  presenceAffectsLayout = true,
  mode = "sync",
  propagate = false,
  anchorX = "left",
  root,
}) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(
    () => onlyElements(children),
    [children],
  );
  const presentKeys =
    propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const [diffedChildren, setDiffedChildren] =
    reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] =
    reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {
    children: renderedChildren.map((child) => {
      const key = getChildKey(child);
      const isPresent =
        propagate && !isParentPresent
          ? false
          : presentChildren === renderedChildren || presentKeys.includes(key);
      const onExit = () => {
        if (exitComplete.has(key)) {
          exitComplete.set(key, true);
        } else {
          return;
        }
        let isEveryExitComplete = true;
        exitComplete.forEach((isExitComplete) => {
          if (!isExitComplete) isEveryExitComplete = false;
        });
        if (isEveryExitComplete) {
          forceRender?.();
          setRenderedChildren(pendingPresentChildren.current);
          propagate && safeToRemove?.();
          onExitComplete && onExitComplete();
        }
      };
      return jsxRuntimeExports.jsx(
        PresenceChild,
        {
          isPresent,
          initial: !isInitialRender.current || initial ? void 0 : false,
          custom,
          presenceAffectsLayout,
          mode,
          root,
          onExitComplete: isPresent ? void 0 : onExit,
          anchorX,
          children: child,
        },
        key,
      );
    }),
  });
};

export { AnimatePresence as A };
