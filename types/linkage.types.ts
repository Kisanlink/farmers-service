/**
 * Linkage Service Types
 * Types for farmer-FPO linkage operations
 *
 * NOTE: Main linkage types are exported from identity.types.ts
 * to avoid duplication
 */

// Re-export from identity.types to maintain backward compatibility
export type {
  LinkFarmerRequest,
  FarmerLinkageData,
  FarmerLinkageResponse
} from './identity.types';

// This type is unique to linkage service
export interface UnlinkFarmerRequest {
  aaa_user_id: string;
  aaa_org_id: string;
}

/**
 * Bulk link/unlink status values
 */
export type BulkLinkageStatus = 'LINKED' | 'ALREADY_LINKED' | 'UNLINKED' | 'ALREADY_UNLINKED' | 'FAILED';

/**
 * Request for bulk linking farmers to an FPO
 */
export interface BulkLinkFarmersRequest {
  aaa_org_id: string;
  aaa_user_ids: string[];
  continue_on_error?: boolean;
}

/**
 * Request for bulk unlinking farmers from an FPO
 */
export interface BulkUnlinkFarmersRequest {
  aaa_org_id: string;
  aaa_user_ids: string[];
  continue_on_error?: boolean;
}

/**
 * Result for a single farmer in bulk operation
 */
export interface BulkLinkageResult {
  aaa_user_id: string;
  success: boolean;
  status: BulkLinkageStatus;
  message?: string;
}

/**
 * Data returned from bulk link/unlink operations
 */
export interface BulkLinkageData {
  aaa_org_id: string;
  total_count: number;
  success_count: number;
  failure_count: number;
  skipped_count: number;
  results: BulkLinkageResult[];
}

/**
 * Response for bulk link/unlink operations
 */
export interface BulkLinkageResponse {
  success: boolean;
  message: string;
  request_id?: string;
  data: BulkLinkageData;
}
