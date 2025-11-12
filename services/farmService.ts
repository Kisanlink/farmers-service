/**
 * Farm Service
 *
 * Service for farm management and spatial operations.
 * Uses factory pattern for dependency injection and testability.
 */

import { ApiClient } from '../utils/apiClient';
import {
  FarmResponse,
  FarmListResponse,
  CreateFarmRequest,
  FarmListQueryParams
} from '../types/farm.types';
import { BaseResponse } from '../types';

/**
 * Create farm service with injected API client
 */
const createFarmService = (apiClient: ApiClient) => {
  const basePath = '/api/v1';

  return {
    /**
     * List all farms with optional filtering
     */
    listFarms: (params?: FarmListQueryParams): Promise<FarmListResponse> => {
      return apiClient.get<FarmListResponse>(`${basePath}/farms`, { params });
    },

    /**
     * Create a new farm with geographic boundaries and metadata
     */
    createFarm: (farmData: CreateFarmRequest): Promise<FarmResponse> => {
      return apiClient.post<FarmResponse>(`${basePath}/farms`, farmData);
    },

    /**
     * Get farm by ID
     */
    getFarmById: (farmId: string): Promise<FarmResponse> => {
      return apiClient.get<FarmResponse>(`${basePath}/farms/${farmId}`);
    },

    /**
     * Update farm by ID
     */
    updateFarm: (farmId: string, farmData: Partial<CreateFarmRequest>): Promise<FarmResponse> => {
      return apiClient.put<FarmResponse>(`${basePath}/farms/${farmId}`, farmData);
    },

    /**
     * Delete farm by ID
     */
    deleteFarm: (farmId: string): Promise<BaseResponse> => {
      return apiClient.delete<BaseResponse>(`${basePath}/farms/${farmId}`);
    },

    /**
     * Get farm centroids for mapping
     */
    getFarmCentroids: (): Promise<any> => {
      return apiClient.get<any>(`${basePath}/getFarmCentroids`);
    },

    /**
     * Get farm heatmap data
     */
    getFarmHeatmap: (radius: number = 5): Promise<any> => {
      return apiClient.get<any>(`${basePath}/getFarmHeatmap`, { params: { radius } });
    },

    /**
     * Detect farm overlaps
     */
    detectFarmOverlaps: (params?: {
      limit?: number;
      min_overlap_area_ha?: number;
      org_id?: string;
    }): Promise<any> => {
      return apiClient.post<any>(`${basePath}/detectFarmOverlaps`, params || {});
    },

    /**
     * Validate geometry data
     */
    validateGeometry: (wkt: string, checkBounds: boolean = true): Promise<any> => {
      return apiClient.post<any>(`${basePath}/validateGeometry`, {
        wkt,
        check_bounds: checkBounds
      });
    },

    /**
     * Rebuild spatial indexes (admin operation)
     */
    rebuildSpatialIndexes: (): Promise<any> => {
      return apiClient.post<any>(`${basePath}/rebuildSpatialIndexes`);
    }
  };
};

export default createFarmService;
