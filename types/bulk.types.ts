/**
 * Bulk Service Types
 * Types for bulk farmer operations
 */

export interface FarmerBulkData {
  user_id?: string;
  first_name: string;
  last_name?: string;
  phone?: string;
  email?: string;
  [key: string]: any;
}

/**
 * Input format for bulk operations
 */
export type BulkInputFormat = 'csv' | 'excel' | 'json';

/**
 * Processing mode for bulk operations
 */
export type BulkProcessingMode = 'sync' | 'async' | 'batch';

/**
 * Deduplication mode for bulk operations
 */
export type BulkDeduplicationMode = 'skip' | 'update' | 'error';

/**
 * Processing options for bulk add farmers
 */
export interface BulkProcessingOptions {
  validate_only?: boolean;
  continue_on_error?: boolean;
  chunk_size?: number;
  max_concurrency?: number;
  deduplication_mode?: BulkDeduplicationMode;
  assign_kisan_sathi?: boolean;
  kisan_sathi_user_id?: string;
}

/**
 * Request payload for bulk add farmers (JSON mode)
 */
export interface BulkAddFarmersRequest {
  fpo_org_id: string;
  input_format: BulkInputFormat;
  processing_mode: BulkProcessingMode;
  data?: string; // Base64 encoded file content for JSON mode
  farmers?: FarmerBulkData[]; // Direct farmer data array
  options?: BulkProcessingOptions;
}

/**
 * Parameters for bulk add farmers with file upload
 */
export interface BulkAddFarmersParams {
  fpo_org_id: string;
  input_format: BulkInputFormat;
  processing_mode: BulkProcessingMode;
  file?: File | Blob;
  options?: BulkProcessingOptions;
}

/**
 * Response data for bulk add farmers
 */
export interface BulkAddFarmersData {
  operation_id: string;
  status: string;
  status_url: string;
  result_url: string;
  message: string;
}

/**
 * Response for bulk add farmers
 */
export interface BulkAddFarmersResponse {
  success: boolean;
  message?: string;
  request_id?: string;
  data: BulkAddFarmersData;
}

export interface BulkOperationData {
  operation_id: string;
  org_id: string;
  operation_type: string;
  status: string;
  total_records: number;
  processed_records: number;
  success_count: number;
  error_count: number;
  created_at: string;
  completed_at?: string;
}

export interface BulkValidationData {
  is_valid: boolean;
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
  warnings: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

export interface BulkOperationResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: BulkOperationData;
}

export interface BulkOperationStatusResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: BulkOperationData;
}

export interface BulkValidationResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: BulkValidationData;
}
