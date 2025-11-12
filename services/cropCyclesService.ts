/**
 * Crop Cycles Service
 *
 * Service for crop cycle management.
 * Uses factory pattern for dependency injection and testability.
 */

import { ApiClient } from '../utils/apiClient';
import {
  CropCycleResponse,
  CropCycleListResponse,
  CreateCropCycleRequest,
  UpdateCropCycleRequest,
  EndCropCycleRequest,
} from '../types/cropCycles.types';

/**
 * Create crop cycles service with injected API client
 *
 * @param apiClient - Injected API client instance
 * @returns Crop cycles service methods
 */
const createCropCyclesService = (apiClient: ApiClient) => {
  return {
    /**
     * List all crop cycles with pagination and filtering
     */
    listCropCycles: (params?: {
      page?: number;
      page_size?: number;
      farm_id?: string;
      status?: string;
      season?: string;
    }): Promise<CropCycleListResponse> => {
      return apiClient.get<CropCycleListResponse>('/api/v1/crops/cycles', { params });
    },

    /**
     * Start a new crop cycle
     */
    createCropCycle: (data: CreateCropCycleRequest): Promise<CropCycleResponse> => {
      return apiClient.post<CropCycleResponse>('/api/v1/crops/cycles', data);
    },

    /**
     * Get a crop cycle by ID
     */
    getCropCycleById: (cycleId: string): Promise<CropCycleResponse> => {
      return apiClient.get<CropCycleResponse>(`/api/v1/crops/cycles/${cycleId}`);
    },

    /**
     * Update a crop cycle
     */
    updateCropCycle: (cycleId: string, data: UpdateCropCycleRequest): Promise<CropCycleResponse> => {
      return apiClient.put<CropCycleResponse>(`/api/v1/crops/cycles/${cycleId}`, data);
    },

    /**
     * End a crop cycle
     */
    endCropCycle: (cycleId: string, data: EndCropCycleRequest): Promise<CropCycleResponse> => {
      return apiClient.put<CropCycleResponse>(`/api/v1/crops/cycles/${cycleId}/end`, data);
    },
  };
};

export default createCropCyclesService;
