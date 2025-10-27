import axios, { AxiosResponse } from 'axios';
import {
  ApiConfig,
  BaseResponse,
  CreateKisanSathiRequest,
  AssignKisanSathiRequest,
  ReassignKisanSathiRequest,
  KisanSathiResponse,
  KisanSathiAssignmentResponse
} from './types';

const API_CONFIG: ApiConfig = {
  baseUrl: (import.meta as any).env?.VITE_FARMER_SERVICE_URL || (import.meta as any).env?.VITE_FARMER_MODULE_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export class KisanSathiService {
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
   * Create a new KisanSathi user.
   * POST /api/v1/kisansathi/create-user
   */
  async createKisanSathi(data: CreateKisanSathiRequest): Promise<KisanSathiResponse> {
    try {
      const response = await this.post<KisanSathiResponse>(`${this.API_BASE_URL}/api/v1/kisansathi/create-user`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating KisanSathi:', error);
      throw error;
    }
  }

  /**
   * Assign a KisanSathi to a farmer.
   * POST /api/v1/kisansathi/assign
   */
  async assignKisanSathi(data: AssignKisanSathiRequest): Promise<KisanSathiAssignmentResponse> {
    try {
      const response = await this.post<KisanSathiAssignmentResponse>(`${this.API_BASE_URL}/api/v1/kisansathi/assign`, data);
      return response.data;
    } catch (error) {
      console.error('Error assigning KisanSathi to farmer:', error);
      throw error;
    }
  }

  /**
   * Reassign or remove a KisanSathi from a farmer.
   * PUT /api/v1/kisansathi/reassign
   */
  async reassignKisanSathi(data: ReassignKisanSathiRequest): Promise<KisanSathiAssignmentResponse> {
    try {
      const response = await this.post<KisanSathiAssignmentResponse>(`${this.API_BASE_URL}/api/v1/kisansathi/reassign`, data);
      return response.data;
    } catch (error) {
      console.error('Error reassigning KisanSathi:', error);
      throw error;
    }
  }

  /**
   * Get KisanSathi assignment for a farmer and organization.
   * GET /api/v1/kisansathi/assignment/{farmer_id}/{org_id}
   */
  async getKisanSathiAssignment(farmerId: string, orgId: string): Promise<KisanSathiAssignmentResponse> {
    try {
      const response = await this.get<KisanSathiAssignmentResponse>(`${this.API_BASE_URL}/api/v1/kisansathi/assignment/${farmerId}/${orgId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching KisanSathi assignment for farmer ${farmerId} and org ${orgId}:`, error);
      throw error;
    }
  }

  /**
   * Get all KisanSathis.
   * GET /api/v1/kisansathi
   */
  async getAllKisanSathis(params?: { page?: number; page_size?: number; org_id?: string }): Promise<KisanSathiResponse> {
    try {
      const response = await this.get<KisanSathiResponse>(`${this.API_BASE_URL}/api/v1/kisansathi`, params);
      return response.data;
    } catch (error) {
      console.error('Error fetching all KisanSathis:', error);
      throw error;
    }
  }

  /**
   * Get KisanSathi by ID.
   * GET /api/v1/kisansathi/{id}
   */
  async getKisanSathiById(id: string): Promise<KisanSathiResponse> {
    try {
      const response = await this.get<KisanSathiResponse>(`${this.API_BASE_URL}/api/v1/kisansathi/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching KisanSathi with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update KisanSathi.
   * PUT /api/v1/kisansathi/{id}
   */
  async updateKisanSathi(id: string, data: Partial<CreateKisanSathiRequest>): Promise<KisanSathiResponse> {
    try {
      const response = await this.post<KisanSathiResponse>(`${this.API_BASE_URL}/api/v1/kisansathi/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating KisanSathi with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete KisanSathi.
   * DELETE /kisansathi/{id}
   */
  async deleteKisanSathi(id: string): Promise<BaseResponse> {
    try {
      const response = await this.post<BaseResponse>(`${this.API_BASE_URL}/kisansathi/${id}/delete`, {});
      return response.data;
    } catch (error) {
      console.error(`Error deleting KisanSathi with ID ${id}:`, error);
      throw error;
    }
  }
}

export const kisanSathiService = new KisanSathiService();
