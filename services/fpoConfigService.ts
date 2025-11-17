/**
 * FPO Configuration Service
 *
 * Service for FPO configuration and ERP integration management.
 * Uses factory pattern for dependency injection and testability.
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
  const basePath = '/api/v1/fpo-config';

  return {
    /**
     * Get FPO configuration by FPO ID
     *
     * @param fpoId - The FPO identifier
     * @returns Promise resolving to FPO configuration
     *
     * @example
     * const config = await fpoConfig.getFPOConfig('fpo-green-valley-001');
     * console.log(config.data.erp_base_url);
     */
    getFPOConfig: (fpoId: string): Promise<FPOConfigResponse> => {
      return apiClient.get<FPOConfigResponse>(`${basePath}/${fpoId}`);
    },

    /**
     * Create a new FPO configuration
     *
     * @param configData - FPO configuration data
     * @returns Promise resolving to created FPO configuration
     *
     * @example
     * const newConfig = await fpoConfig.createFPOConfig({
     *   fpo_id: 'fpo-green-valley-001',
     *   fpo_name: 'Green Valley FPO',
     *   erp_base_url: 'https://erp-greenvalley.kisanlink.com',
     *   erp_api_version: 'v1',
     *   features: { ecommerce_enabled: true }
     * });
     */
    createFPOConfig: (configData: CreateFPOConfigRequest): Promise<FPOConfigResponse> => {
      return apiClient.post<FPOConfigResponse>(basePath, configData);
    },

    /**
     * Update an existing FPO configuration
     *
     * @param fpoId - The FPO identifier
     * @param configData - Updated configuration data
     * @returns Promise resolving to updated FPO configuration
     *
     * @example
     * const updated = await fpoConfig.updateFPOConfig('fpo-green-valley-001', {
     *   erp_base_url: 'https://new-erp.kisanlink.com',
     *   features: { inventory_management: true }
     * });
     */
    updateFPOConfig: (fpoId: string, configData: UpdateFPOConfigRequest): Promise<FPOConfigResponse> => {
      return apiClient.put<FPOConfigResponse>(`${basePath}/${fpoId}`, configData);
    },

    /**
     * Delete an FPO configuration (soft delete)
     *
     * @param fpoId - The FPO identifier
     * @returns Promise resolving to deletion confirmation
     *
     * @example
     * await fpoConfig.deleteFPOConfig('fpo-green-valley-001');
     */
    deleteFPOConfig: (fpoId: string): Promise<BaseResponse> => {
      return apiClient.delete<BaseResponse>(`${basePath}/${fpoId}`);
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
      return apiClient.get<FPOConfigListResponse>(basePath, { params });
    },

    /**
     * Check the health of an FPO's ERP endpoint
     *
     * @param fpoId - The FPO identifier
     * @returns Promise resolving to health check status
     *
     * @example
     * const health = await fpoConfig.checkERPHealth('fpo-green-valley-001');
     * if (health.data.status === 'healthy') {
     *   console.log('ERP is healthy!');
     * }
     */
    checkERPHealth: (fpoId: string): Promise<FPOHealthCheckResponse> => {
      return apiClient.get<FPOHealthCheckResponse>(`${basePath}/${fpoId}/health`);
    }
  };
};

export default createFPOConfigService;
