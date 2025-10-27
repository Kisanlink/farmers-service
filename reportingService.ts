import axios, { AxiosResponse } from 'axios';
import {
  ExportFarmerPortfolioResponse,
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

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[Reporting Service] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[Reporting Service] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[Reporting Service] Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[Reporting Service] Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Reporting Service for Farmer Analytics and Reports
 * Handles farmer portfolio exports, dashboard counters, and analytics
 */
export class ReportingService {
  private basePath = '/api/v1';

  /**
   * Export farmer portfolio data
   */
  async exportFarmerPortfolio(
    farmerId: string,
    options?: {
      format?: 'json' | 'csv';
      start_date?: string;
      end_date?: string;
      season?: 'RABI' | 'KHARIF' | 'ZAID' | 'PERENNIAL';
      org_id?: string;
    }
  ): Promise<ExportFarmerPortfolioResponse> {
    try {
      const requestData = {
        farmer_id: farmerId,
        format: options?.format || 'json',
        start_date: options?.start_date,
        end_date: options?.end_date,
        season: options?.season,
        org_id: options?.org_id
      };

      const response: AxiosResponse<ExportFarmerPortfolioResponse> = await apiClient.post(
        `${this.basePath}/reports/farmer-portfolio`,
        requestData
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error exporting farmer portfolio for ${farmerId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Export farmer portfolio by farmer ID from URL path
   */
  async exportFarmerPortfolioById(
    farmerId: string,
    options?: {
      format?: 'json' | 'csv';
      start_date?: string;
      end_date?: string;
      season?: 'RABI' | 'KHARIF' | 'ZAID' | 'PERENNIAL';
    }
  ): Promise<ExportFarmerPortfolioResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (options?.format) queryParams.append('format', options.format);
      if (options?.start_date) queryParams.append('start_date', options.start_date);
      if (options?.end_date) queryParams.append('end_date', options.end_date);
      if (options?.season) queryParams.append('season', options.season);

      const url = `${this.basePath}/reports/farmer-portfolio/${farmerId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response: AxiosResponse<ExportFarmerPortfolioResponse> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error(`Error exporting farmer portfolio by ID ${farmerId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get organization dashboard counters
   */
  async getOrgDashboardCounters(
    orgId: string,
    options?: {
      start_date?: string;
      end_date?: string;
      season?: 'RABI' | 'KHARIF' | 'ZAID' | 'PERENNIAL';
    }
  ): Promise<any> {
    try {
      const requestData = {
        org_id: orgId,
        start_date: options?.start_date,
        end_date: options?.end_date,
        season: options?.season
      };

      const response: AxiosResponse<any> = await apiClient.post(
        `${this.basePath}/reports/org-dashboard-counters`,
        requestData
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching dashboard counters for org ${orgId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get farmer analytics data
   */
  async getFarmerAnalytics(
    farmerId: string,
    options?: {
      start_date?: string;
      end_date?: string;
      metrics?: string[];
    }
  ): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('farmer_id', farmerId);
      
      if (options?.start_date) queryParams.append('start_date', options.start_date);
      if (options?.end_date) queryParams.append('end_date', options.end_date);
      if (options?.metrics) queryParams.append('metrics', options.metrics.join(','));

      const url = `${this.basePath}/reports/farmer-analytics?${queryParams.toString()}`;
      const response: AxiosResponse<any> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching farmer analytics for ${farmerId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get farm performance report
   */
  async getFarmPerformanceReport(
    farmId: string,
    options?: {
      start_date?: string;
      end_date?: string;
      include_activities?: boolean;
    }
  ): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('farm_id', farmId);
      
      if (options?.start_date) queryParams.append('start_date', options.start_date);
      if (options?.end_date) queryParams.append('end_date', options.end_date);
      if (options?.include_activities) queryParams.append('include_activities', options.include_activities.toString());

      const url = `${this.basePath}/reports/farm-performance?${queryParams.toString()}`;
      const response: AxiosResponse<any> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching farm performance report for ${farmId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get crop cycle analytics
   */
  async getCropCycleAnalytics(
    cropCycleId: string,
    options?: {
      include_activities?: boolean;
      include_yield?: boolean;
    }
  ): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('crop_cycle_id', cropCycleId);
      
      if (options?.include_activities) queryParams.append('include_activities', options.include_activities.toString());
      if (options?.include_yield) queryParams.append('include_yield', options.include_yield.toString());

      const url = `${this.basePath}/reports/crop-cycle-analytics?${queryParams.toString()}`;
      const response: AxiosResponse<any> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching crop cycle analytics for ${cropCycleId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get organization summary report
   */
  async getOrgSummaryReport(
    orgId: string,
    options?: {
      start_date?: string;
      end_date?: string;
      include_farmers?: boolean;
      include_farms?: boolean;
      include_activities?: boolean;
    }
  ): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('org_id', orgId);
      
      if (options?.start_date) queryParams.append('start_date', options.start_date);
      if (options?.end_date) queryParams.append('end_date', options.end_date);
      if (options?.include_farmers) queryParams.append('include_farmers', options.include_farmers.toString());
      if (options?.include_farms) queryParams.append('include_farms', options.include_farms.toString());
      if (options?.include_activities) queryParams.append('include_activities', options.include_activities.toString());

      const url = `${this.basePath}/reports/org-summary?${queryParams.toString()}`;
      const response: AxiosResponse<any> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching org summary report for ${orgId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get activity completion report
   */
  async getActivityCompletionReport(
    orgId: string,
    options?: {
      start_date?: string;
      end_date?: string;
      activity_type?: string;
      status?: string;
    }
  ): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('org_id', orgId);
      
      if (options?.start_date) queryParams.append('start_date', options.start_date);
      if (options?.end_date) queryParams.append('end_date', options.end_date);
      if (options?.activity_type) queryParams.append('activity_type', options.activity_type);
      if (options?.status) queryParams.append('status', options.status);

      const url = `${this.basePath}/reports/activity-completion?${queryParams.toString()}`;
      const response: AxiosResponse<any> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching activity completion report for org ${orgId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get KisanSathi performance report
   */
  async getKisanSathiPerformanceReport(
    kisanSathiId: string,
    options?: {
      start_date?: string;
      end_date?: string;
      include_farmers?: boolean;
    }
  ): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('kisan_sathi_id', kisanSathiId);
      
      if (options?.start_date) queryParams.append('start_date', options.start_date);
      if (options?.end_date) queryParams.append('end_date', options.end_date);
      if (options?.include_farmers) queryParams.append('include_farmers', options.include_farmers.toString());

      const url = `${this.basePath}/reports/kisansathi-performance?${queryParams.toString()}`;
      const response: AxiosResponse<any> = await apiClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching KisanSathi performance report for ${kisanSathiId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Export report data as file
   */
  async exportReport(
    reportType: string,
    params: Record<string, any>,
    format: 'csv' | 'xlsx' | 'pdf' = 'csv'
  ): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('format', format);
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const url = `${this.basePath}/reports/export/${reportType}?${queryParams.toString()}`;
      const response: AxiosResponse<Blob> = await apiClient.get(url, {
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error exporting ${reportType} report:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get available report types
   */
  async getAvailableReportTypes(): Promise<any> {
    try {
      const response: AxiosResponse<any> = await apiClient.get(
        `${this.basePath}/reports/types`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching available report types:', error);
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
   * Helper method to format date for API
   */
  formatDateForAPI(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Helper method to get date range for current season
   */
  getCurrentSeasonDateRange(season: 'RABI' | 'KHARIF' | 'ZAID' | 'PERENNIAL'): { start_date: string; end_date: string } {
    const currentYear = new Date().getFullYear();
    
    switch (season) {
      case 'RABI':
        return {
          start_date: `${currentYear}-10-01`,
          end_date: `${currentYear + 1}-03-31`
        };
      case 'KHARIF':
        return {
          start_date: `${currentYear}-06-01`,
          end_date: `${currentYear}-09-30`
        };
      case 'ZAID':
        return {
          start_date: `${currentYear}-03-01`,
          end_date: `${currentYear}-05-31`
        };
      case 'PERENNIAL':
        return {
          start_date: `${currentYear}-01-01`,
          end_date: `${currentYear}-12-31`
        };
      default:
        return {
          start_date: `${currentYear}-01-01`,
          end_date: `${currentYear}-12-31`
        };
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
export const reportingService = new ReportingService();

// Export class for custom instances
export default ReportingService;
