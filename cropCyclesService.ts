import axios, { AxiosInstance } from 'axios';

// Crop Cycle-related interfaces
export interface CropCycleData {
  id: string;
  farm_id: string;
  farmer_id: string;
  crop_id: string;
  crop_name: string;
  variety_id?: string;
  variety_name?: string;
  season: string;
  start_date: string;
  end_date?: string;
  area_ha?: number;
  status: string;
  outcome?: Record<string, string>;
  metadata?: Record<string, string>;
  perennial_yield?: {
    age_range_min?: number;
    age_range_max?: number;
    yield_per_tree?: number;
  };
  created_at: string;
  updated_at: string;
  // Additional properties used in the UI
  crop?: {
    id: string;
    crop_name: string;
    variant: string;
    season: string;
  };
  expected_quantity?: number;
  quantity?: number;
  report?: string;
}

// Request interfaces
export interface CreateCropCycleRequest {
  farm_id: string;
  crop_id: string;
  variety_id?: string;
  season: string;
  start_date: string;
  area_ha?: number;
  perennial_yield?: {
    age_range_min?: number;
    age_range_max?: number;
    yield_per_tree?: number;
  };
}

export interface UpdateCropCycleRequest {
  id: string;
  crop_id?: string;
  variety_id?: string;
  season?: string;
  start_date?: string;
  area_ha?: number;
  perennial_yield?: {
    age_range_min?: number;
    age_range_max?: number;
    yield_per_tree?: number;
  };
}

export interface EndCropCycleRequest {
  id: string;
  end_date: string;
  status: 'COMPLETED' | 'CANCELLED';
  outcome?: Record<string, string>;
  metadata?: Record<string, string>;
}

// Response interfaces
export interface CropCycleResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: CropCycleData;
}

export interface CropCycleListResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: CropCycleData[];
  page: number;
  page_size: number;
  total: number;
}

export interface BaseResponse {
  success: boolean;
  message: string;
  request_id: string;
}

/**
 * Crop Cycles Service
 * Handles all crop cycle-related API calls
 */
export class CropCyclesService {
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

  /**
   * List all crop cycles with pagination and filtering
   * GET /api/v1/crops/cycles
   */
  async listCropCycles(params?: {
    page?: number;
    page_size?: number;
    farm_id?: string;
    status?: string;
    season?: string;
  }): Promise<CropCycleListResponse> {
    try {
      const response = await this.apiClient.get<CropCycleListResponse>('/api/v1/crops/cycles', {
        params,
      });
      return response.data;
    } catch (error: any) {
      console.error('Error listing crop cycles:', error);
      throw error;
    }
  }

  /**
   * Start a new crop cycle
   * POST /api/v1/crops/cycles
   */
  async createCropCycle(data: CreateCropCycleRequest): Promise<CropCycleResponse> {
    try {
      const response = await this.apiClient.post<CropCycleResponse>('/api/v1/crops/cycles', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating crop cycle:', error);
      throw error;
    }
  }

  /**
   * Get a crop cycle by ID
   * GET /api/v1/crops/cycles/{cycle_id}
   */
  async getCropCycleById(cycleId: string): Promise<CropCycleResponse> {
    try {
      const response = await this.apiClient.get<CropCycleResponse>(`/api/v1/crops/cycles/${cycleId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching crop cycle ${cycleId}:`, error);
      throw error;
    }
  }

  /**
   * Update a crop cycle
   * PUT /api/v1/crops/cycles/{cycle_id}
   */
  async updateCropCycle(cycleId: string, data: UpdateCropCycleRequest): Promise<CropCycleResponse> {
    try {
      const response = await this.apiClient.put<CropCycleResponse>(`/api/v1/crops/cycles/${cycleId}`, data);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating crop cycle ${cycleId}:`, error);
      throw error;
    }
  }

  /**
   * End a crop cycle
   * PUT /api/v1/crops/cycles/{cycle_id}/end
   */
  async endCropCycle(cycleId: string, data: EndCropCycleRequest): Promise<CropCycleResponse> {
    try {
      const response = await this.apiClient.put<CropCycleResponse>(`/api/v1/crops/cycles/${cycleId}/end`, data);
      return response.data;
    } catch (error: any) {
      console.error(`Error ending crop cycle ${cycleId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const cropCyclesService = new CropCyclesService();
