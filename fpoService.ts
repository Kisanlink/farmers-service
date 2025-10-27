import axios, { AxiosResponse } from 'axios';
import {
  ApiConfig,
  BaseResponse,
  ErrorResponse,
  CreateFPORequest,
  RegisterFPORequest,
  FPOResponse,
  FPOReferenceResponse
} from './types';

const API_CONFIG: ApiConfig = {
  baseUrl: (import.meta as any).env?.VITE_FARMER_SERVICE_URL || (import.meta as any).env?.VITE_FARMER_MODULE_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export class FPOService {
  private readonly API_BASE_URL: string;
  private readonly HEADERS: Record<string, string>;

  constructor() {
    this.API_BASE_URL = API_CONFIG.baseUrl;
    this.HEADERS = API_CONFIG.headers;
  }

  private buildAuthHeaders(): Record<string, string> {
    try {
      // Try browser localStorage first
      const token = (globalThis as any)?.localStorage?.getItem?.('access_token');
      if (token) {
        return { ...this.HEADERS, Authorization: `Bearer ${token}` };
      }
    } catch (_) {
      // ignore if localStorage is not available
    }
    return { ...this.HEADERS };
  }

  private post<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    const headers = this.buildAuthHeaders();
    return axios.post<T>(url, data, { headers, timeout: API_CONFIG.timeout });
  }

  private get<T>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    const headers = this.buildAuthHeaders();
    return axios.get<T>(url, { params, headers, timeout: API_CONFIG.timeout });
  }

  /**
   * Create a new FPO Organization.
   * POST /api/v1/identity/fpo/create
   */
  async createFPO(data: CreateFPORequest): Promise<FPOResponse> {
    try {
      const response = await this.post<FPOResponse>(`${this.API_BASE_URL}/api/v1/identity/fpo/create`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating FPO:', error);
      throw error;
    }
  }

  /**
   * Register FPO Reference with AAA service.
   * POST /api/v1/identity/fpo/register
   */
  async registerFPO(data: RegisterFPORequest): Promise<FPOReferenceResponse> {
    try {
      const response = await this.post<FPOReferenceResponse>(`${this.API_BASE_URL}/api/v1/identity/fpo/register`, data);
      return response.data;
    } catch (error) {
      console.error('Error registering FPO:', error);
      throw error;
    }
  }

  /**
   * Get FPO Reference by AAA Organization ID.
   * GET /api/v1/identity/fpo/reference/{aaa_org_id}
   */
  async getFPOReference(aaaOrgId: string): Promise<FPOReferenceResponse> {
    try {
      const response = await this.get<FPOReferenceResponse>(`${this.API_BASE_URL}/api/v1/identity/fpo/reference/${aaaOrgId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching FPO reference for org ${aaaOrgId}:`, error);
      throw error;
    }
  }
}

export const fpoService = new FPOService();
