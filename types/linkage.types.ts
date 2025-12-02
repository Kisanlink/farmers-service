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
