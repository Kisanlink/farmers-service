import axios, { AxiosInstance } from 'axios';

// Lookup data interfaces
export interface LookupItem {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LookupDataResponse {
  success: boolean;
  message: string;
  data: LookupItem[];
  timestamp?: string;
}

export class LookupService {
  private apiClient: AxiosInstance;
  private API_BASE_URL: string;

  constructor(baseURL: string = 'http://localhost:8000') {
    this.API_BASE_URL = baseURL;
    this.apiClient = axios.create({
      baseURL: this.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.apiClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  /**
   * Get irrigation sources lookup data
   * GET /api/v1/lookups/irrigation-sources
   */
  async getIrrigationSources(): Promise<LookupDataResponse> {
    try {
      const response = await this.apiClient.get<LookupDataResponse>('/api/v1/lookups/irrigation-sources');
      return response.data;
    } catch (error) {
      console.error('Error fetching irrigation sources:', error);
      throw error;
    }
  }

  /**
   * Get soil types lookup data
   * GET /api/v1/lookups/soil-types
   */
  async getSoilTypes(): Promise<LookupDataResponse> {
    try {
      const response = await this.apiClient.get<LookupDataResponse>('/api/v1/lookups/soil-types');
      return response.data;
    } catch (error) {
      console.error('Error fetching soil types:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const lookupService = new LookupService();
