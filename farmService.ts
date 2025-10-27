import axios, { AxiosResponse } from 'axios';
import {
  FarmResponse,
  FarmListResponse,
  CreateFarmRequest,
  FarmListQueryParams,
  ApiConfig,
  ErrorResponse,
  BaseResponse
} from './types';

// API configuration
const API_CONFIG: ApiConfig = {
  baseUrl: (import.meta as any).env?.VITE_FARMER_SERVICE_URL || (import.meta as any).env?.VITE_FARMER_MODULE_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Ensure baseUrl doesn't have trailing slash to avoid redirect issues
if (API_CONFIG.baseUrl.endsWith('/')) {
  API_CONFIG.baseUrl = API_CONFIG.baseUrl.slice(0, -1);
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers
});

// Request interceptor for logging and auth
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token') || localStorage.getItem('authToken');
      if (token && !config.headers?.Authorization) {
        // Clean token and add Bearer prefix
        const cleanToken = token.replace(/^"|"$/g, '').replace(/^Bearer\s+/i, '');
        (config.headers = config.headers || {} as any).Authorization = `Bearer ${cleanToken}`;
      }
    } catch (_) {}
    
    // Log the full URL being called
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`[Farm Service] ${config.method?.toUpperCase()} ${fullUrl}`);
    console.log(`[Farm Service] Headers:`, config.headers);
    
    return config;
  },
  (error) => {
    console.error('[Farm Service] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[Farm Service] Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[Farm Service] Response error:', error.response?.data || error.message);
    
    // Handle 301 redirects specifically
    if (error.response?.status === 301) {
      console.error('[Farm Service] 301 Redirect detected. Check URL configuration.');
      console.error('[Farm Service] Request URL:', error.config?.url);
      console.error('[Farm Service] Base URL:', error.config?.baseURL);
      console.error('[Farm Service] Full URL:', `${error.config?.baseURL}${error.config?.url}`);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Farm Service for Farm Management
 * Handles all farm-related operations including CRUD and spatial operations
 */
export class FarmService {
  private basePath = '/api/v1';

  /**
   * List all farms with optional filtering
   */
  async listFarms(params?: FarmListQueryParams): Promise<FarmListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.farmer_id) queryParams.append('farmer_id', params.farmer_id);
      if (params?.org_id) queryParams.append('org_id', params.org_id);
      if (params?.min_area) queryParams.append('min_area', params.min_area.toString());
      if (params?.max_area) queryParams.append('max_area', params.max_area.toString());

      const url = `${this.basePath}/farms${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response: AxiosResponse<FarmListResponse> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error('Error listing farms:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create a new farm with geographic boundaries and metadata
   */
  async createFarm(farmData: CreateFarmRequest): Promise<FarmResponse> {
    try {
      const response: AxiosResponse<FarmResponse> = await apiClient.post(
        `${this.basePath}/farms`,
        farmData
      );
      
      return response.data;
    } catch (error) {
      console.error('Error creating farm:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get farm by ID
   */
  async getFarmById(farmId: string): Promise<FarmResponse> {
    try {
      const response: AxiosResponse<FarmResponse> = await apiClient.get(
        `${this.basePath}/farms/${farmId}`
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching farm ${farmId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Update farm by ID
   */
  async updateFarm(farmId: string, farmData: Partial<CreateFarmRequest>): Promise<FarmResponse> {
    try {
      const response: AxiosResponse<FarmResponse> = await apiClient.put(
        `${this.basePath}/farms/${farmId}`,
        farmData
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error updating farm ${farmId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Delete farm by ID
   */
  async deleteFarm(farmId: string): Promise<BaseResponse> {
    try {
      const response: AxiosResponse<BaseResponse> = await apiClient.delete(
        `${this.basePath}/farms/${farmId}`
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error deleting farm ${farmId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get farm centroids for mapping
   */
  async getFarmCentroids(): Promise<any> {
    try {
      const response: AxiosResponse<any> = await apiClient.get(
        `${this.basePath}/getFarmCentroids`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching farm centroids:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get farm heatmap data
   */
  async getFarmHeatmap(radius: number = 5): Promise<any> {
    try {
      const response: AxiosResponse<any> = await apiClient.get(
        `${this.basePath}/getFarmHeatmap?radius=${radius}`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching farm heatmap:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Detect farm overlaps
   */
  async detectFarmOverlaps(params?: {
    limit?: number;
    min_overlap_area_ha?: number;
    org_id?: string;
  }): Promise<any> {
    try {
      const response: AxiosResponse<any> = await apiClient.post(
        `${this.basePath}/detectFarmOverlaps`,
        params || {}
      );
      
      return response.data;
    } catch (error) {
      console.error('Error detecting farm overlaps:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Validate geometry data
   */
  async validateGeometry(wkt: string, checkBounds: boolean = true): Promise<any> {
    try {
      const response: AxiosResponse<any> = await apiClient.post(
        `${this.basePath}/validateGeometry`,
        {
          wkt,
          check_bounds: checkBounds
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error validating geometry:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Rebuild spatial indexes (admin operation)
   */
  async rebuildSpatialIndexes(): Promise<any> {
    try {
      const response: AxiosResponse<any> = await apiClient.post(
        `${this.basePath}/rebuildSpatialIndexes`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error rebuilding spatial indexes:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get farms by farmer ID
   */
  async getFarmsByFarmerId(farmerId: string, params?: {
    page?: number;
    page_size?: number;
  }): Promise<FarmListResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('farmer_id', farmerId);
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

      const url = `${this.basePath}/farms?${queryParams.toString()}`;
      const response: AxiosResponse<FarmListResponse> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching farms for farmer ${farmerId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get farms by organization ID
   */
  async getFarmsByOrgId(orgId: string, params?: {
    page?: number;
    page_size?: number;
  }): Promise<FarmListResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('org_id', orgId);
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

      const url = `${this.basePath}/farms?${queryParams.toString()}`;
      const response: AxiosResponse<FarmListResponse> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching farms for organization ${orgId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get farms by area range
   */
  async getFarmsByAreaRange(minArea: number, maxArea: number, params?: {
    page?: number;
    page_size?: number;
  }): Promise<FarmListResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('min_area', minArea.toString());
      queryParams.append('max_area', maxArea.toString());
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

      const url = `${this.basePath}/farms?${queryParams.toString()}`;
      const response: AxiosResponse<FarmListResponse> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching farms by area range ${minArea}-${maxArea}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors consistently
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const errorData: ErrorResponse = error.response.data;
      return new Error(errorData.message || errorData.error || 'An error occurred');
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network error: No response from server');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

// Export singleton instance
export const farmService = new FarmService();

// Export class for custom instances
export default FarmService;