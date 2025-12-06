/**
 * FPO Configuration Service Types
 * Types for FPO configuration and ERP integration management
 */

/**
 * ERP Type enum
 */
export type ERPType = 'SAP' | 'ORACLE' | 'MICROSOFT_DYNAMICS' | 'ODOO' | 'CUSTOM';

/**
 * Auth Method enum
 */
export type AuthMethod = 'API_KEY' | 'OAUTH2' | 'BASIC';

/**
 * API Key credentials
 */
export interface APIKeyCredentials {
  api_key: string;
  api_secret?: string;
}

/**
 * OAuth2 credentials
 */
export interface OAuth2Credentials {
  client_id: string;
  client_secret: string;
  authorization_url: string;
  token_url: string;
  scope?: string;
}

/**
 * Basic Auth credentials
 */
export interface BasicAuthCredentials {
  username: string;
  password: string;
}

/**
 * Credentials union type
 */
export type ERPCredentials = APIKeyCredentials | OAuth2Credentials | BasicAuthCredentials;

/**
 * Features configuration for FPO
 * Now includes ERP integration details
 */
export interface FPOFeatures {
  // ERP Integration fields
  erp_type?: ERPType;
  auth_method?: AuthMethod;
  credentials?: ERPCredentials;
  api_endpoint?: string;

  // Integration settings
  auto_sync_enabled?: boolean;
  sync_frequency?: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'MANUAL';
  sync_direction?: 'TO_ERP' | 'FROM_ERP' | 'BIDIRECTIONAL';
  webhooks_enabled?: boolean;
  webhook_url?: string;
  webhook_secret?: string;

  // Advanced settings
  request_timeout?: number;
  retry_attempts?: number;
  logging_enabled?: boolean;
  custom_headers?: Record<string, string>;

  // Feature flags
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
 * Configuration status enum
 */
export type FPOConfigStatus = 'configured' | 'not_configured' | 'pending' | 'error';

/**
 * FPO Configuration data structure
 */
export interface FPOConfigData {
  id?: string; // FPO configuration ID (same as aaa_org_id)
  aaa_org_id: string; // AAA Organization ID
  fpo_id?: string; // Deprecated: Use aaa_org_id instead
  fpo_name: string;
  erp_base_url: string;
  erp_ui_base_url?: string; // Optional UI base URL for ERP system
  erp_api_version?: string; // Now optional
  features?: FPOFeatures;
  contact?: FPOContact;
  business_hours?: FPOBusinessHours;
  metadata?: FPOMetadata;
  config_status?: FPOConfigStatus; // Configuration status
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
  aaa_org_id: string;
  fpo_name: string;
  erp_base_url: string;
  erp_ui_base_url?: string;
  erp_api_version?: string;
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
  erp_ui_base_url?: string;
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
  aaa_org_id: string;
  fpo_id?: string; // Deprecated: Use aaa_org_id instead
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
