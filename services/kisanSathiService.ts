/**
 * KisanSathi Service
 *
 * Service for KisanSathi (field agent) management operations.
 * Uses factory pattern for dependency injection and testability.
 */

import { ApiClient } from '../utils/apiClient';
import {
  CreateKisanSathiRequest,
  AssignKisanSathiRequest,
  ReassignKisanSathiRequest,
  KisanSathiResponse,
  KisanSathiAssignmentResponse
} from '../types/kisanSathi.types';

/**
 * Create KisanSathi service with injected API client
 */
const createKisanSathiService = (apiClient: ApiClient) => {
  const basePath = '/api/v1/kisansathi';

  return {
    /**
     * Create a new KisanSathi user
     */
    createKisanSathi: (data: CreateKisanSathiRequest): Promise<KisanSathiResponse> => {
      return apiClient.post<KisanSathiResponse>(`${basePath}/create-user`, data);
    },

    /**
     * Assign a KisanSathi to a farmer
     */
    assignKisanSathi: (data: AssignKisanSathiRequest): Promise<KisanSathiAssignmentResponse> => {
      return apiClient.post<KisanSathiAssignmentResponse>(`${basePath}/assign`, data);
    },

    /**
     * Reassign or remove a KisanSathi from a farmer
     */
    reassignKisanSathi: (data: ReassignKisanSathiRequest): Promise<KisanSathiAssignmentResponse> => {
      return apiClient.post<KisanSathiAssignmentResponse>(`${basePath}/reassign`, data);
    },

    /**
     * Get KisanSathi assignment for a farmer and organization
     */
    getKisanSathiAssignment: (farmerId: string, orgId: string): Promise<KisanSathiAssignmentResponse> => {
      return apiClient.get<KisanSathiAssignmentResponse>(`${basePath}/assignment/${farmerId}/${orgId}`);
    },

    /**
     * Get all KisanSathis
     */
    getAllKisanSathis: (params?: { page?: number; page_size?: number; org_id?: string }): Promise<KisanSathiResponse> => {
      return apiClient.get<KisanSathiResponse>(`${basePath}`, { params });
    },

    /**
     * Get KisanSathi by ID
     */
    getKisanSathiById: (id: string): Promise<KisanSathiResponse> => {
      return apiClient.get<KisanSathiResponse>(`${basePath}/${id}`);
    }
  };
};

export default createKisanSathiService;
