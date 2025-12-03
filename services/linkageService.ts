/**
 * Linkage Service
 *
 * Service for farmer-FPO linkage operations.
 * Uses factory pattern for dependency injection and testability.
 */

import { ApiClient } from '../utils/apiClient';
import {
  LinkFarmerRequest,
  UnlinkFarmerRequest,
  FarmerLinkageResponse,
  BulkLinkFarmersRequest,
  BulkUnlinkFarmersRequest,
  BulkLinkageResponse
} from '../types/linkage.types';

/**
 * Create linkage service with injected API client
 */
const createLinkageService = (apiClient: ApiClient) => {
  const basePath = '/api/v1/identity';

  return {
    /**
     * Link a farmer to an FPO organization
     */
    linkFarmer: (data: LinkFarmerRequest): Promise<FarmerLinkageResponse> => {
      return apiClient.post<FarmerLinkageResponse>(`${basePath}/farmer/link`, data);
    },

    /**
     * Unlink a farmer from an FPO organization
     */
    unlinkFarmer: (data: UnlinkFarmerRequest): Promise<FarmerLinkageResponse> => {
      return apiClient.delete<FarmerLinkageResponse>(`${basePath}/farmer/unlink`, { params: { aaa_user_id: data.aaa_user_id, aaa_org_id: data.aaa_org_id } });
    },

    /**
     * Get farmer linkage status with an organization
     */
    getFarmerLinkage: (aaaUserId: string, aaaOrgId: string): Promise<FarmerLinkageResponse> => {
      return apiClient.get<FarmerLinkageResponse>(`${basePath}/farmer/linkage/${aaaUserId}/${aaaOrgId}`);
    },

    /**
     * Bulk link multiple farmers to an FPO organization
     *
     * @param data - Request containing aaa_org_id, aaa_user_ids array, and continue_on_error flag
     * @returns Response with success/failure counts and individual results
     *
     * @example
     * const result = await linkageService.bulkLinkFarmers({
     *   aaa_org_id: 'ORGN00000005',
     *   aaa_user_ids: ['USR00000001', 'USR00000002'],
     *   continue_on_error: true
     * });
     */
    bulkLinkFarmers: (data: BulkLinkFarmersRequest): Promise<BulkLinkageResponse> => {
      return apiClient.post<BulkLinkageResponse>(`${basePath}/farmer/bulk-link`, data);
    },

    /**
     * Bulk unlink multiple farmers from an FPO organization
     *
     * @param data - Request containing aaa_org_id, aaa_user_ids array, and continue_on_error flag
     * @returns Response with success/failure counts and individual results
     *
     * @example
     * const result = await linkageService.bulkUnlinkFarmers({
     *   aaa_org_id: 'ORGN00000005',
     *   aaa_user_ids: ['USR00000001', 'USR00000002'],
     *   continue_on_error: true
     * });
     */
    bulkUnlinkFarmers: (data: BulkUnlinkFarmersRequest): Promise<BulkLinkageResponse> => {
      return apiClient.deleteWithBody<BulkLinkageResponse>(`${basePath}/farmer/bulk-unlink`, data);
    }
  };
};

export default createLinkageService;
