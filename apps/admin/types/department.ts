export interface Department {
  id: string;
  name: string;
  description?: string;
  slug: string;
  organizationId: string;
  headId?: string;
  parentDepartmentId?: string;
  code?: string;
  createdAt: string;
  updatedAt: string;
  settings: DepartmentSettings;
  isActive: boolean;
  childDepartments?: Department[];
  users?: User[];
  parentDepartment?: Department;
}

export interface DepartmentSettings {
  color?: string;
  icon?: string;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  defaultTicketAssignee?: string;
  autoAssignTickets?: boolean;
  notificationPreferences?: {
    newTicket?: boolean;
    ticketAssigned?: boolean;
    ticketClosed?: boolean;
    dailySummary?: boolean;
  };
  customFields?: {
    key: string;
    label: string;
    type: "text" | "number" | "date" | "boolean" | "select";
    options?: string[];
    required?: boolean;
  }[];
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  slug: string;
  organizationId: string;
  headId?: string;
  parentDepartmentId?: string;
  code?: string;
  settings?: DepartmentSettings;
  isActive?: boolean;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
  slug?: string;
  headId?: string;
  parentDepartmentId?: string;
  code?: string;
  settings?: DepartmentSettings;
  isActive?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  departmentId?: string;
  createdAt: string;
  lastActive: string;
  status: string;
}
