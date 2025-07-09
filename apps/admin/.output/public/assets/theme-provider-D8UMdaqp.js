import { c as create } from './index-DQRAsB8C.js';
import { r as reactExports, j as jsxRuntimeExports } from './main-D54NVj6U.js';

const useCommandMenu = create((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open })
}));

const DashboardNavContext = reactExports.createContext({
  activeSection: "overview",
  setActiveSection: (section) => {
  }
});
const DashboardNavProvider = ({
  children
}) => {
  const [activeSection, setActiveSection] = reactExports.useState("overview");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardNavContext.Provider, { value: { activeSection, setActiveSection }, children });
};
const useDashboardNav = () => {
  const { activeSection, setActiveSection } = reactExports.useContext(DashboardNavContext);
  return { activeSection, setActiveSection };
};

const ThemeContext = reactExports.createContext({
  theme: "light",
  setTheme: () => {
  }
});
const useTheme = () => reactExports.useContext(ThemeContext);

export { DashboardNavProvider as D, useDashboardNav as a, useTheme as b, useCommandMenu as u };
