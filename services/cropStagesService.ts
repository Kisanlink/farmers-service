/**
 * Crop Stages Service
 *
 * Service for crop stage assignments and management.
 * Uses factory pattern for dependency injection and testability.
 */

import { ApiClient } from '../utils/apiClient';
import {
  CropStagesResponse,
  CropStageResponse,
  BaseResponse,
  AssignStageRequest,
  ReorderStagesRequest,
  UpdateCropStageRequest,
} from '../types/cropStages.types';

/**
 * Create crop stages service with injected API client
 *
 * @param apiClient - Injected API client instance
 * @returns Crop stages service methods
 */
const createCropStagesService = (apiClient: ApiClient) => {
  return {
    /**
     * List crop stages for a specific crop
     */
    listCropStages: (cropId: string): Promise<CropStagesResponse> => {
      return apiClient.get<CropStagesResponse>(`/api/v1/crops/${cropId}/stages`);
    },

    /**
     * Assign a stage to a crop
     */
    assignStageToCrop: (cropId: string, req: AssignStageRequest): Promise<CropStageResponse> => {
      return apiClient.post<CropStageResponse>(`/api/v1/crops/${cropId}/stages`, req);
    },

    /**
     * Reorder crop stages
     */
    reorderCropStages: (cropId: string, req: ReorderStagesRequest): Promise<BaseResponse<null>> => {
      return apiClient.post<BaseResponse<null>>(`/api/v1/crops/${cropId}/stages/reorder`, req);
    },

    /**
     * Update a crop stage
     */
    updateCropStage: (
      cropId: string,
      stageId: string,
      req: UpdateCropStageRequest
    ): Promise<CropStageResponse> => {
      return apiClient.put<CropStageResponse>(`/api/v1/crops/${cropId}/stages/${stageId}`, req);
    },

    /**
     * Remove a stage from a crop
     */
    removeCropStage: (cropId: string, stageId: string): Promise<BaseResponse<null>> => {
      return apiClient.delete<BaseResponse<null>>(`/api/v1/crops/${cropId}/stages/${stageId}`);
    },
  };
};

export default createCropStagesService;
