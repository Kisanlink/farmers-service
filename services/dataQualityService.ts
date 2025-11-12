/**
 * Data Quality Service
 *
 * Service for data quality and validation operations.
 * Uses factory pattern for dependency injection and testability.
 */

import { ApiClient } from '../utils/apiClient';
import {
  ValidateGeometryRequest,
  ValidateGeometryResponse,
  DetectOverlapsRequest,
  DetectOverlapsResponse,
  ReconcileAAALinksRequest,
  ReconcileAAALinksResponse,
  RebuildSpatialIndexesRequest,
  RebuildSpatialIndexesResponse
} from '../types/dataQuality.types';

/**
 * Create data quality service with injected API client
 */
const createDataQualityService = (apiClient: ApiClient) => {
  const basePath = '/api/v1/data-quality';

  return {
    /**
     * Validate geometry data
     */
    validateGeometry: (data: ValidateGeometryRequest): Promise<ValidateGeometryResponse> => {
      return apiClient.post<ValidateGeometryResponse>(`${basePath}/validate-geometry`, data);
    },

    /**
     * Detect farm overlaps
     */
    detectFarmOverlaps: (data: DetectOverlapsRequest): Promise<DetectOverlapsResponse> => {
      return apiClient.post<DetectOverlapsResponse>(`${basePath}/detect-farm-overlaps`, data);
    },

    /**
     * Reconcile AAA links
     */
    reconcileAAALinks: (data: ReconcileAAALinksRequest): Promise<ReconcileAAALinksResponse> => {
      return apiClient.post<ReconcileAAALinksResponse>(`${basePath}/reconcile-aaa-links`, data);
    },

    /**
     * Rebuild spatial indexes
     */
    rebuildSpatialIndexes: (data: RebuildSpatialIndexesRequest): Promise<RebuildSpatialIndexesResponse> => {
      return apiClient.post<RebuildSpatialIndexesResponse>(`${basePath}/rebuild-spatial-indexes`, data);
    }
  };
};

export default createDataQualityService;
