import axios, { AxiosResponse } from 'axios';
import {
  ApiConfig,
  BaseResponse,
  ErrorResponse,
  LinkFarmerRequest,
  UnlinkFarmerRequest,
  FarmerLinkageResponse
} from './types';

const API_CONFIG: ApiConfig = {
  baseUrl: (import.meta as any).env?.VITE_FARMER_SERVICE_URL || (import.meta as any).env?.VITE_FARMER_MODULE_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export class LinkageService {
  private readonly API_BASE_URL: string;
  private readonly HEADERS: Record<string, string>;

  constructor() {
    this.API_BASE_URL = API_CONFIG.baseUrl;
    this.HEADERS = API_CONFIG.headers;
  }

  private post<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return axios.post<T>(url, data, { 
      headers: this.HEADERS, 
      timeout: API_CONFIG.timeout 
    });
  }

  private get<T>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    return axios.get<T>(url, { params, headers: this.HEADERS, timeout: API_CONFIG.timeout });
  }

  /**
   * Link a farmer to an FPO organization.
   * POST /identity/link-farmer
   */
  async linkFarmer(data: LinkFarmerRequest): Promise<FarmerLinkageResponse> {
    try {
      const response = await this.post<FarmerLinkageResponse>(`${this.API_BASE_URL}/identity/link-farmer`, data);
      return response.data;
    } catch (error) {
      console.error('Error linking farmer to FPO:', error);
      throw error;
    }
  }

  /**
   * Unlink a farmer from an FPO organization.
   * POST /identity/unlink-farmer
   */
  async unlinkFarmer(data: UnlinkFarmerRequest): Promise<FarmerLinkageResponse> {
    try {
      const response = await this.post<FarmerLinkageResponse>(`${this.API_BASE_URL}/identity/unlink-farmer`, data);
      return response.data;
    } catch (error) {
      console.error('Error unlinking farmer from FPO:', error);
      throw error;
    }
  }

  /**
   * Get farmer linkage status with an organization.
   * GET /identity/linkage/{farmer_id}/{org_id}
   */
  async getFarmerLinkage(farmerId: string, orgId: string): Promise<FarmerLinkageResponse> {
    try {
      const response = await this.get<FarmerLinkageResponse>(`${this.API_BASE_URL}/identity/linkage/${farmerId}/${orgId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching farmer linkage for farmer ${farmerId} and org ${orgId}:`, error);
      throw error;
    }
  }
}

export const linkageService = new LinkageService();
