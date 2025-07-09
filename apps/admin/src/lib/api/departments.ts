import { apiClient } from "./api-client";
import {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "@/src/types/department";

// Get all departments for an organization
export async function getDepartments(
  organizationId: string,
): Promise<Department[]> {
  const response = await apiClient.get(
    `/departments?organizationId=${organizationId}`,
  );
  return response.data;
}

// Get departments with users for an organization
export async function getDepartmentsWithUsers(
  organizationId: string,
): Promise<Department[]> {
  const response = await apiClient.get(
    `/departments/with-users?organizationId=${organizationId}`,
  );
  return response.data;
}

// Get department hierarchy for an organization
export async function getDepartmentHierarchy(
  organizationId: string,
): Promise<Department[]> {
  const response = await apiClient.get(
    `/departments/hierarchy?organizationId=${organizationId}`,
  );
  return response.data;
}

// Get a department by ID
export async function getDepartmentById(
  id: string,
  organizationId?: string,
): Promise<Department> {
  const url = organizationId
    ? `/departments/${id}?organizationId=${organizationId}`
    : `/departments/${id}`;
  const response = await apiClient.get(url);
  return response.data;
}

// Get a department by slug
export async function getDepartmentBySlug(
  slug: string,
  organizationId: string,
): Promise<Department> {
  const response = await apiClient.get(
    `/departments/by-slug/${slug}?organizationId=${organizationId}`,
  );
  return response.data;
}

// Create a new department
export async function createDepartment(
  department: CreateDepartmentRequest,
): Promise<Department> {
  const response = await apiClient.post("/departments", department);
  return response.data;
}

// Update a department
export async function updateDepartment(
  id: string,
  department: UpdateDepartmentRequest,
  organizationId?: string,
): Promise<Department> {
  const url = organizationId
    ? `/departments/${id}?organizationId=${organizationId}`
    : `/departments/${id}`;
  const response = await apiClient.put(url, department);
  return response.data;
}

// Delete a department
export async function deleteDepartment(
  id: string,
  organizationId?: string,
): Promise<void> {
  const url = organizationId
    ? `/departments/${id}?organizationId=${organizationId}`
    : `/departments/${id}`;
  await apiClient.delete(url);
}
