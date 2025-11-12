/**
 * Stages Service
 *
 * Service for stage and crop-stage management.
 * Uses factory pattern for dependency injection and testability.
 */

import { ApiClient } from '../utils/apiClient';
import {
  StageResponse,
  StageListResponse,
  StageLookupResponse,
  CropStageResponse,
  CropStagesResponse,
  CreateStageRequest,
  UpdateStageRequest,
  AssignStageRequest,
  UpdateCropStageRequest,
  ReorderStagesRequest,
} from '../types/stages.types';
import { BaseResponse } from '../types';

/**
 * Create stages service with injected API client
 *
 * @param apiClient - Injected API client instance
 * @returns Stages service methods
 */
const createStagesService = (apiClient: ApiClient) => {
  return {
    // === Stage Management ===

    /**
     * List all stages with pagination and filtering
     */
    listStages: (params?: {
      page?: number;
      page_size?: number;
      search?: string;
      is_active?: boolean;
    }): Promise<StageListResponse> => {
      return apiClient.get<StageListResponse>('/api/v1/stages', { params });
    },

    /**
     * Get stage lookup data (id and name only)
     */
    getStageLookup: (): Promise<StageLookupResponse> => {
      return apiClient.get<StageLookupResponse>('/api/v1/stages/lookup');
    },

    /**
     * Create a new stage
     */
    createStage: (data: CreateStageRequest): Promise<StageResponse> => {
      return apiClient.post<StageResponse>('/api/v1/stages', data);
    },

    /**
     * Get a stage by ID
     */
    getStageById: (id: string): Promise<StageResponse> => {
      return apiClient.get<StageResponse>(`/api/v1/stages/${id}`);
    },

    /**
     * Update a stage
     */
    updateStage: (id: string, data: UpdateStageRequest): Promise<StageResponse> => {
      return apiClient.put<StageResponse>(`/api/v1/stages/${id}`, data);
    },

    /**
     * Delete a stage
     */
    deleteStage: (id: string): Promise<BaseResponse> => {
      return apiClient.delete<BaseResponse>(`/api/v1/stages/${id}`);
    },

    // === Crop Stage Management ===

    /**
     * Get all stages assigned to a crop
     */
    getCropStages: (cropId: string): Promise<CropStagesResponse> => {
      return apiClient.get<CropStagesResponse>(`/api/v1/crops/${cropId}/stages`);
    },

    /**
     * Assign a stage to a crop
     */
    assignStageToCrop: (cropId: string, data: AssignStageRequest): Promise<CropStageResponse> => {
      return apiClient.post<CropStageResponse>(`/api/v1/crops/${cropId}/stages`, data);
    },

    /**
     * Reorder stages for a crop
     */
    reorderCropStages: (cropId: string, data: ReorderStagesRequest): Promise<BaseResponse> => {
      return apiClient.post<BaseResponse>(`/api/v1/crops/${cropId}/stages/reorder`, data);
    },

    /**
     * Update a crop stage
     */
    updateCropStage: (
      cropId: string,
      stageId: string,
      data: UpdateCropStageRequest
    ): Promise<CropStageResponse> => {
      return apiClient.put<CropStageResponse>(`/api/v1/crops/${cropId}/stages/${stageId}`, data);
    },

    /**
     * Remove a stage from a crop
     */
    removeCropStage: (cropId: string, stageId: string): Promise<BaseResponse> => {
      return apiClient.delete<BaseResponse>(`/api/v1/crops/${cropId}/stages/${stageId}`);
    },
  };
};

export default createStagesService;
