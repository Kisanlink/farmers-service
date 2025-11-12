/**
 * Linkage Service Types
 * Types for farmer-FPO linkage operations
 */

export interface LinkFarmerRequest {
  farmer_id: string;
  org_id: string;
  role?: string;
}

export interface UnlinkFarmerRequest {
  farmer_id: string;
  org_id: string;
}

export interface FarmerLinkageData {
  farmer_id: string;
  org_id: string;
  role?: string;
  linked_at: string;
  is_active: boolean;
}

export interface FarmerLinkageResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: FarmerLinkageData;
}
