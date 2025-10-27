import axios, { AxiosResponse } from 'axios';
import {
  BulkOperationResponse,
  BulkOperationStatusResponse,
  BulkValidationResponse,
  FarmerBulkData,
  ApiConfig,
  ErrorResponse,
  BaseResponse
} from './types';

// API configuration
const API_CONFIG: ApiConfig = {
  baseUrl: (import.meta as any).env?.VITE_FARMER_SERVICE_URL || (import.meta as any).env?.VITE_FARMER_MODULE_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Accept': 'application/json'
  }
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[Bulk Service] ${config.method?.toUpperCase()} ${config.url}`);
    try {
      const token = (globalThis as any)?.localStorage?.getItem?.('access_token');
      if (token) {
        config.headers = config.headers || {};
        (config.headers as any)['Authorization'] = `Bearer ${token}`;
      }
    } catch (_) {
      // ignore
    }
    return config;
  },
  (error) => {
    console.error('[Bulk Service] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[Bulk Service] Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[Bulk Service] Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Bulk Service for Bulk Operations
 * Handles bulk farmer operations, validation, and status tracking
 */
export class BulkService {
  private basePath = '/api/v1';

  /**
   * Helper to read File/Blob as plain text
   */
  async readFileAsText(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file as any);
    });
  }

  /**
   * Add multiple farmers to an FPO in a single operation
   */
  async bulkAddFarmers(
    params: {
      fpo_org_id: string;
      input_format: 'csv' | 'excel' | 'json';
      processing_mode: 'sync' | 'async' | 'batch';
      file: File | Blob | string; // base64 or File
      options?: Record<string, any>;
    }
  ): Promise<BulkOperationResponse> {
    try {
      // This endpoint requires application/x-www-form-urlencoded
      const body = new URLSearchParams();
      body.append('fpo_org_id', params.fpo_org_id);
      body.append('input_format', params.input_format);
      body.append('processing_mode', params.processing_mode);
      // If CSV/text, send raw text; otherwise fall back to base64 data URL payload
      let fileField: string;
      if (typeof params.file === 'string') {
        fileField = params.file;
      } else if ((params.file as any).type && ((params.file as any).type.includes('csv') || (params.file as any).type.includes('text'))) {
        fileField = await this.readFileAsText(params.file as any);
      } else {
        const b64 = await new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve((r.result as string).split(',')[1] || '');
          r.onerror = reject;
          r.readAsDataURL(params.file as any);
        });
        fileField = b64;
      }
      body.append('file', fileField);
      if (params.options) body.append('options', JSON.stringify(params.options));

      // Use fetch to fully control headers for x-www-form-urlencoded
      const token = (globalThis as any)?.localStorage?.getItem?.('access_token');
      let fetchResp = await fetch(`${API_CONFIG.baseUrl}${this.basePath}/bulk/farmers/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: body.toString()
      });
      // If server rejects content type, retry with multipart/form-data
      if (!fetchResp.ok) {
        try {
          const errJson = await fetchResp.clone().json().catch(() => ({} as any));
          const msg = (errJson && (errJson.error || errJson.message || '')) as string;
          if (fetchResp.status === 415 || /unsupported content type/i.test(msg)) {
            const form = new FormData();
            form.append('fpo_org_id', params.fpo_org_id);
            form.append('input_format', params.input_format);
            form.append('processing_mode', params.processing_mode);
            if (typeof params.file === 'string') {
              const blob = new Blob([params.file], { type: 'text/plain' });
              form.append('file', blob, 'file.txt');
            } else {
              form.append('file', params.file as any);
            }
            if (params.options) form.append('options', JSON.stringify(params.options));

            fetchResp = await fetch(`${API_CONFIG.baseUrl}${this.basePath}/bulk/farmers/add`, {
              method: 'POST',
              headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              },
              body: form
            });
          }
        } catch (_) {
          // ignore and fall-through
        }
      }
      const json = await fetchResp.json();
      return json as BulkOperationResponse;
    } catch (error) {
      console.error('Error in bulk add farmers:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Download a template file for bulk farmer upload
   */
  async downloadBulkTemplate(): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await apiClient.get(
        `${this.basePath}/bulk/template`,
        {
          responseType: 'blob'
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error downloading bulk template:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Validate farmer data without actually processing it
   */
  async validateBulkData(
    payload: {
      fpo_org_id: string;
      input_format: 'csv' | 'excel' | 'json';
      data?: number[];
      farmers?: FarmerBulkData[];
      metadata?: Record<string, string>;
      org_id?: string;
      request_id?: string;
      request_type?: string;
      timestamp?: string;
      user_id?: string;
    }
  ): Promise<BulkValidationResponse> {
    try {
      const response: AxiosResponse<BulkValidationResponse> = await apiClient.post(
        `${this.basePath}/bulk/validate`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error validating bulk data:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get status of a bulk operation
   */
  async getBulkOperationStatus(operationId: string): Promise<BulkOperationStatusResponse> {
    try {
      const response: AxiosResponse<BulkOperationStatusResponse> = await apiClient.get(
        `${this.basePath}/bulk/status/${operationId}`
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching bulk operation status ${operationId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get result of a completed bulk operation
   */
  async getBulkOperationResult(operationId: string, params?: { format?: 'csv' | 'excel' | 'json'; include_all?: boolean }): Promise<Blob> {
    try {
      const query = new URLSearchParams();
      if (params?.format) query.append('format', params.format);
      if (typeof params?.include_all === 'boolean') query.append('include_all', String(params.include_all));
      const url = `${this.basePath}/bulk/results/${operationId}${query.toString() ? `?${query.toString()}` : ''}`;
      const response: AxiosResponse<Blob> = await apiClient.get(url, { responseType: 'blob' });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching bulk operation result ${operationId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Cancel a bulk operation
   */
  async cancelBulkOperation(operationId: string): Promise<BaseResponse> {
    try {
      const response: AxiosResponse<BaseResponse> = await apiClient.post(
        `${this.basePath}/bulk/cancel/${operationId}`
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error canceling bulk operation ${operationId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Retry a failed bulk operation
   */
  async retryBulkOperation(operationId: string, payload: any): Promise<BulkOperationResponse> {
    try {
      const response: AxiosResponse<BulkOperationResponse> = await apiClient.post(
        `${this.basePath}/bulk/retry/${operationId}`,
        { ...payload, operation_id: operationId },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error retrying bulk operation ${operationId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get list of bulk operations for an organization
   */
  async getBulkOperations(orgId: string, params?: {
    page?: number;
    page_size?: number;
    status?: string;
  }): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('org_id', orgId);
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.status) queryParams.append('status', params.status);

      const url = `${this.basePath}/bulk/operations?${queryParams.toString()}`;
      const response: AxiosResponse<any> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching bulk operations for org ${orgId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Validate individual farmer data
   */
  async validateFarmerData(farmerData: FarmerBulkData): Promise<BulkValidationResponse> {
    try {
      const response: AxiosResponse<BulkValidationResponse> = await apiClient.post(
        `${this.basePath}/bulk/validate/single`,
        farmerData
      );
      
      return response.data;
    } catch (error) {
      console.error('Error validating farmer data:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get bulk operation history
   */
  async getBulkOperationHistory(orgId: string, params?: {
    page?: number;
    page_size?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('org_id', orgId);
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.start_date) queryParams.append('start_date', params.start_date);
      if (params?.end_date) queryParams.append('end_date', params.end_date);

      const url = `${this.basePath}/bulk/history?${queryParams.toString()}`;
      const response: AxiosResponse<any> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching bulk operation history for org ${orgId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Download bulk operation report
   */
  async downloadBulkReport(operationId: string, format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await apiClient.get(
        `${this.basePath}/bulk/report/${operationId}?format=${format}`,
        {
          responseType: 'blob'
        }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error downloading bulk report ${operationId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get bulk operation statistics
   */
  async getBulkOperationStats(orgId: string, params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('org_id', orgId);
      
      if (params?.start_date) queryParams.append('start_date', params.start_date);
      if (params?.end_date) queryParams.append('end_date', params.end_date);

      const url = `${this.basePath}/bulk/stats?${queryParams.toString()}`;
      const response: AxiosResponse<any> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching bulk operation stats for org ${orgId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Helper method to download file from blob
   */
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Helper method to format file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Helper method to check if file is valid for bulk upload
   */
  validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 10MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'File must be CSV or Excel format' };
    }

    return { isValid: true };
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
export const bulkService = new BulkService();

// Export class for custom instances
export default BulkService;
