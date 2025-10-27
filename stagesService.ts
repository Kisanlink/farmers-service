import axios, { AxiosInstance } from 'axios';

// Stage-related interfaces
export interface StageData {
  id: string;
  stage_name: string;
  description: string;
  is_active: boolean;
  metadata?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface StageLookupData {
  id: string;
  stage_name: string;
}

export interface CropStageData {
  id: string;
  crop_id: string;
  stage_id: string;
  stage_name: string;
  stage_description: string;
  order_index: number;
  duration_days?: number;
  is_active: boolean;
  metadata?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

// Request interfaces
export interface CreateStageRequest {
  stage_name: string;
  description: string;
  is_active?: boolean;
  metadata?: Record<string, string>;
}

export interface UpdateStageRequest {
  stage_name?: string;
  description?: string;
  is_active?: boolean;
  metadata?: Record<string, string>;
}

export interface AssignStageRequest {
  stage_id: string;
  order_index: number;
  duration_days?: number;
  metadata?: Record<string, string>;
}

export interface UpdateCropStageRequest {
  order_index?: number;
  duration_days?: number;
  is_active?: boolean;
  metadata?: Record<string, string>;
}

export interface ReorderStagesRequest {
  stage_orders: Array<{
    stage_id: string;
    order_index: number;
  }>;
}

// Response interfaces
export interface StageResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: StageData;
}

export interface StageListResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: StageData[];
  page: number;
  page_size: number;
  total: number;
}

export interface StageLookupResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: StageLookupData[];
}

export interface CropStageResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: CropStageData;
}

export interface CropStagesResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: CropStageData[];
}

export interface BaseResponse {
  success: boolean;
  message: string;
  request_id: string;
}

/**
 * Stages Service
 * Handles all stage-related API calls
 */
export class StagesService {
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

  // Removed permission parameters helper method as they're not needed for stages APIs

  /**
   * List all stages with pagination and filtering
   * GET /api/v1/stages
   */
  async listStages(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    is_active?: boolean;
  }): Promise<StageListResponse> {
    try {
      const response = await this.apiClient.get<StageListResponse>('/api/v1/stages', {
        params,
      });
      return response.data;
    } catch (error: any) {
      console.error('Error listing stages:', error);
      throw error;
    }
  }

  /**
   * Get stage lookup data (id and name only)
   * GET /api/v1/stages/lookup
   */
  async getStageLookup(): Promise<StageLookupResponse> {
    try {
      const response = await this.apiClient.get<StageLookupResponse>('/api/v1/stages/lookup');
      return response.data;
    } catch (error) {
      console.error('Error fetching stage lookup:', error);
      throw error;
    }
  }

  /**
   * Create a new stage
   * POST /api/v1/stages
   */
  async createStage(data: CreateStageRequest): Promise<StageResponse> {
    try {
      const response = await this.apiClient.post<StageResponse>('/api/v1/stages', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating stage:', error);
      throw error;
    }
  }

  /**
   * Get a stage by ID
   * GET /api/v1/stages/{id}
   */
  async getStageById(id: string): Promise<StageResponse> {
    try {
      const response = await this.apiClient.get<StageResponse>(`/api/v1/stages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stage ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update a stage
   * PUT /api/v1/stages/{id}
   */
  async updateStage(id: string, data: UpdateStageRequest): Promise<StageResponse> {
    try {
      const response = await this.apiClient.put<StageResponse>(`/api/v1/stages/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating stage ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a stage
   * DELETE /api/v1/stages/{id}
   */
  async deleteStage(id: string): Promise<BaseResponse> {
    try {
      const response = await this.apiClient.delete<BaseResponse>(`/api/v1/stages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting stage ${id}:`, error);
      throw error;
    }
  }

  // === Crop Stage Management ===

  /**
   * Get all stages assigned to a crop
   * GET /api/v1/crops/{id}/stages
   */
  async getCropStages(cropId: string): Promise<CropStagesResponse> {
    try {
      const response = await this.apiClient.get<CropStagesResponse>(`/api/v1/crops/${cropId}/stages`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stages for crop ${cropId}:`, error);
      throw error;
    }
  }

  /**
   * Assign a stage to a crop
   * POST /api/v1/crops/{id}/stages
   */
  async assignStageToCrop(cropId: string, data: AssignStageRequest): Promise<CropStageResponse> {
    try {
      const response = await this.apiClient.post<CropStageResponse>(`/api/v1/crops/${cropId}/stages`, data);
      return response.data;
    } catch (error) {
      console.error(`Error assigning stage to crop ${cropId}:`, error);
      throw error;
    }
  }

  /**
   * Reorder stages for a crop
   * POST /api/v1/crops/{id}/stages/reorder
   */
  async reorderCropStages(cropId: string, data: ReorderStagesRequest): Promise<BaseResponse> {
    try {
      const response = await this.apiClient.post<BaseResponse>(`/api/v1/crops/${cropId}/stages/reorder`, data);
      return response.data;
    } catch (error) {
      console.error(`Error reordering stages for crop ${cropId}:`, error);
      throw error;
    }
  }

  /**
   * Update a crop stage
   * PUT /api/v1/crops/{id}/stages/{stage_id}
   */
  async updateCropStage(cropId: string, stageId: string, data: UpdateCropStageRequest): Promise<CropStageResponse> {
    try {
      const response = await this.apiClient.put<CropStageResponse>(`/api/v1/crops/${cropId}/stages/${stageId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating crop stage ${stageId} for crop ${cropId}:`, error);
      throw error;
    }
  }

  /**
   * Remove a stage from a crop
   * DELETE /api/v1/crops/{id}/stages/{stage_id}
   */
  async removeCropStage(cropId: string, stageId: string): Promise<BaseResponse> {
    try {
      const response = await this.apiClient.delete<BaseResponse>(`/api/v1/crops/${cropId}/stages/${stageId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing stage ${stageId} from crop ${cropId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const stagesService = new StagesService();

