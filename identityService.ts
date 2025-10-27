import axios, { AxiosResponse } from 'axios';
import {
  FarmerResponse,
  FarmerListResponse,
  CreateFarmerRequest,
  UpdateFarmerRequest,
  LinkFarmerRequest,
  ReassignKisanSathiRequest,
  FarmerListQueryParams,
  FarmerLinkageResponse,
  KisanSathiAssignmentResponse,
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
    // Strip surrounding quotes and any leading Bearer prefix; re-add correctly later
    const trimmed = raw.replace(/^"|"$/g, '');
    return trimmed.replace(/^Bearer\s+/i, '');
  } catch (_) {
    return null;
  }
}

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      (config.headers = config.headers || {} as any).Authorization = `Bearer ${token}`;
    }
    console.log(`[Identity Service] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[Identity Service] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[Identity Service] Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[Identity Service] Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Identity Service for Farmer Management
 * Handles all farmer CRUD operations and related identity management
 */
export class IdentityService {
  private basePath = '/api/v1/identity';

  /**
   * List farmers with filtering and pagination
   */
  async listFarmers(params?: FarmerListQueryParams): Promise<FarmerListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.aaa_org_id) queryParams.append('aaa_org_id', params.aaa_org_id);
      if (params?.kisan_sathi_user_id) queryParams.append('kisan_sathi_user_id', params.kisan_sathi_user_id);

      const url = `${this.basePath}/farmers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response: AxiosResponse<FarmerListResponse> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error('Error listing farmers:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create a new farmer profile
   */
  async createFarmer(farmerData: CreateFarmerRequest): Promise<FarmerResponse> {
    try {
      const response: AxiosResponse<FarmerResponse> = await apiClient.post(
        `${this.basePath}/farmers`,
        farmerData
      );
      
      return response.data;
    } catch (error) {
      console.error('Error creating farmer:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get farmer by farmer ID (primary key)
   */
  async getFarmerById(farmerId: string): Promise<FarmerResponse> {
    try {
      const response: AxiosResponse<FarmerResponse> = await apiClient.get(
        `${this.basePath}/farmers/id/${farmerId}`
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching farmer ${farmerId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Update farmer by farmer ID (primary key)
   */
  async updateFarmerById(farmerId: string, farmerData: UpdateFarmerRequest): Promise<FarmerResponse> {
    try {
      const response: AxiosResponse<FarmerResponse> = await apiClient.put(
        `${this.basePath}/farmers/id/${farmerId}`,
        farmerData
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error updating farmer ${farmerId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Delete farmer by farmer ID (primary key)
   */
  async deleteFarmerById(farmerId: string): Promise<BaseResponse> {
    try {
      const response: AxiosResponse<BaseResponse> = await apiClient.delete(
        `${this.basePath}/farmers/id/${farmerId}`
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error deleting farmer ${farmerId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get farmer by user ID only
   */
  async getFarmerByUserId(userId: string): Promise<FarmerResponse> {
    try {
      const response: AxiosResponse<FarmerResponse> = await apiClient.get(
        `${this.basePath}/farmers/user/${userId}`
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching farmer by user ID ${userId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Update farmer by user ID only
   */
  async updateFarmerByUserId(userId: string, farmerData: UpdateFarmerRequest): Promise<FarmerResponse> {
    try {
      const response: AxiosResponse<FarmerResponse> = await apiClient.put(
        `${this.basePath}/farmers/user/${userId}`,
        farmerData
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error updating farmer by user ID ${userId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Delete farmer by user ID only
   */
  async deleteFarmerByUserId(userId: string): Promise<BaseResponse> {
    try {
      const response: AxiosResponse<BaseResponse> = await apiClient.delete(
        `${this.basePath}/farmers/user/${userId}`
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error deleting farmer by user ID ${userId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get farmer by user ID and org ID
   */
  async getFarmerByUserIdAndOrgId(userId: string, orgId: string): Promise<FarmerResponse> {
    try {
      const response: AxiosResponse<FarmerResponse> = await apiClient.get(
        `${this.basePath}/farmers/user/${userId}/org/${orgId}`
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching farmer by user ID ${userId} and org ID ${orgId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Update farmer by user ID and org ID
   */
  async updateFarmerByUserIdAndOrgId(
    userId: string, 
    orgId: string, 
    farmerData: UpdateFarmerRequest
  ): Promise<FarmerResponse> {
    try {
      const response: AxiosResponse<FarmerResponse> = await apiClient.put(
        `${this.basePath}/farmers/user/${userId}/org/${orgId}`,
        farmerData
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error updating farmer by user ID ${userId} and org ID ${orgId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Delete farmer by user ID and org ID
   */
  async deleteFarmerByUserIdAndOrgId(userId: string, orgId: string): Promise<BaseResponse> {
    try {
      const response: AxiosResponse<BaseResponse> = await apiClient.delete(
        `${this.basePath}/farmers/user/${userId}/org/${orgId}`
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error deleting farmer by user ID ${userId} and org ID ${orgId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Link farmer to FPO
   */
  async linkFarmerToFPO(linkData: LinkFarmerRequest): Promise<FarmerLinkageResponse> {
    try {
      const response: AxiosResponse<FarmerLinkageResponse> = await apiClient.post(
        `${this.basePath}/farmers/link`,
        linkData
      );
      
      return response.data;
    } catch (error) {
      console.error('Error linking farmer to FPO:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get farmer linkage status
   */
  async getFarmerLinkageStatus(userId: string, orgId: string): Promise<FarmerLinkageResponse> {
    try {
      const response: AxiosResponse<FarmerLinkageResponse> = await apiClient.get(
        `${this.basePath}/farmers/link/user/${userId}/org/${orgId}`
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching farmer linkage status for user ${userId} and org ${orgId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Unlink farmer from FPO
   */
  async unlinkFarmerFromFPO(userId: string, orgId: string): Promise<FarmerLinkageResponse> {
    try {
      const response: AxiosResponse<FarmerLinkageResponse> = await apiClient.delete(
        `${this.basePath}/farmers/link/user/${userId}/org/${orgId}`
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error unlinking farmer from FPO for user ${userId} and org ${orgId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Reassign KisanSathi to farmer
   */
  async reassignKisanSathi(reassignData: ReassignKisanSathiRequest): Promise<KisanSathiAssignmentResponse> {
    try {
      const response: AxiosResponse<KisanSathiAssignmentResponse> = await apiClient.post(
        `${this.basePath}/farmers/reassign-kisansathi`,
        reassignData
      );
      
      return response.data;
    } catch (error) {
      console.error('Error reassigning KisanSathi:', error);
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
export const identityService = new IdentityService();

// Export class for custom instances
export default IdentityService;
