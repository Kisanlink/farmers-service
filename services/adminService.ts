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
  AuditResponse,
  PermanentDeleteRequest,
  PermanentDeleteOrgRequest,
  PermanentDeleteResponse,
  CleanupOrphanedResponse
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
    },

    /**
     * Permanently delete an entity with cascade
     *
     * Cascade order:
     * - farmer → farmer_links → farms → crop_cycles → activities
     * - farm → crop_cycles → activities
     * - crop_cycle → activities
     * - farmer_link → (no cascade)
     *
     * @param request - Entity type and ID to delete
     * @returns Delete report with counts of deleted records
     *
     * @remarks Requires SUPER_ADMIN role
     */
    permanentDelete: (request: PermanentDeleteRequest): Promise<PermanentDeleteResponse> => {
      return apiClient.post<PermanentDeleteResponse>('/api/v1/admin/permanent-delete', request);
    },

    /**
     * Permanently delete all data for an organization
     *
     * @param request - Organization ID and optional dry_run flag
     * @returns Delete report with counts of deleted records
     *
     * @remarks Requires SUPER_ADMIN role
     * @remarks Use dry_run: true to preview without deleting
     */
    permanentDeleteOrg: (request: PermanentDeleteOrgRequest): Promise<PermanentDeleteResponse> => {
      return apiClient.post<PermanentDeleteResponse>('/api/v1/admin/permanent-delete/org', request);
    },

    /**
     * Clean up orphaned records across the database
     *
     * Cleans:
     * - Farms without valid farmer references
     * - Crop cycles without valid farm references
     * - Activities without valid crop cycle references
     * - Farmer links without valid farmer references
     *
     * @returns Delete report with counts of deleted records
     *
     * @remarks Requires SUPER_ADMIN role
     */
    cleanupOrphaned: (): Promise<CleanupOrphanedResponse> => {
      return apiClient.post<CleanupOrphanedResponse>('/api/v1/admin/cleanup-orphaned', {});
    }
  };
};

export default createAdminService;
