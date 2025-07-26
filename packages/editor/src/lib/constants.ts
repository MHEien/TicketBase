import { Smartphone, Tablet, Monitor } from "lucide-react";

export const BREAKPOINTS = {
  mobile: { label: "Mobile", icon: Smartphone, maxWidth: 768 },
  tablet: { label: "Tablet", icon: Tablet, maxWidth: 1024 },
  desktop: { label: "Desktop", icon: Monitor, maxWidth: Infinity },
} as const;
