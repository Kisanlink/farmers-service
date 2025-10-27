import axios, { AxiosResponse } from 'axios';
import {
  ApiConfig,
  BaseResponse,
  ErrorResponse,
  FarmActivityData,
  FarmActivityListResponse,
  FarmActivityResponse,
  CreateActivityRequest,
  CompleteActivityRequest,
  ActivityListQueryParams
} from './types';

const API_CONFIG: ApiConfig = {
  baseUrl: (import.meta as any).env?.VITE_FARMER_SERVICE_URL || (import.meta as any).env?.VITE_FARMER_MODULE_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export class CropActivityService {
  private readonly API_BASE_URL: string;
  private readonly HEADERS: Record<string, string>;

  constructor() {
    this.API_BASE_URL = API_CONFIG.baseUrl;
    this.HEADERS = API_CONFIG.headers;
  }

  private get<T>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    return axios.get<T>(url, { params, headers: this.HEADERS, timeout: API_CONFIG.timeout });
  }

  private post<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return axios.post<T>(url, data, { headers: this.HEADERS, timeout: API_CONFIG.timeout });
  }

  private put<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return axios.put<T>(url, data, { headers: this.HEADERS, timeout: API_CONFIG.timeout });
  }

  /**
   * List farm activities with filtering and pagination.
   * GET /crops/activities
   */
  async listCropActivities(queryParams?: ActivityListQueryParams): Promise<FarmActivityListResponse> {
    try {
      const response = await this.get<FarmActivityListResponse>(`${this.API_BASE_URL}/crops/activities`, queryParams);
      return response.data;
    } catch (error) {
      console.error('Error listing crop activities:', error);
      throw error;
    }
  }

  /**
   * Create a new farm activity.
   * POST /crops/activities
   */
  async createCropActivity(data: CreateActivityRequest): Promise<FarmActivityResponse> {
    try {
      const response = await this.post<FarmActivityResponse>(`${this.API_BASE_URL}/crops/activities`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating crop activity:', error);
      throw error;
    }
  }

  /**
   * Retrieve a specific farm activity by its ID.
   * GET /crops/activities/{activity_id}
   */
  async getCropActivityById(activityId: string): Promise<FarmActivityResponse> {
    try {
      const response = await this.get<FarmActivityResponse>(`${this.API_BASE_URL}/crops/activities/${activityId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching crop activity ${activityId}:`, error);
      throw error;
    }
  }

  /**
   * Update an existing farm activity.
   * PUT /crops/activities/{activity_id}
   */
  async updateCropActivity(activityId: string, data: CreateActivityRequest): Promise<FarmActivityResponse> {
    try {
      const response = await this.put<FarmActivityResponse>(`${this.API_BASE_URL}/crops/activities/${activityId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating crop activity ${activityId}:`, error);
      throw error;
    }
  }

  /**
   * Complete a farm activity.
   * POST /crops/activities/{activity_id}/complete
   */
  async completeCropActivity(activityId: string, data: CompleteActivityRequest): Promise<FarmActivityResponse> {
    try {
      const response = await this.post<FarmActivityResponse>(`${this.API_BASE_URL}/crops/activities/${activityId}/complete`, data);
      return response.data;
    } catch (error) {
      console.error(`Error completing crop activity ${activityId}:`, error);
      throw error;
    }
  }
}

export const cropActivityService = new CropActivityService();
