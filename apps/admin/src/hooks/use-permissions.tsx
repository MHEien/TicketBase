import { useContext, createContext, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  organizationId: string;
}

interface PermissionsContextType {
  user: User | null;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined,
);

export function PermissionsProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: User | null;
}) {
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;

    // Check for wildcard permission (full access)
    if (user.permissions.includes("*")) return true;

    // Check for specific permission
    if (user.permissions.includes(permission)) return true;

    // Check for wildcard permissions with namespaces
    const parts = permission.split(":");
    if (parts.length > 1) {
      const namespace = parts[0];
      if (user.permissions.includes(`${namespace}:*`)) return true;
    }

    return false;
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  const value: PermissionsContextType = {
    user,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions(): PermissionsContextType {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
}

// Convenience hooks for common permission checks
export function useCanViewUsers(): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission("users:view");
}

export function useCanCreateUsers(): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission("users:create");
}

export function useCanUpdateUsers(): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission("users:update");
}

export function useCanDeleteUsers(): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission("users:delete");
}

export function useCanViewActivities(): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission("activities:view");
}
