import { j as jsxRuntimeExports, O as Outlet } from './main-D54NVj6U.js';
import { O as OnboardingProvider } from './onboarding-context-DDUqky5m.js';

const SplitComponent = function OnboardingLayout() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(OnboardingProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "p-6 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-center", children: "eTickets Platform" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "max-w-7xl mx-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] }) });
};

export { SplitComponent as component };
