/**
 * FPO Service
 *
 * Service for FPO (Farmer Producer Organization) operations.
 * Uses factory pattern for dependency injection and testability.
 *
 * Includes FPO Lifecycle Management endpoints for state transitions,
 * sync operations, and audit tracking.
 */

import { ApiClient } from '../utils/apiClient';
import {
  CreateFPORequest,
  RegisterFPORequest,
  FPOResponse,
  FPOReferenceResponse,
  // Lifecycle types
  FPOLifecycleResponse,
  SyncFPOResponse,
  RetrySetupResponse,
  SuspendFPORequest,
  ReactivateFPORequest,
  DeactivateFPORequest,
  AuditHistoryResponse
} from '../types/fpo.types';

/**
 * Create FPO service with injected API client
 */
const createFPOService = (apiClient: ApiClient) => {
  const basePath = '/api/v1/identity/fpo';

  return {
    /**
     * Create a new FPO Organization
     */
    createFPO: (data: CreateFPORequest): Promise<FPOResponse> => {
      return apiClient.post<FPOResponse>(`${basePath}/create`, data);
    },

    /**
     * Register FPO Reference with AAA service
     */
    registerFPO: (data: RegisterFPORequest): Promise<FPOReferenceResponse> => {
      return apiClient.post<FPOReferenceResponse>(`${basePath}/register`, data);
    },

    /**
     * Get FPO Reference by AAA Organization ID (legacy)
     */
    getFPOReference: (aaaOrgId: string): Promise<FPOReferenceResponse> => {
      return apiClient.get<FPOReferenceResponse>(`${basePath}/reference/${aaaOrgId}`);
    },

    // ==================== FPO LIFECYCLE MANAGEMENT ====================

    /**
     * Sync FPO from AAA Service
     *
     * This is the most important endpoint - use when getting "not found" errors.
     * It fetches the organization from AAA service and creates/updates the FPO reference.
     *
     * @param aaaOrgId - The AAA Organization ID to sync
     * @returns Promise with synced FPO lifecycle data
     *
     * @example
     * ```typescript
     * const result = await fpoService.syncFPO('ORGN00000003');
     * console.log(result.data.status); // 'ACTIVE', 'PENDING_SETUP', etc.
     * ```
     */
    syncFPO: (aaaOrgId: string): Promise<SyncFPOResponse> => {
      return apiClient.post<SyncFPOResponse>(`${basePath}/sync/${aaaOrgId}`, {});
    },

    /**
     * Get FPO by Organization ID (with auto-sync fallback)
     *
     * Preferred method for fetching FPO data. Automatically syncs from AAA
     * if the FPO reference doesn't exist.
     *
     * @param aaaOrgId - The AAA Organization ID
     * @returns Promise with FPO lifecycle data
     *
     * @example
     * ```typescript
     * const fpo = await fpoService.getFPOByOrg('ORGN00000003');
     * console.log(fpo.data.status); // Current lifecycle status
     * ```
     */
    getFPOByOrg: (aaaOrgId: string): Promise<FPOLifecycleResponse> => {
      return apiClient.get<FPOLifecycleResponse>(`${basePath}/by-org/${aaaOrgId}`);
    },

    /**
     * Retry Failed Setup
     *
     * Use when FPO is in SETUP_FAILED status. Attempts to retry the AAA
     * setup process. Limited by max_setup_retries (default: 3).
     *
     * @param fpoId - The FPO ID (e.g., 'FPOR_1234567890')
     * @returns Promise with retry result and updated status
     *
     * @example
     * ```typescript
     * const result = await fpoService.retrySetup('FPOR_1234567890');
     * console.log(`Retry ${result.data.retry_count} of ${result.data.max_retries}`);
     * ```
     */
    retrySetup: (fpoId: string): Promise<RetrySetupResponse> => {
      return apiClient.post<RetrySetupResponse>(`${basePath}/${fpoId}/retry-setup`, {});
    },

    /**
     * Suspend FPO
     *
     * Temporarily disables an active FPO. Can be reactivated later.
     * Transitions: ACTIVE → SUSPENDED
     *
     * @param fpoId - The FPO ID
     * @param request - Suspension details (reason required)
     * @returns Promise with updated FPO data
     *
     * @example
     * ```typescript
     * await fpoService.suspendFPO('FPOR_1234567890', {
     *   reason: 'Compliance violation',
     *   suspended_until: '2025-12-31T00:00:00Z'
     * });
     * ```
     */
    suspendFPO: (fpoId: string, request: SuspendFPORequest): Promise<FPOLifecycleResponse> => {
      return apiClient.put<FPOLifecycleResponse>(`${basePath}/${fpoId}/suspend`, request);
    },

    /**
     * Reactivate FPO
     *
     * Restores a suspended FPO to active status.
     * Transitions: SUSPENDED → ACTIVE
     *
     * @param fpoId - The FPO ID
     * @param request - Optional reactivation details
     * @returns Promise with updated FPO data
     *
     * @example
     * ```typescript
     * await fpoService.reactivateFPO('FPOR_1234567890', {
     *   reason: 'Compliance issue resolved'
     * });
     * ```
     */
    reactivateFPO: (fpoId: string, request?: ReactivateFPORequest): Promise<FPOLifecycleResponse> => {
      return apiClient.put<FPOLifecycleResponse>(`${basePath}/${fpoId}/reactivate`, request || {});
    },

    /**
     * Deactivate FPO
     *
     * Permanently disables an FPO. This is a serious action.
     * Transitions: ACTIVE/SUSPENDED → INACTIVE
     *
     * @param fpoId - The FPO ID
     * @param request - Deactivation details (reason required)
     * @returns Promise with updated FPO data
     *
     * @example
     * ```typescript
     * await fpoService.deactivateFPO('FPOR_1234567890', {
     *   reason: 'Organization dissolved'
     * });
     * ```
     */
    deactivateFPO: (fpoId: string, request: DeactivateFPORequest): Promise<FPOLifecycleResponse> => {
      return apiClient.put<FPOLifecycleResponse>(`${basePath}/${fpoId}/deactivate`, request);
    },

    /**
     * Get Audit History
     *
     * Retrieves comprehensive audit trail of all lifecycle events for an FPO.
     * Includes who performed each action, when, why, and state transitions.
     *
     * @param fpoId - The FPO ID
     * @param params - Optional pagination parameters
     * @returns Promise with array of audit entries
     *
     * @example
     * ```typescript
     * const history = await fpoService.getAuditHistory('FPOR_1234567890', {
     *   limit: 50,
     *   offset: 0
     * });
     * history.data.forEach(entry => {
     *   console.log(`${entry.action}: ${entry.from_status} → ${entry.to_status}`);
     * });
     * ```
     */
    getAuditHistory: (
      fpoId: string,
      params?: { limit?: number; offset?: number }
    ): Promise<AuditHistoryResponse> => {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const query = queryParams.toString();
      const url = query ? `${basePath}/${fpoId}/history?${query}` : `${basePath}/${fpoId}/history`;

      return apiClient.get<AuditHistoryResponse>(url);
    }
  };
};

export default createFPOService;
