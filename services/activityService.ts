/**
 * Activity Service
 *
 * Service for farm activity management operations.
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
import { BaseResponse } from '../types';

/**
 * Create activity service with injected API client
 */
const createActivityService = (apiClient: ApiClient) => {
  const basePath = '/api/v1/crops';

  return {
    /**
     * List farm activities with optional filtering
     */
    listActivities: (params?: ActivityListQueryParams): Promise<FarmActivityListResponse> => {
      return apiClient.get<FarmActivityListResponse>(`${basePath}/activities`, { params });
    },

    /**
     * Create a new farm activity within a crop cycle
     */
    createActivity: (activityData: CreateActivityRequest): Promise<FarmActivityResponse> => {
      return apiClient.post<FarmActivityResponse>(`${basePath}/activities`, activityData);
    },

    /**
     * Get activity by ID
     */
    getActivityById: (activityId: string): Promise<FarmActivityResponse> => {
      return apiClient.get<FarmActivityResponse>(`${basePath}/activities/${activityId}`);
    },

    /**
     * Update activity by ID
     */
    updateActivity: (activityId: string, activityData: Partial<CreateActivityRequest>): Promise<FarmActivityResponse> => {
      return apiClient.put<FarmActivityResponse>(`${basePath}/activities/${activityId}`, activityData);
    },

    /**
     * Delete activity by ID
     */
    deleteActivity: (activityId: string): Promise<BaseResponse> => {
      return apiClient.delete<BaseResponse>(`${basePath}/activities/${activityId}`);
    },

    /**
     * Complete an activity
     */
    completeActivity: (activityId: string, completionData: CompleteActivityRequest): Promise<FarmActivityResponse> => {
      return apiClient.post<FarmActivityResponse>(`${basePath}/activities/${activityId}/complete`, completionData);
    }
  };
};

export default createActivityService;
