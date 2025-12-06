/**
 * FPO Configuration Service
 *
 * Service for FPO configuration and ERP integration management.
 * Uses factory pattern for dependency injection and testability.
 *
 * API Endpoints:
 * - GET  /api/v1/fpo/{aaa_org_id}/configuration - Get FPO configuration
 * - POST /api/v1/fpo-config - Create FPO configuration
 * - PUT  /api/v1/fpo/{aaa_org_id}/configuration - Update FPO configuration
 * - DELETE /api/v1/fpo/{aaa_org_id}/configuration - Delete FPO configuration (Super Admin)
 * - GET  /api/v1/fpo/{aaa_org_id}/configuration/health - Check ERP health
 */

import { ApiClient } from '../utils/apiClient';
import {
  FPOConfigResponse,
  FPOConfigListResponse,
  FPOHealthCheckResponse,
  CreateFPOConfigRequest,
  UpdateFPOConfigRequest,
  ListFPOConfigsQueryParams
} from '../types/fpoConfig.types';
import { BaseResponse } from '../types';

/**
 * Create FPO configuration service with injected API client
 */
const createFPOConfigService = (apiClient: ApiClient) => {
  const basePath = '/api/v1/fpo';
  const createPath = '/api/v1/fpo-config';

  return {
    /**
     * Get FPO configuration by AAA Organization ID
     *
     * Returns the configuration for the specified FPO. If the FPO is not configured,
     * the response will include `config_status: "not_configured"` in metadata.
     *
     * @param aaaOrgId - The AAA Organization ID
     * @returns Promise resolving to FPO configuration
     *
     * @example
     * const config = await fpoConfig.getFPOConfig('ORGN00000003');
     * console.log(config.data.erp_base_url);
     * if (config.data.config_status === 'not_configured') {
     *   console.log('FPO needs configuration');
     * }
     */
    getFPOConfig: (aaaOrgId: string): Promise<FPOConfigResponse> => {
      return apiClient.get<FPOConfigResponse>(`${basePath}/${aaaOrgId}/configuration`);
    },

    /**
     * Create a new FPO configuration
     *
     * Creates a new configuration for an FPO. Required fields are aaa_org_id,
     * fpo_name, and erp_base_url.
     *
     * @param configData - FPO configuration data
     * @returns Promise resolving to created FPO configuration
     *
     * @example
     * const newConfig = await fpoConfig.createFPOConfig({
     *   aaa_org_id: 'ORGN00000003',
     *   fpo_name: 'Green Valley FPO',
     *   erp_base_url: 'https://erp-greenvalley.kisanlink.com',
     *   erp_ui_base_url: 'https://erp-ui.greenvalley.kisanlink.com',
     *   contact: { email: 'admin@greenvalley.com', phone: '+91-9876543210' },
     *   business_hours: { monday: '9:00-18:00', timezone: 'Asia/Kolkata' }
     * });
     */
    createFPOConfig: (configData: CreateFPOConfigRequest): Promise<FPOConfigResponse> => {
      return apiClient.post<FPOConfigResponse>(createPath, configData);
    },

    /**
     * Update an existing FPO configuration
     *
     * Updates the configuration for an existing FPO. All fields are optional
     * and only provided fields will be updated.
     *
     * @param aaaOrgId - The AAA Organization ID
     * @param configData - Updated configuration data
     * @returns Promise resolving to updated FPO configuration
     *
     * @example
     * const updated = await fpoConfig.updateFPOConfig('ORGN00000003', {
     *   erp_base_url: 'https://new-erp.kisanlink.com',
     *   erp_ui_base_url: 'https://new-erp-ui.kisanlink.com',
     *   contact: { email: 'updated@greenvalley.com' },
     *   metadata: { last_review_date: '2025-01-01' }
     * });
     */
    updateFPOConfig: (aaaOrgId: string, configData: UpdateFPOConfigRequest): Promise<FPOConfigResponse> => {
      return apiClient.put<FPOConfigResponse>(`${basePath}/${aaaOrgId}/configuration`, configData);
    },

    /**
     * Delete an FPO configuration (Super Admin only)
     *
     * Permanently removes the FPO configuration. This action requires
     * Super Admin privileges.
     *
     * @param aaaOrgId - The AAA Organization ID
     * @returns Promise resolving to deletion confirmation
     *
     * @example
     * await fpoConfig.deleteFPOConfig('ORGN00000003');
     */
    deleteFPOConfig: (aaaOrgId: string): Promise<BaseResponse> => {
      return apiClient.delete<BaseResponse>(`${basePath}/${aaaOrgId}/configuration`);
    },

    /**
     * List all FPO configurations with pagination and filtering
     *
     * @param params - Query parameters for filtering and pagination
     * @returns Promise resolving to paginated list of FPO configurations
     *
     * @example
     * const configs = await fpoConfig.listFPOConfigs({
     *   page: 1,
     *   page_size: 20,
     *   search: 'green',
     *   sort_by: 'fpo_name'
     * });
     */
    listFPOConfigs: (params?: ListFPOConfigsQueryParams): Promise<FPOConfigListResponse> => {
      return apiClient.get<FPOConfigListResponse>(createPath, { params });
    },

    /**
     * Check the health of an FPO's ERP endpoint
     *
     * Performs a health check on the configured ERP endpoint for the FPO.
     * Returns status information including response time and any error messages.
     *
     * @param aaaOrgId - The AAA Organization ID
     * @returns Promise resolving to health check status
     *
     * @example
     * const health = await fpoConfig.checkERPHealth('ORGN00000003');
     * if (health.data.status === 'healthy') {
     *   console.log(`ERP is healthy! Response time: ${health.data.response_time_ms}ms`);
     * } else {
     *   console.log(`ERP issue: ${health.data.error_message}`);
     * }
     */
    checkERPHealth: (aaaOrgId: string): Promise<FPOHealthCheckResponse> => {
      return apiClient.get<FPOHealthCheckResponse>(`${basePath}/${aaaOrgId}/configuration/health`);
    }
  };
};

export default createFPOConfigService;
