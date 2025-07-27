import type { ComponentListProps } from "@/lib/types";

export const CustomActionBar = ({ children }: ComponentListProps) => {
    return <div style={{ display: 'none' }}>{children}</div>;
  };