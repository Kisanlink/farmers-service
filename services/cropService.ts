/**
 * Crop Service
 *
 * Service for crop and variety management.
 * Uses factory pattern for dependency injection and testability.
 */

import { ApiClient } from '../utils/apiClient';
import {
  CropResponse,
  CropListResponse,
  CropLookupResponse,
  VarietyResponse,
  VarietyListResponse,
  VarietyLookupResponse,
  LookupResponse,
  CreateCropRequest,
  UpdateCropRequest,
  CreateVarietyRequest,
  UpdateVarietyRequest,
} from '../types/crop.types';
import { BaseResponse } from '../types';

/**
 * Helper to stringify properties for API compatibility
 */
const stringifyProperties = (properties?: Record<string, string>) => {
  if (!properties) return undefined;
  return Object.fromEntries(
    Object.entries(properties).map(([key, value]) => [key, String(value)])
  );
};

/**
 * Create crop service with injected API client
 *
 * @param apiClient - Injected API client instance
 * @returns Crop service methods
 */
const createCropService = (apiClient: ApiClient) => {
  return {
    // === Crop Management ===

    /**
     * List all crops with pagination and filtering
     */
    listCrops: (params?: {
      category?: string;
      season?: string;
      search?: string;
      page?: number;
      page_size?: number;
    }): Promise<CropListResponse> => {
      return apiClient.get<CropListResponse>('/api/v1/crops', { params });
    },

    /**
     * Get crop lookup data (id and name only)
     */
    getCropLookup: (params?: {
      category?: string;
      season?: string;
    }): Promise<CropLookupResponse> => {
      return apiClient.get<CropLookupResponse>('/api/v1/lookups/crops', { params });
    },

    /**
     * Create a new crop
     */
    createCrop: (data: CreateCropRequest): Promise<CropResponse> => {
      const requestData = {
        ...data,
        properties: stringifyProperties(data.properties),
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      };
      return apiClient.post<CropResponse>('/api/v1/crops', requestData);
    },

    /**
     * Get a crop by ID
     */
    getCropById: (id: string): Promise<CropResponse> => {
      return apiClient.get<CropResponse>(`/api/v1/crops/${id}`);
    },

    /**
     * Update a crop
     */
    updateCrop: (id: string, data: UpdateCropRequest): Promise<CropResponse> => {
      const requestData = {
        ...data,
        properties: stringifyProperties(data.properties),
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      };
      return apiClient.put<CropResponse>(`/api/v1/crops/${id}`, requestData);
    },

    /**
     * Delete a crop (soft delete)
     */
    deleteCrop: (id: string): Promise<BaseResponse> => {
      return apiClient.delete<BaseResponse>(`/api/v1/crops/${id}`);
    },

    // === Lookup Data ===

    /**
     * Get crop categories
     */
    getCropCategories: (): Promise<LookupResponse> => {
      return apiClient.get<LookupResponse>('/api/v1/lookups/crop-categories');
    },

    /**
     * Get crop seasons
     */
    getCropSeasons: (): Promise<LookupResponse> => {
      return apiClient.get<LookupResponse>('/api/v1/lookups/crop-seasons');
    },

    // === Crop Varieties ===

    /**
     * List crop varieties with pagination and filtering
     */
    listVarieties: (params?: {
      crop_id?: string;
      search?: string;
      page?: number;
      page_size?: number;
    }): Promise<VarietyListResponse> => {
      return apiClient.get<VarietyListResponse>('/api/v1/varieties', { params });
    },

    /**
     * Get variety lookup data for a specific crop
     */
    getVarietyLookup: (cropId: string): Promise<VarietyLookupResponse> => {
      return apiClient.get<VarietyLookupResponse>(`/api/v1/lookups/varieties/${cropId}`);
    },

    /**
     * Create a new crop variety
     */
    createVariety: (data: CreateVarietyRequest): Promise<VarietyResponse> => {
      const requestData = {
        ...data,
        properties: stringifyProperties(data.properties),
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      };
      return apiClient.post<VarietyResponse>('/api/v1/varieties', requestData);
    },

    /**
     * Get a variety by ID
     */
    getVarietyById: (id: string): Promise<VarietyResponse> => {
      return apiClient.get<VarietyResponse>(`/api/v1/varieties/${id}`);
    },

    /**
     * Update a variety
     */
    updateVariety: (id: string, data: UpdateVarietyRequest): Promise<VarietyResponse> => {
      const requestData = {
        ...data,
        properties: stringifyProperties(data.properties),
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      };
      return apiClient.put<VarietyResponse>(`/api/v1/varieties/${id}`, requestData);
    },

    /**
     * Delete a variety (soft delete)
     */
    deleteVariety: (id: string): Promise<BaseResponse> => {
      return apiClient.delete<BaseResponse>(`/api/v1/varieties/${id}`);
    },
  };
};

export default createCropService;
