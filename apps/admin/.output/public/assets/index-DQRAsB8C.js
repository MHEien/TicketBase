import {
  aZ as useSyncExternalStoreExports,
  aM as React,
} from "./main-D54NVj6U.js";

const __vite_import_meta_env__$1 = {};
const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (
        replace != null
          ? replace
          : typeof nextState !== "object" || nextState === null
      )
        ? nextState
        : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const destroy = () => {
    if ((__vite_import_meta_env__$1 ? "production" : void 0) !== "production") {
      console.warn(
        "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected.",
      );
    }
    listeners.clear();
  };
  const api = { setState, getState, getInitialState, subscribe, destroy };
  const initialState = (state = createState(setState, getState, api));
  return api;
};
const createStore = (createState) =>
  createState ? createStoreImpl(createState) : createStoreImpl;

const __vite_import_meta_env__ = {};
const { useDebugValue } = React;
const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;
let didWarnAboutEqualityFn = false;
const identity = (arg) => arg;
function useStore(api, selector = identity, equalityFn) {
  if (
    (__vite_import_meta_env__ ? "production" : void 0) !== "production" &&
    equalityFn &&
    !didWarnAboutEqualityFn
  ) {
    console.warn(
      "[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937",
    );
    didWarnAboutEqualityFn = true;
  }
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getInitialState,
    selector,
    equalityFn,
  );
  useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  if (
    (__vite_import_meta_env__ ? "production" : void 0) !== "production" &&
    typeof createState !== "function"
  ) {
    console.warn(
      "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.",
    );
  }
  const api =
    typeof createState === "function" ? createStore(createState) : createState;
  const useBoundStore = (selector, equalityFn) =>
    useStore(api, selector, equalityFn);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = (createState) =>
  createState ? createImpl(createState) : createImpl;

export { create as c };
