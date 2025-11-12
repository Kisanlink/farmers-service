/**
 * FPO Service
 *
 * Service for FPO (Farmer Producer Organization) operations.
 * Uses factory pattern for dependency injection and testability.
 */

import { ApiClient } from '../utils/apiClient';
import {
  CreateFPORequest,
  RegisterFPORequest,
  FPOResponse,
  FPOReferenceResponse
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
     * Get FPO Reference by AAA Organization ID
     */
    getFPOReference: (aaaOrgId: string): Promise<FPOReferenceResponse> => {
      return apiClient.get<FPOReferenceResponse>(`${basePath}/reference/${aaaOrgId}`);
    }
  };
};

export default createFPOService;
