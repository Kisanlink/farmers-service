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
 * Matches the API guide specification
 */
export interface FPOContact {
  email?: string;
  phone?: string;
  contact_person?: string; // Contact person name (from API guide example)
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
 * 
 * When configuration is not set up, metadata will contain:
 * {
 *   "config_status": "not_configured",
 *   "message": "FPO configuration has not been set up yet"
 * }
 */
export interface FPOMetadata {
  config_status?: FPOConfigStatus; // 'configured' | 'not_configured' | 'pending' | 'error'
  message?: string; // Status message (e.g., "FPO configuration has not been set up yet")
  [key: string]: any; // Allow additional metadata fields
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
 * 
 * Matches the API guide specification exactly. This is the minimal configuration
 * structure for ERP integration.
 * 
 * When configuration is not set up, the following fields will be empty:
 * - fpo_name: "" (empty string)
 * - erp_base_url: "" (empty string)
 * - erp_ui_base_url: "" (empty string)
 * - contact: {} (empty object)
 * - business_hours: {} (empty object)
 * - metadata: { config_status: "not_configured", message: "FPO configuration has not been set up yet" }
 */
export interface FPOConfigData {
  id: string; // FPO configuration ID (same as aaa_org_id) - always present in responses
  aaa_org_id: string; // AAA Organization ID (required)
  fpo_id?: string; // Deprecated: Use aaa_org_id instead
  fpo_name: string; // Display name of the FPO (required, but may be empty string "" if not configured)
  erp_base_url: string; // Base URL of the ERP API (required, but may be empty string "" if not configured)
  erp_ui_base_url?: string; // Optional UI base URL for ERP system (may be empty string "" if not configured)
  contact?: FPOContact | Record<string, any>; // Contact information (optional, may be empty object {} if not configured)
  business_hours?: FPOBusinessHours | Record<string, any>; // Operating hours (optional, may be empty object {} if not configured)
  metadata?: FPOMetadata; // Additional metadata (optional, contains config_status when not configured)
  created_at: string; // ISO timestamp of creation (required, always present in responses)
  updated_at: string; // ISO timestamp of last update (required, always present in responses)
}

/**
 * Request to create a new FPO configuration
 * 
 * Matches the API guide specification exactly. Required fields:
 * - aaa_org_id
 * - fpo_name
 * - erp_base_url
 * 
 * All other fields are optional.
 */
export interface CreateFPOConfigRequest {
  aaa_org_id: string; // Required: AAA Organization ID
  fpo_name: string; // Required: Display name of the FPO
  erp_base_url: string; // Required: Base URL of the ERP API (must be valid URL format)
  erp_ui_base_url?: string; // Optional: Base URL of the ERP UI for href links
  contact?: FPOContact | Record<string, any>; // Optional: Contact information
  business_hours?: FPOBusinessHours | Record<string, any>; // Optional: Operating hours
  metadata?: FPOMetadata; // Optional: Additional metadata
}

/**
 * Request to update an existing FPO configuration
 * 
 * Matches the API guide specification exactly. All fields are optional - only send
 * fields you want to update. Partial updates are supported.
 */
export interface UpdateFPOConfigRequest {
  fpo_name?: string; // Optional: Updated display name
  erp_base_url?: string; // Optional: Updated ERP API base URL (must be valid URL format if provided)
  erp_ui_base_url?: string; // Optional: Updated ERP UI base URL for href links
  contact?: FPOContact | Record<string, any>; // Optional: Updated contact info (replaces entire object)
  business_hours?: FPOBusinessHours | Record<string, any>; // Optional: Updated business hours (replaces entire object)
  metadata?: FPOMetadata; // Optional: Updated metadata (replaces entire object)
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
 * Health check status type matching API guide
 */
export type FPOHealthStatus = 'healthy' | 'unhealthy' | 'not_configured';

/**
 * Health check data for FPO's ERP endpoint
 * Matches the API guide specification exactly
 * 
 * When status is "not_configured":
 * - erp_base_url: "" (empty string)
 * - erp_ui_base_url: "" (empty string)
 * - error: "FPO configuration has not been set up yet"
 * - response_time_ms: not present
 * 
 * When status is "unhealthy":
 * - erp_base_url: contains the configured URL
 * - erp_ui_base_url: contains the configured URL (if set)
 * - error: contains error message (e.g., "dial tcp: lookup erp-api.greenvalley.com: no such host")
 * - response_time_ms: may be present
 * 
 * When status is "healthy":
 * - erp_base_url: contains the configured URL
 * - erp_ui_base_url: contains the configured URL (if set)
 * - response_time_ms: present (e.g., 145)
 * - error: not present
 */
export interface FPOHealthCheckData {
  aaa_org_id: string;
  fpo_id?: string; // Deprecated: Use aaa_org_id instead
  erp_base_url: string; // Base URL of the ERP API (empty string "" when not_configured)
  erp_ui_base_url?: string; // Base URL of the ERP UI (optional, empty string "" when not_configured)
  status: FPOHealthStatus; // 'healthy' | 'unhealthy' | 'not_configured'
  last_checked: string; // ISO timestamp of last health check (e.g., "2025-11-19T15:50:00Z")
  response_time_ms?: number; // Response time in milliseconds (optional, present when healthy/unhealthy)
  error?: string; // Error message if status is unhealthy or not_configured (optional, present when unhealthy/not_configured)
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
 * Matches the API guide specification - message field is optional (not shown in examples)
 */
export interface FPOHealthCheckResponse {
  success: boolean;
  message?: string; // Optional: not shown in API guide examples but may be present
  request_id: string;
  data: FPOHealthCheckData;
}

/**
 * Response for FPO configuration deletion
 * Matches the API guide specification - no data field in delete response
 */
export interface FPOConfigDeleteResponse {
  success: boolean;
  message: string;
  request_id: string;
}
