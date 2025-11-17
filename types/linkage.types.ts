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
  farmer_id: string;
  org_id: string;
}
