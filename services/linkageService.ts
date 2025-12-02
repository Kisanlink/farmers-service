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
  FarmerLinkageResponse
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
    }
  };
};

export default createLinkageService;
