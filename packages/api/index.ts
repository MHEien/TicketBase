// Main entry point for the @ticketbase/api package

// Export the main API client and configuration
export { apiClient, configureApiClient } from './api-client';
export type { ApiClientConfig } from './api-client';

// Export diagnostic client
export { diagnosticClient, configureDiagnosticClient } from './diagnostic-client';

// Export all API modules with explicit exports to avoid conflicts
export * from './auth-api';
export * from './users-api';
export * from './departments';
export * from './events-api';
export * from './analytics-api';
export * from './plugins-api';
export * from './users-api'
export * from './pages'

// Export specific functions from activities modules to avoid conflicts
export { fetchActivities, fetchUserActivities, fetchEntityActivities } from './activities-api';
export * from './activity-api';

// Export the pages API object and its types
export { pagesApi } from './pages';
export type { CreatePageDto, UpdatePageDto, PageQueryDto } from './pages';

// Export types
export * from './types';

// Re-export commonly used types for convenience
export type {
  User,
  Organization,
  Department,
  Event,
  Page,
  Activity,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  CreateActivityDto,
  ApiResponse,
  PaginatedResponse,
  AuthResponse,
  AnalyticsData
} from './types';

// Export plugin types
export type {
  Plugin,
  InstalledPlugin,
  PluginBuildResult
} from './plugins-api';
