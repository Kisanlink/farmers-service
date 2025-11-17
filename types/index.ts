/**
 * Common Type Definitions for Farmers Service
 *
 * Shared types used across multiple services.
 */

/**
 * Base response structure for all API responses
 */
export interface BaseResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
  request_id?: string;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  page: number;
  page_size: number;
  total: number;
  total_pages?: number;
  timestamp?: string;
  request_id?: string;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  details?: Record<string, unknown>;
  correlation_id?: string;
  timestamp?: string;
}

/**
 * Lookup item structure (used for reference data)
 */
export interface LookupItem {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Lookup data response
 */
export type LookupDataResponse = BaseResponse<LookupItem[]>;

/**
 * Common pagination parameters
 */
export interface PaginationParams {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Common date range filter
 */
export interface DateRangeFilter {
  start_date?: string;
  end_date?: string;
}

/**
 * Common metadata structure
 */
export interface Metadata {
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

/**
 * Address structure
 */
export interface Address {
  street?: string;
  village?: string;
  block?: string;
  district?: string;
  state?: string;
  country?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Geometry structure (GeoJSON)
 */
export interface Geometry {
  type: 'Point' | 'Polygon' | 'MultiPolygon' | 'LineString';
  coordinates: number[] | number[][] | number[][][];
}

/**
 * Activity status enum
 */
export type ActivityStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';

/**
 * Crop cycle status enum
 */
export type CropCycleStatus = 'planned' | 'active' | 'harvested' | 'failed' | 'archived';

/**
 * Linkage status enum
 */
export type LinkageStatus = 'pending' | 'active' | 'inactive' | 'suspended';

/**
 * Season enum
 */
export type Season = 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial';

/**
 * Re-export for convenience
 */
export * from './lookup.types';
export * from './identity.types';
export * from './farm.types';
export * from './activity.types';
export * from './fpo.types';
export * from './linkage.types';
export * from './kisanSathi.types';
export * from './bulk.types';
export * from './reporting.types';
export * from './admin.types';
export * from './dataQuality.types';
export * from './crop.types';
export * from './stages.types';
// Note: cropStages exports are available via direct import to avoid conflicts with stages.types
export * as CropStagesTypes from './cropStages.types';
export * from './cropCycles.types';
export * from './organization.types';
export * from './fpoConfig.types';
