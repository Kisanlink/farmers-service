import axios, { AxiosResponse } from 'axios';
import {
  FarmActivityResponse,
  FarmActivityListResponse,
  CreateActivityRequest,
  CompleteActivityRequest,
  ActivityListQueryParams,
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

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers
});

// Helper to pull auth token from common storage keys
function getAuthToken(): string | null {
  try {
    const raw = (
      (typeof localStorage !== 'undefined' && (
        localStorage.getItem('access_token') ||
        localStorage.getItem('token') ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('jwt')
      )) ||
      (typeof sessionStorage !== 'undefined' && (
        sessionStorage.getItem('access_token') ||
        sessionStorage.getItem('token')
      )) ||
      null
    );
    if (!raw) return null;
    // Strip any existing "Bearer " prefix to avoid double-prefixing
    return raw.replace(/^Bearer\s+/i, '');
  } catch (_) {
    return null;
  }
}

// Request interceptor for logging and auth
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      (config.headers = config.headers || {} as any).Authorization = `Bearer ${token}`;
    }
    console.log(`[Activity Service] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[Activity Service] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[Activity Service] Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[Activity Service] Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Activity Service for Farm Activity Management
 * Handles all farm activity-related operations including CRUD and workflow management
 */
export class ActivityService {
  private basePath = '/api/v1/crops';

  /**
   * List farm activities with optional filtering
   */
  async listActivities(params?: ActivityListQueryParams): Promise<FarmActivityListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.crop_cycle_id) queryParams.append('crop_cycle_id', params.crop_cycle_id);
      if (params?.activity_type) queryParams.append('activity_type', params.activity_type);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.date_from) queryParams.append('date_from', params.date_from);
      if (params?.date_to) queryParams.append('date_to', params.date_to);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

      const url = `${this.basePath}/activities${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response: AxiosResponse<FarmActivityListResponse> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error('Error listing activities:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create a new farm activity within a crop cycle
   */
  async createActivity(activityData: CreateActivityRequest): Promise<FarmActivityResponse> {
    try {
      const response: AxiosResponse<FarmActivityResponse> = await apiClient.post(
        `${this.basePath}/activities`,
        activityData
      );
      
      return response.data;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get activity by ID
   */
  async getActivityById(activityId: string): Promise<FarmActivityResponse> {
    try {
      const response: AxiosResponse<FarmActivityResponse> = await apiClient.get(
        `${this.basePath}/activities/${activityId}`
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching activity ${activityId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Update activity by ID
   */
  async updateActivity(activityId: string, activityData: Partial<CreateActivityRequest>): Promise<FarmActivityResponse> {
    try {
      const response: AxiosResponse<FarmActivityResponse> = await apiClient.put(
        `${this.basePath}/activities/${activityId}`,
        activityData
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error updating activity ${activityId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Delete activity by ID
   */
  async deleteActivity(activityId: string): Promise<BaseResponse> {
    try {
      const response: AxiosResponse<BaseResponse> = await apiClient.delete(
        `${this.basePath}/activities/${activityId}`
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error deleting activity ${activityId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Complete an activity
   */
  async completeActivity(activityId: string, completionData: CompleteActivityRequest): Promise<FarmActivityResponse> {
    try {
      const response: AxiosResponse<FarmActivityResponse> = await apiClient.post(
        `${this.basePath}/activities/${activityId}/complete`,
        completionData
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error completing activity ${activityId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get activities by crop cycle ID
   */
  async getActivitiesByCropCycle(cropCycleId: string, params?: {
    page?: number;
    page_size?: number;
    status?: string;
  }): Promise<FarmActivityListResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('crop_cycle_id', cropCycleId);
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.status) queryParams.append('status', params.status);

      const url = `${this.basePath}/activities?${queryParams.toString()}`;
      const response: AxiosResponse<FarmActivityListResponse> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching activities for crop cycle ${cropCycleId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get activities by type
   */
  async getActivitiesByType(activityType: string, params?: {
    page?: number;
    page_size?: number;
    status?: string;
  }): Promise<FarmActivityListResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('activity_type', activityType);
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.status) queryParams.append('status', params.status);

      const url = `${this.basePath}/activities?${queryParams.toString()}`;
      const response: AxiosResponse<FarmActivityListResponse> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching activities of type ${activityType}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get activities by status
   */
  async getActivitiesByStatus(status: string, params?: {
    page?: number;
    page_size?: number;
  }): Promise<FarmActivityListResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('status', status);
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

      const url = `${this.basePath}/activities?${queryParams.toString()}`;
      const response: AxiosResponse<FarmActivityListResponse> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching activities with status ${status}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get activities by date range
   */
  async getActivitiesByDateRange(dateFrom: string, dateTo: string, params?: {
    page?: number;
    page_size?: number;
    status?: string;
  }): Promise<FarmActivityListResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('date_from', dateFrom);
      queryParams.append('date_to', dateTo);
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.status) queryParams.append('status', params.status);

      const url = `${this.basePath}/activities?${queryParams.toString()}`;
      const response: AxiosResponse<FarmActivityListResponse> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching activities from ${dateFrom} to ${dateTo}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get pending activities (not completed)
   */
  async getPendingActivities(params?: {
    page?: number;
    page_size?: number;
    crop_cycle_id?: string;
  }): Promise<FarmActivityListResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('status', 'pending');
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.crop_cycle_id) queryParams.append('crop_cycle_id', params.crop_cycle_id);

      const url = `${this.basePath}/activities?${queryParams.toString()}`;
      const response: AxiosResponse<FarmActivityListResponse> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching pending activities:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get completed activities
   */
  async getCompletedActivities(params?: {
    page?: number;
    page_size?: number;
    crop_cycle_id?: string;
  }): Promise<FarmActivityListResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('status', 'completed');
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.crop_cycle_id) queryParams.append('crop_cycle_id', params.crop_cycle_id);

      const url = `${this.basePath}/activities?${queryParams.toString()}`;
      const response: AxiosResponse<FarmActivityListResponse> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching completed activities:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get overdue activities (planned date has passed but not completed)
   */
  async getOverdueActivities(params?: {
    page?: number;
    page_size?: number;
    crop_cycle_id?: string;
  }): Promise<FarmActivityListResponse> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const queryParams = new URLSearchParams();
      queryParams.append('status', 'pending');
      queryParams.append('date_to', today);
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.crop_cycle_id) queryParams.append('crop_cycle_id', params.crop_cycle_id);

      const url = `${this.basePath}/activities?${queryParams.toString()}`;
      const response: AxiosResponse<FarmActivityListResponse> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching overdue activities:', error);
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
export const activityService = new ActivityService();

// Export class for custom instances
export default ActivityService;
