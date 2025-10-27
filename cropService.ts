import axios, { AxiosInstance } from 'axios';

// Crop-related interfaces
export interface CropData {
  id: string;
  name: string;
  scientific_name?: string;
  category: string;
  seasons: string[];
  unit: string;
  duration_days?: number;
  is_active: boolean;
  properties?: Record<string, string>;
  variety_count: number;
  perennial_yield?: {
    age_range_min?: number;
    age_range_max?: number;
    yield_per_tree?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CropLookupData {
  id: string;
  name: string;
  category: string;
  seasons: string[];
  unit: string;
}

export interface CropVarietyData {
  id: string;
  crop_id: string;
  crop_name: string;
  name: string;
  description?: string;
  duration_days?: number;
  is_active: boolean;
  properties?: Record<string, string>;
  yield_per_acre?: number;
  yield_per_tree?: number;
  yield_by_age?: Array<{
    age_from: number;
    age_to: number;
    yield_per_tree: number;
  }>;
  created_at: string;
  updated_at: string;
}

export interface VarietyLookupData {
  id: string;
  name: string;
  duration_days?: number;
}

// Request interfaces
export interface CreateCropRequest {
  name: string;
  scientific_name?: string;
  category: string;
  seasons: string[];
  unit: string;
  duration_days?: number;
  properties?: Record<string, string>;
  metadata?: Record<string, string>;
  perennial_yield?: {
    age_range_min?: number;
    age_range_max?: number;
    yield_per_tree?: number;
  };
}

export interface UpdateCropRequest {
  id: string;
  name?: string;
  scientific_name?: string;
  category?: string;
  seasons?: string[];
  unit?: string;
  duration_days?: number;
  is_active?: boolean;
  properties?: Record<string, string>;
  metadata?: Record<string, string>;
  perennial_yield?: {
    age_range_min?: number;
    age_range_max?: number;
    yield_per_tree?: number;
  };
}

export interface CreateVarietyRequest {
  crop_id: string;
  name: string;
  description?: string;
  duration_days?: number;
  properties?: Record<string, string>;
  yield_per_acre?: number;
  yield_per_tree?: number;
  yield_by_age?: Array<{
    age_from: number;
    age_to: number;
    yield_per_tree: number;
  }>;
  metadata?: Record<string, string>;
}

export interface UpdateVarietyRequest {
  id: string;
  name?: string;
  description?: string;
  duration_days?: number;
  is_active?: boolean;
  properties?: Record<string, string>;
  yield_per_acre?: number;
  yield_per_tree?: number;
  yield_by_age?: Array<{
    age_from: number;
    age_to: number;
    yield_per_tree: number;
  }>;
  metadata?: Record<string, string>;
}

// Response interfaces
export interface CropResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: CropData;
}

export interface CropListResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: CropData[];
  page: number;
  page_size: number;
  total: number;
}

export interface CropLookupResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: CropLookupData[];
}

export interface VarietyResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: CropVarietyData;
}

export interface VarietyListResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: CropVarietyData[];
  page: number;
  page_size: number;
  total: number;
}

export interface VarietyLookupResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: VarietyLookupData[];
}

export interface LookupResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: string[];
}

export interface BaseResponse {
  success: boolean;
  message: string;
  request_id: string;
}

/**
 * Crop Service
 * Handles all crop-related API calls
 */
export class CropService {
  private apiClient: AxiosInstance;
  private readonly API_BASE_URL: string;

  constructor(baseURL: string = 'http://localhost:8000') {
    this.API_BASE_URL = baseURL;
    this.apiClient = axios.create({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.apiClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // === Crop Management ===

  /**
   * List all crops with pagination and filtering
   * GET /api/v1/crops
   */
  async listCrops(params?: {
    category?: string;
    season?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<CropListResponse> {
    try {
      const response = await this.apiClient.get<CropListResponse>('/api/v1/crops', {
        params,
      });
      return response.data;
    } catch (error: any) {
      console.error('Error listing crops:', error);
      throw error;
    }
  }

  /**
   * Get crop lookup data (id and name only)
   * GET /api/v1/lookups/crops
   */
  async getCropLookup(params?: {
    category?: string;
    season?: string;
  }): Promise<CropLookupResponse> {
    try {
      const response = await this.apiClient.get<CropLookupResponse>('/api/v1/lookups/crops', {
        params,
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching crop lookup:', error);
      throw error;
    }
  }

  /**
   * Create a new crop
   * POST /api/v1/crops
   */
  async createCrop(data: CreateCropRequest): Promise<CropResponse> {
    try {
      // Ensure all values in properties are strings
      const stringifiedProperties = data.properties ? 
        Object.fromEntries(
          Object.entries(data.properties).map(([key, value]) => [key, String(value)])
        ) : undefined;
      
      const requestData = {
        ...data,
        properties: stringifiedProperties,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      };
      
      const response = await this.apiClient.post<CropResponse>('/api/v1/crops', requestData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating crop:', error);
      throw error;
    }
  }

  /**
   * Get a crop by ID
   * GET /api/v1/crops/{id}
   */
  async getCropById(id: string): Promise<CropResponse> {
    try {
      const response = await this.apiClient.get<CropResponse>(`/api/v1/crops/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching crop ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update a crop
   * PUT /api/v1/crops/{id}
   */
  async updateCrop(id: string, data: UpdateCropRequest): Promise<CropResponse> {
    try {
      // Ensure all values in properties are strings
      const stringifiedProperties = data.properties ? 
        Object.fromEntries(
          Object.entries(data.properties).map(([key, value]) => [key, String(value)])
        ) : undefined;
      
      const requestData = {
        ...data,
        properties: stringifiedProperties,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      };
      
      const response = await this.apiClient.put<CropResponse>(`/api/v1/crops/${id}`, requestData);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating crop ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a crop (soft delete)
   * DELETE /api/v1/crops/{id}
   */
  async deleteCrop(id: string): Promise<BaseResponse> {
    try {
      const response = await this.apiClient.delete<BaseResponse>(`/api/v1/crops/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error deleting crop ${id}:`, error);
      throw error;
    }
  }

  // === Lookup Data ===

  /**
   * Get crop categories
   * GET /api/v1/lookups/crop-categories
   */
  async getCropCategories(): Promise<LookupResponse> {
    try {
      const response = await this.apiClient.get<LookupResponse>('/api/v1/lookups/crop-categories');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching crop categories:', error);
      throw error;
    }
  }

  /**
   * Get crop seasons
   * GET /api/v1/lookups/crop-seasons
   */
  async getCropSeasons(): Promise<LookupResponse> {
    try {
      const response = await this.apiClient.get<LookupResponse>('/api/v1/lookups/crop-seasons');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching crop seasons:', error);
      throw error;
    }
  }

  // === Crop Varieties ===

  /**
   * List crop varieties with pagination and filtering
   * GET /api/v1/varieties
   */
  async listVarieties(params?: {
    crop_id?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<VarietyListResponse> {
    try {
      const response = await this.apiClient.get<VarietyListResponse>('/api/v1/varieties', {
        params,
      });
      return response.data;
    } catch (error: any) {
      console.error('Error listing varieties:', error);
      throw error;
    }
  }

  /**
   * Get variety lookup data for a specific crop
   * GET /api/v1/lookups/varieties/{crop_id}
   */
  async getVarietyLookup(cropId: string): Promise<VarietyLookupResponse> {
    try {
      const response = await this.apiClient.get<VarietyLookupResponse>(`/api/v1/lookups/varieties/${cropId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching variety lookup for crop ${cropId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new crop variety
   * POST /api/v1/varieties
   */
  async createVariety(data: CreateVarietyRequest): Promise<VarietyResponse> {
    try {
      // Ensure all values in properties are strings
      const stringifiedProperties = data.properties ? 
        Object.fromEntries(
          Object.entries(data.properties).map(([key, value]) => [key, String(value)])
        ) : undefined;
      
      const requestData = {
        ...data,
        properties: stringifiedProperties,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      };
      
      const response = await this.apiClient.post<VarietyResponse>('/api/v1/varieties', requestData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating variety:', error);
      throw error;
    }
  }

  /**
   * Get a variety by ID
   * GET /api/v1/varieties/{id}
   */
  async getVarietyById(id: string): Promise<VarietyResponse> {
    try {
      const response = await this.apiClient.get<VarietyResponse>(`/api/v1/varieties/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching variety ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update a variety
   * PUT /api/v1/varieties/{id}
   */
  async updateVariety(id: string, data: UpdateVarietyRequest): Promise<VarietyResponse> {
    try {
      // Ensure all values in properties are strings
      const stringifiedProperties = data.properties ? 
        Object.fromEntries(
          Object.entries(data.properties).map(([key, value]) => [key, String(value)])
        ) : undefined;
      
      const requestData = {
        ...data,
        properties: stringifiedProperties,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      };
      
      const response = await this.apiClient.put<VarietyResponse>(`/api/v1/varieties/${id}`, requestData);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating variety ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a variety (soft delete)
   * DELETE /api/v1/varieties/{id}
   */
  async deleteVariety(id: string): Promise<BaseResponse> {
    try {
      const response = await this.apiClient.delete<BaseResponse>(`/api/v1/varieties/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error deleting variety ${id}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const cropService = new CropService();