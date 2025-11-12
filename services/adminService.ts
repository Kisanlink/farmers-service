/**
 * Admin Service
 *
 * Service for admin operations.
 * Uses factory pattern for dependency injection and testability.
 */

import { ApiClient } from '../utils/apiClient';
import {
  HealthCheckResponse,
  SeedRequest,
  SeedResponse,
  PermissionCheckRequest,
  PermissionCheckResponse,
  AuditQueryParams,
  AuditResponse
} from '../types/admin.types';

/**
 * Create admin service with injected API client
 */
const createAdminService = (apiClient: ApiClient) => {
  const basePath = '/admin';

  return {
    /**
     * Health check endpoint
     */
    getHealthStatus: (): Promise<HealthCheckResponse> => {
      return apiClient.get<HealthCheckResponse>(`${basePath}/health`);
    },

    /**
     * Seed roles and permissions
     */
    seedRolesAndPermissions: (data?: SeedRequest): Promise<SeedResponse> => {
      return apiClient.post<SeedResponse>(`${basePath}/seed`, data || {});
    },

    /**
     * Check user permission
     */
    checkUserPermission: (data: PermissionCheckRequest): Promise<PermissionCheckResponse> => {
      return apiClient.post<PermissionCheckResponse>(`${basePath}/permissions/check`, data);
    },

    /**
     * Get audit trail
     */
    getAuditTrail: (queryParams?: AuditQueryParams): Promise<AuditResponse> => {
      return apiClient.get<AuditResponse>(`${basePath}/audit`, { params: queryParams });
    }
  };
};

export default createAdminService;
