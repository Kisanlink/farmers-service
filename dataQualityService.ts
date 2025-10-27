import axios, { AxiosResponse } from 'axios';
import {
  ApiConfig,
  BaseResponse,
  ErrorResponse,
  ValidateGeometryRequest,
  ValidateGeometryResponse,
  DetectOverlapsRequest,
  DetectOverlapsResponse,
  ReconcileAAALinksRequest,
  ReconcileAAALinksResponse,
  RebuildSpatialIndexesRequest,
  RebuildSpatialIndexesResponse
} from './types';

const API_CONFIG: ApiConfig = {
  baseUrl: (import.meta as any).env?.VITE_FARMER_SERVICE_URL || (import.meta as any).env?.VITE_FARMER_MODULE_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export class DataQualityService {
  private readonly API_BASE_URL: string;
  private readonly HEADERS: Record<string, string>;

  constructor() {
    this.API_BASE_URL = API_CONFIG.baseUrl;
    this.HEADERS = API_CONFIG.headers;
  }

  private post<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return axios.post<T>(url, data, { headers: this.HEADERS, timeout: API_CONFIG.timeout });
  }

  /**
   * Validate geometry data.
   * POST /api/v1/data-quality/validate-geometry
   */
  async validateGeometry(data: ValidateGeometryRequest): Promise<ValidateGeometryResponse> {
    try {
      const response = await this.post<ValidateGeometryResponse>(`${this.API_BASE_URL}/api/v1/data-quality/validate-geometry`, data);
      return response.data;
    } catch (error) {
      console.error('Error validating geometry:', error);
      throw error;
    }
  }

  /**
   * Detect farm overlaps.
   * POST /api/v1/data-quality/detect-farm-overlaps
   */
  async detectFarmOverlaps(data: DetectOverlapsRequest): Promise<DetectOverlapsResponse> {
    try {
      const response = await this.post<DetectOverlapsResponse>(`${this.API_BASE_URL}/api/v1/data-quality/detect-farm-overlaps`, data);
      return response.data;
    } catch (error) {
      console.error('Error detecting farm overlaps:', error);
      throw error;
    }
  }

  /**
   * Reconcile AAA links.
   * POST /api/v1/data-quality/reconcile-aaa-links
   */
  async reconcileAAALinks(data: ReconcileAAALinksRequest): Promise<ReconcileAAALinksResponse> {
    try {
      const response = await this.post<ReconcileAAALinksResponse>(`${this.API_BASE_URL}/api/v1/data-quality/reconcile-aaa-links`, data);
      return response.data;
    } catch (error) {
      console.error('Error reconciling AAA links:', error);
      throw error;
    }
  }

  /**
   * Rebuild spatial indexes.
   * POST /api/v1/data-quality/rebuild-spatial-indexes
   */
  async rebuildSpatialIndexes(data: RebuildSpatialIndexesRequest): Promise<RebuildSpatialIndexesResponse> {
    try {
      const response = await this.post<RebuildSpatialIndexesResponse>(`${this.API_BASE_URL}/api/v1/data-quality/rebuild-spatial-indexes`, data);
      return response.data;
    } catch (error) {
      console.error('Error rebuilding spatial indexes:', error);
      throw error;
    }
  }
}

export const dataQualityService = new DataQualityService();
