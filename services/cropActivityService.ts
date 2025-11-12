/**
 * Crop Activity Service
 *
 * Service for crop activity management operations (duplicate of activityService).
 * Uses factory pattern for dependency injection and testability.
 */

import { ApiClient } from '../utils/apiClient';
import {
  FarmActivityResponse,
  FarmActivityListResponse,
  CreateActivityRequest,
  CompleteActivityRequest,
  ActivityListQueryParams
} from '../types/activity.types';

/**
 * Create crop activity service with injected API client
 */
const createCropActivityService = (apiClient: ApiClient) => {
  const basePath = '/api/v1/crops';

  return {
    /**
     * List farm activities with filtering and pagination
     */
    listCropActivities: (queryParams?: ActivityListQueryParams): Promise<FarmActivityListResponse> => {
      return apiClient.get<FarmActivityListResponse>(`${basePath}/activities`, { params: queryParams });
    },

    /**
     * Create a new farm activity
     */
    createCropActivity: (data: CreateActivityRequest): Promise<FarmActivityResponse> => {
      return apiClient.post<FarmActivityResponse>(`${basePath}/activities`, data);
    },

    /**
     * Retrieve a specific farm activity by its ID
     */
    getCropActivityById: (activityId: string): Promise<FarmActivityResponse> => {
      return apiClient.get<FarmActivityResponse>(`${basePath}/activities/${activityId}`);
    },

    /**
     * Update an existing farm activity
     */
    updateCropActivity: (activityId: string, data: CreateActivityRequest): Promise<FarmActivityResponse> => {
      return apiClient.put<FarmActivityResponse>(`${basePath}/activities/${activityId}`, data);
    },

    /**
     * Complete a farm activity
     */
    completeCropActivity: (activityId: string, data: CompleteActivityRequest): Promise<FarmActivityResponse> => {
      return apiClient.post<FarmActivityResponse>(`${basePath}/activities/${activityId}/complete`, data);
    }
  };
};

export default createCropActivityService;
