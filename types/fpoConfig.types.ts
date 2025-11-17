/**
 * FPO Configuration Service Types
 * Types for FPO configuration and ERP integration management
 */

/**
 * Features configuration for FPO
 */
export interface FPOFeatures {
  ecommerce_enabled?: boolean;
  inventory_management?: boolean;
  order_tracking?: boolean;
  payment_gateway?: boolean;
  [key: string]: any; // Allow additional dynamic features
}

/**
 * Contact information for FPO
 */
export interface FPOContact {
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  [key: string]: any; // Allow additional contact fields
}

/**
 * Business hours configuration
 */
export interface FPOBusinessHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
  timezone?: string;
  [key: string]: any; // Allow additional schedule fields
}

/**
 * Additional metadata for FPO configuration
 */
export interface FPOMetadata {
  [key: string]: any;
}

/**
 * API health status enum
 */
export enum APIHealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  DOWN = 'down',
  UNKNOWN = 'unknown'
}

/**
 * FPO Configuration data structure
 */
export interface FPOConfigData {
  fpo_id: string;
  fpo_name: string;
  erp_base_url: string;
  erp_api_version: string;
  features?: FPOFeatures;
  contact?: FPOContact;
  business_hours?: FPOBusinessHours;
  metadata?: FPOMetadata;
  api_health_status?: APIHealthStatus;
  last_synced_at?: string;
  sync_interval_minutes?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Request to create a new FPO configuration
 */
export interface CreateFPOConfigRequest {
  fpo_id: string;
  fpo_name: string;
  erp_base_url: string;
  erp_api_version: string;
  features?: FPOFeatures;
  contact?: FPOContact;
  business_hours?: FPOBusinessHours;
  metadata?: FPOMetadata;
  sync_interval_minutes?: number;
}

/**
 * Request to update an existing FPO configuration
 */
export interface UpdateFPOConfigRequest {
  fpo_name?: string;
  erp_base_url?: string;
  erp_api_version?: string;
  features?: FPOFeatures;
  contact?: FPOContact;
  business_hours?: FPOBusinessHours;
  metadata?: FPOMetadata;
  sync_interval_minutes?: number;
}

/**
 * Query parameters for listing FPO configurations
 */
export interface ListFPOConfigsQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Health check data for FPO's ERP endpoint
 */
export interface FPOHealthCheckData {
  fpo_id: string;
  status: APIHealthStatus;
  response_time_ms?: number;
  last_checked_at: string;
  error_message?: string;
}

/**
 * Response for single FPO configuration
 */
export interface FPOConfigResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: FPOConfigData;
}

/**
 * Response for FPO configuration list
 */
export interface FPOConfigListResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: FPOConfigData[];
  page: number;
  page_size: number;
  total: number;
}

/**
 * Response for FPO health check
 */
export interface FPOHealthCheckResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: FPOHealthCheckData;
}
