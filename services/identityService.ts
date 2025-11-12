/**
 * Identity Service
 *
 * Service for farmer identity management operations.
 * Uses factory pattern for dependency injection and testability.
 */

import { ApiClient } from '../utils/apiClient';
import {
  FarmerResponse,
  FarmerListResponse,
  CreateFarmerRequest,
  UpdateFarmerRequest,
  LinkFarmerRequest,
  ReassignKisanSathiRequest,
  FarmerListQueryParams,
  FarmerLinkageResponse,
  KisanSathiAssignmentResponse
} from '../types/identity.types';
import { BaseResponse } from '../types';

/**
 * Create identity service with injected API client
 */
const createIdentityService = (apiClient: ApiClient) => {
  const basePath = '/api/v1/identity';

  return {
    /**
     * List farmers with filtering and pagination
     */
    listFarmers: (params?: FarmerListQueryParams): Promise<FarmerListResponse> => {
      return apiClient.get<FarmerListResponse>(`${basePath}/farmers`, { params });
    },

    /**
     * Create a new farmer profile
     */
    createFarmer: (farmerData: CreateFarmerRequest): Promise<FarmerResponse> => {
      return apiClient.post<FarmerResponse>(`${basePath}/farmers`, farmerData);
    },

    /**
     * Get farmer by farmer ID (primary key)
     */
    getFarmerById: (farmerId: string): Promise<FarmerResponse> => {
      return apiClient.get<FarmerResponse>(`${basePath}/farmers/id/${farmerId}`);
    },

    /**
     * Update farmer by farmer ID (primary key)
     */
    updateFarmerById: (farmerId: string, farmerData: UpdateFarmerRequest): Promise<FarmerResponse> => {
      return apiClient.put<FarmerResponse>(`${basePath}/farmers/id/${farmerId}`, farmerData);
    },

    /**
     * Delete farmer by farmer ID (primary key)
     */
    deleteFarmerById: (farmerId: string): Promise<BaseResponse> => {
      return apiClient.delete<BaseResponse>(`${basePath}/farmers/id/${farmerId}`);
    },

    /**
     * Get farmer by user ID only
     */
    getFarmerByUserId: (userId: string): Promise<FarmerResponse> => {
      return apiClient.get<FarmerResponse>(`${basePath}/farmers/user/${userId}`);
    },

    /**
     * Update farmer by user ID only
     */
    updateFarmerByUserId: (userId: string, farmerData: UpdateFarmerRequest): Promise<FarmerResponse> => {
      return apiClient.put<FarmerResponse>(`${basePath}/farmers/user/${userId}`, farmerData);
    },

    /**
     * Delete farmer by user ID only
     */
    deleteFarmerByUserId: (userId: string): Promise<BaseResponse> => {
      return apiClient.delete<BaseResponse>(`${basePath}/farmers/user/${userId}`);
    },

    /**
     * Get farmer by user ID and org ID
     */
    getFarmerByUserIdAndOrgId: (userId: string, orgId: string): Promise<FarmerResponse> => {
      return apiClient.get<FarmerResponse>(`${basePath}/farmers/user/${userId}/org/${orgId}`);
    },

    /**
     * Update farmer by user ID and org ID
     */
    updateFarmerByUserIdAndOrgId: (userId: string, orgId: string, farmerData: UpdateFarmerRequest): Promise<FarmerResponse> => {
      return apiClient.put<FarmerResponse>(`${basePath}/farmers/user/${userId}/org/${orgId}`, farmerData);
    },

    /**
     * Delete farmer by user ID and org ID
     */
    deleteFarmerByUserIdAndOrgId: (userId: string, orgId: string): Promise<BaseResponse> => {
      return apiClient.delete<BaseResponse>(`${basePath}/farmers/user/${userId}/org/${orgId}`);
    },

    /**
     * Link farmer to FPO
     */
    linkFarmerToFPO: (linkData: LinkFarmerRequest): Promise<FarmerLinkageResponse> => {
      return apiClient.post<FarmerLinkageResponse>(`${basePath}/farmers/link`, linkData);
    },

    /**
     * Get farmer linkage status
     */
    getFarmerLinkageStatus: (userId: string, orgId: string): Promise<FarmerLinkageResponse> => {
      return apiClient.get<FarmerLinkageResponse>(`${basePath}/farmers/link/user/${userId}/org/${orgId}`);
    },

    /**
     * Unlink farmer from FPO
     */
    unlinkFarmerFromFPO: (userId: string, orgId: string): Promise<FarmerLinkageResponse> => {
      return apiClient.delete<FarmerLinkageResponse>(`${basePath}/farmers/link/user/${userId}/org/${orgId}`);
    },

    /**
     * Reassign KisanSathi to farmer
     */
    reassignKisanSathi: (reassignData: ReassignKisanSathiRequest): Promise<KisanSathiAssignmentResponse> => {
      return apiClient.post<KisanSathiAssignmentResponse>(`${basePath}/farmers/reassign-kisansathi`, reassignData);
    }
  };
};

export default createIdentityService;
