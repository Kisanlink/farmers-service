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
