import axios, { AxiosResponse } from 'axios';
import {
  ApiConfig,
  BaseResponse,
  ErrorResponse,
  HealthCheckResponse,
  SeedRequest,
  SeedResponse,
  PermissionCheckRequest,
  PermissionCheckResponse,
  AuditQueryParams,
  AuditResponse
} from './types';

const API_CONFIG: ApiConfig = {
  baseUrl: (import.meta as any).env?.VITE_FARMER_SERVICE_URL || (import.meta as any).env?.VITE_FARMER_MODULE_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export class AdminService {
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

  /**
   * Health check endpoint.
   * GET /admin/health
   */
  async getHealthStatus(): Promise<HealthCheckResponse> {
    try {
      const response = await this.get<HealthCheckResponse>(`${this.API_BASE_URL}/admin/health`);
      return response.data;
    } catch (error) {
      console.error('Error checking health status:', error);
      throw error;
    }
  }

  /**
   * Seed roles and permissions.
   * POST /admin/seed
   */
  async seedRolesAndPermissions(data?: SeedRequest): Promise<SeedResponse> {
    try {
      const response = await this.post<SeedResponse>(`${this.API_BASE_URL}/admin/seed`, data || {});
      return response.data;
    } catch (error) {
      console.error('Error seeding roles and permissions:', error);
      throw error;
    }
  }

  /**
   * Check user permission.
   * POST /admin/permissions/check
   */
  async checkUserPermission(data: PermissionCheckRequest): Promise<PermissionCheckResponse> {
    try {
      const response = await this.post<PermissionCheckResponse>(`${this.API_BASE_URL}/admin/permissions/check`, data);
      return response.data;
    } catch (error) {
      console.error('Error checking user permission:', error);
      throw error;
    }
  }

  /**
   * Get audit trail.
   * GET /admin/audit
   */
  async getAuditTrail(queryParams?: AuditQueryParams): Promise<AuditResponse> {
    try {
      const response = await this.get<AuditResponse>(`${this.API_BASE_URL}/admin/audit`, queryParams);
      return response.data;
    } catch (error) {
      console.error('Error fetching audit trail:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
