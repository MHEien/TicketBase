"use client";
import { useState, useContext } from "react";
import { createContext } from "react";

export const DashboardNavContext = createContext({
  activeSection: "overview",
  setActiveSection: (section: string) => {},
});

export const DashboardNavProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <DashboardNavContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </DashboardNavContext.Provider>
  );
};

export const useDashboardNav = () => {
  const { activeSection, setActiveSection } = useContext(DashboardNavContext);
  return { activeSection, setActiveSection };
};
